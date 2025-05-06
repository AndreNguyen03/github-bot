/**
 * Tiện ích ghi log cho ứng dụng
 */
export const logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`[WARNING] ${message}`);
  },

  error: (message: string, error?: Error): void => {
    console.error(`[ERROR] ${message}`, error || "");
  },

  debug: (message: string, data?: any): void => {
    if (process.env.DEBUG) {
      console.log(`[DEBUG] ${message}`, data || "");
    }
  },
};
export default logger;
