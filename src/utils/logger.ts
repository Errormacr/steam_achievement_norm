const LOGGER_PREFIX = '[renderer]';

const isDev =
  typeof process === 'undefined' || process.env.NODE_ENV !== 'production';

export const logger = {
  debug: (message: string, payload?: unknown) => {
    if (!isDev) return;
    if (payload !== undefined) {
      console.debug(`${LOGGER_PREFIX} ${message}`, payload);
      return;
    }
    console.debug(`${LOGGER_PREFIX} ${message}`);
  },
  info: (message: string, payload?: unknown) => {
    if (!isDev) return;
    if (payload !== undefined) {
      console.info(`${LOGGER_PREFIX} ${message}`, payload);
      return;
    }
    console.info(`${LOGGER_PREFIX} ${message}`);
  },
  warn: (message: string, payload?: unknown) => {
    if (payload !== undefined) {
      console.warn(`${LOGGER_PREFIX} ${message}`, payload);
      return;
    }
    console.warn(`${LOGGER_PREFIX} ${message}`);
  },
  error: (message: string, payload?: unknown) => {
    if (payload !== undefined) {
      console.error(`${LOGGER_PREFIX} ${message}`, payload);
      return;
    }
    console.error(`${LOGGER_PREFIX} ${message}`);
  }
};
