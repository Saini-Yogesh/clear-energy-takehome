import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getBaseUrl, API_TIMEOUT } from '../constants';
import { Logger } from '../utils/logger';

// Dynamic in-memory auth token
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Generates unique request identifier
const generateId = () => {
  return Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11);
};

export interface CustomRequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
  idempotencyKey?: string;
  skipRetry?: boolean;
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Injects X-Request-ID, Authorization header, and X-Idempotency-Key
apiClient.interceptors.request.use(
  (config: CustomRequestConfig) => {
    // Generate and inject request ID
    const requestId = generateId();
    config.headers['X-Request-ID'] = requestId;

    // Attach auth token if present
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Attach idempotency key to state-modifying requests
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase() || '');
    if (isWrite) {
      const idempotencyKey = config.idempotencyKey || generateId();
      config.headers['X-Idempotency-Key'] = idempotencyKey;
    }

    Logger.debug(`[API Request] [${config.method?.toUpperCase()}] ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    Logger.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;

// Determines if request can be retried (transient server issues or network failures)
const isRetryableError = (error: AxiosError) => {
  if (error.code === 'ERR_CANCELED') return false; // Aborted requests shouldn't retry

  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNABORTED' ||
    (error.response?.status && [502, 503, 504].includes(error.response.status))
  );
};

// Response Interceptor: Logs successful calls and retries failures on transient errors
apiClient.interceptors.response.use(
  (response) => {
    Logger.debug(`[API Response] ${response.config.url} | Status: ${response.status}`);
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as CustomRequestConfig;

    // Reject immediately if no config or retry is skipped/not applicable
    if (!config || config.skipRetry || !isRetryableError(error)) {
      Logger.error(
        `[API Response Error] ${config?.url} | Status: ${error.response?.status || 'NO_RESPONSE'}`,
      );
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount ?? 0;

    if (config.retryCount >= MAX_RETRIES) {
      Logger.error(`[API Retry Limit Exceeded] ${config.url} | Tried ${MAX_RETRIES} times.`);
      return Promise.reject(error);
    }

    config.retryCount += 1;
    // Exponential backoff delay calculation
    const delay = BASE_RETRY_DELAY * Math.pow(2, config.retryCount - 1);

    Logger.warn(
      `[API Retry] ${config.url} | Attempt ${config.retryCount}/${MAX_RETRIES} in ${delay}ms`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return apiClient(config);
  },
);

export { apiClient };
