declare const __DEV__: boolean;

export const Logger = {
  debug: (message: string, ...args: unknown[]) => {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
    if (isDev) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, error?: unknown, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, error, ...args);
  },
};
