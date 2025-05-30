const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  // Always log errors
  error: (...args: any[]) => {
    console.error(...args);
  },

  // Always log warnings in development, only critical warnings in production
  warn: (...args: any[]) => {
    if (isDevelopment || args.some(arg => 
      typeof arg === 'string' && 
      (arg.includes('CRITICAL') || arg.includes('FATAL'))
    )) {
      console.warn(...args);
    }
  },

  // Only log info in development
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  // Only log debug in development
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  // Backend logs - COMPLETELY SUPPRESSED in production
  backend: (...args: any[]) => {
    if (isDevelopment) {
      console.log('>>> BACKEND:', ...args);
    }
    // In production: complete silence
  },

  // Provider logs - COMPLETELY SUPPRESSED in production
  provider: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
    // In production: complete silence
  },

  // Production-safe log for important operations
  production: (...args: any[]) => {
    console.log(...args);
  }
}; 