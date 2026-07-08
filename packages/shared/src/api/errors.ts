import axios from 'axios';
import { AppError } from '../types';

/**
 * Parses any caught error (Axios, Network, Timeout, Cancellation, JSON parse)
 * into a structured, user-friendly AppError object.
 */
export const parseApiError = (error: unknown): AppError => {
  if (axios.isCancel(error)) {
    return {
      message: 'Request was cancelled.',
      code: 'CANCELLED',
      technicalMessage: error.message || 'Cancelled by client',
    };
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Check if network error (e.g. offline)
    if (error.code === 'ERR_NETWORK' || error.message.toLowerCase().includes('network error')) {
      return {
        message: 'No internet connection. Please check your network and try again.',
        code: 'NETWORK_ERROR',
        technicalMessage: error.message,
      };
    }

    // Check if request timed out
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        message: 'The request timed out. Please check your connection and try again.',
        code: 'TIMEOUT',
        status: 408,
        technicalMessage: error.message,
      };
    }

    let message = 'An unexpected error occurred. Please try again.';
    let code = 'UNKNOWN_ERROR';

    if (status) {
      switch (status) {
        case 401:
          message = 'Session expired. Please sign in again.';
          code = 'UNAUTHORIZED';
          break;
        case 403:
          message = 'You do not have permission to access this resource.';
          code = 'FORBIDDEN';
          break;
        case 404:
          message = 'The requested resource could not be found.';
          code = 'NOT_FOUND';
          break;
        case 409:
          message = 'A conflict occurred while processing the request.';
          code = 'CONFLICT';
          break;
        case 422:
          message = 'Validation failed. Please verify your input.';
          code = 'VALIDATION_ERROR';
          break;
        case 429:
          message = 'Too many requests. Please slow down and try again later.';
          code = 'TOO_MANY_REQUESTS';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          message =
            'Our servers are experiencing temporary difficulties. Please try again shortly.';
          code = 'SERVER_ERROR';
          break;
      }
    }

    // Check if server response returned a custom message or detail object
    const serverMessage =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message: string }).message
        : undefined;

    return {
      message: serverMessage || message,
      code,
      status,
      details: data,
      technicalMessage: error.message,
    };
  }

  // Handle standard JS errors
  if (error instanceof Error) {
    // Check for JSON parser failures
    if (error.name === 'SyntaxError' || error.message.includes('JSON')) {
      return {
        message: 'Unable to parse server response.',
        code: 'MALFORMED_RESPONSE',
        technicalMessage: error.message,
      };
    }

    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      technicalMessage: error.stack,
    };
  }

  return {
    message: 'An unknown error occurred.',
    code: 'UNKNOWN_ERROR',
  };
};
