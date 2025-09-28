declare global {
  var logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  };
}

const createLogger = () => {
  return {
    log: (...args: any[]) => {
      if (__DEV__) {
        console.log(...args);
      }
    },
    error: (...args: any[]) => {
      if (__DEV__) {
        console.error(...args);
      }
    },
    warn: (...args: any[]) => {
      if (__DEV__) {
        console.warn(...args);
      }
    }
  };

  // Use when you dont want to see any logging in development
  // return {
  //   log: (...args: any[]) => {},
  //   error: (...args: any[]) => {},
  //   warn: (...args: any[]) => {}
  // }
};

const logger = createLogger();

// Make it globally available
global.logger = logger;

export default logger;

// Then use it like:
// import logger from '@/utils/logger'
// // logger.log('🚀 Starting app initialization...')