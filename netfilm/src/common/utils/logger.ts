import pino from 'pino';
const logger = pino({
  prettyPrint: {
    ignore: 'pid, hostname',
    colorize: true,
    singleLine: false,
    messageFormat: '{levelLabel} (on {hostname}) {msg}\n',
  },
});

export { logger };
