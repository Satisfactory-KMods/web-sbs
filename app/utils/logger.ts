import moment from 'moment-timezone';

export enum LogColor {
	normal = '\x1B[0m',
	red = '\x1B[31m',
	green = '\x1B[32m',
	yellow = '\x1B[33m',
	blue = '\x1B[34m',
	magenta = '\x1B[35m',
	cyan = '\x1B[36m',
	white = '\x1B[37m',
	gray = '\x1B[90m'
}

export enum LogLevel {
	/**
	 * Log level for silent
	 */
	SILENT,
	/**
	 * Log level for log
	 */
	LOG,
	/**
	 * Log level for info
	 */
	INFO,
	/**
	 * Log level for debug
	 */
	DRIZZLE,
	DEBUG,
	/**
	 * Log level for warnings
	 */
	WARN,
	/**
	 * Log level for errors
	 */
	ERROR,
	/**
	 * Log level for fatal
	 * Fatal is the highest log level and will exit the process
	 * @note FATAL will also always log to console.error
	 */
	FATAL
}

export interface LoggerOptions {
	/**
	 * should debug be enabled
	 * @default process.env.NODE_ENV === 'development'
	 */
	debug: boolean;
	/**
	 * the log level for debug
	 * @default `LogLevel.DEBUG`
	 */
	debugLevel: LogLevel;
	/**
	 * the log level
	 * @default `LogLevel.INFO`
	 */
	minLevel: LogLevel;
	/**
	 * the log level
	 * @default `LogLevel.FATAL`
	 */
	maxLevel: LogLevel;
	/**
	 * the log format
	 * @default `{level}{level_name} {datetime} | {logger_name} | {message}`
	 * @note {level} will always have a format of [0]
	 * @note {level_name} will always have a format of [0]
	 */
	format: string;
	/**
	 * should the logger use colors
	 * @default true
	 */
	colors: boolean;
}

/**
 * the custom log levels
 */
export type CustomLogs = Record<string, LogLevel>;

export type Nullish<T = any> = T | null | undefined;

/* eslint-disable no-console */
/**
 * the default log levels
 * @note this is a readonly property
 */
export const defaultLogLevel = {
	silent: LogLevel.SILENT,
	log: LogLevel.LOG,
	info: LogLevel.INFO,
	debug: LogLevel.DEBUG,
	warn: LogLevel.WARN,
	error: LogLevel.ERROR,
	drizzle: LogLevel.DRIZZLE,
	fatal: LogLevel.FATAL
};

export type DefaultLogNames = typeof defaultLogLevel;

/**
 * Logger class to log to console with different log levels and formats
 */
export class Logger<T extends CustomLogs> {
	/**
	 * the logger names
	 * @note this is a readonly property
	 */
	readonly loggerNames: T & DefaultLogNames;
	/**
	 * the logger options
	 */
	options: LoggerOptions;

	/**
	 *  Logger class to log to console with different log levels and formats
	 * @param loggerNames  the logger names
	 * @param options  the logger options
	 */
	constructor(loggerNames: T, options: Partial<LoggerOptions> = {}) {
		this.loggerNames = {
			...defaultLogLevel,
			...loggerNames
		};

		this.options = {
			debug: process.env.NODE_ENV === 'development',
			debugLevel: LogLevel.DEBUG,
			minLevel: LogLevel.LOG,
			maxLevel: LogLevel.FATAL,
			colors: true,
			format: ' {level}{level_name} {datetime} | {logger_name} | {message}',
			...options
		};
	}

	/**
	 *  update the logger options
	 * @param options the options to update
	 */
	public updateOptions(options: Partial<LoggerOptions>): void {
		this.options = {
			...this.options,
			...options
		};
	}

	private getLogLevel(name: keyof typeof this.loggerNames): LogLevel {
		const logLevel = this.loggerNames[name];
		if (logLevel !== undefined) {
			return logLevel;
		}
		return this.loggerNames.log;
	}

	private shouldLog(logLevel: LogLevel): boolean {
		if (!this.options.debug && logLevel === LogLevel.DEBUG) {
			return false;
		}
		return (
			(logLevel >= this.options.minLevel && logLevel <= this.options.maxLevel) ||
			logLevel === LogLevel.FATAL
		);
	}

	private consoleFn(logLevel: LogLevel): (message?: any, ...optionalParams: any[]) => void {
		switch (logLevel) {
			case LogLevel.LOG:
			case LogLevel.DRIZZLE:
				return console.log;
			case LogLevel.INFO:
				return console.info;
			case LogLevel.DEBUG:
				return console.debug;
			case LogLevel.WARN:
				return console.warn;
			case LogLevel.ERROR:
				return console.error;
			case LogLevel.FATAL:
				return console.error;
			default:
				return console.log;
		}
	}

	private getLogLevelName(logLevel: LogLevel): string {
		switch (logLevel) {
			case LogLevel.LOG:
				return 'LOG';
			case LogLevel.INFO:
				return 'INFO';
			case LogLevel.DEBUG:
				return 'DEBUG';
			case LogLevel.WARN:
				return 'WARN';
			case LogLevel.ERROR:
				return 'ERROR';
			case LogLevel.FATAL:
				return 'FATAL';
			case LogLevel.SILENT:
				return 'SILENT';
			case LogLevel.DRIZZLE:
				return 'DRIZZLE';
			default:
				return 'log';
		}
	}

	/**
	 * wrap a message in color
	 * @param message  the message to wrap in color
	 * @param color  the color to wrap the message in
	 * @returns  the message wrapped in color
	 */
	public wrapInColor(message: any, color: LogColor): any {
		if (!this.options.colors) return message;
		if (typeof message === 'string') {
			return `${color}${message}${LogColor.normal}`;
		}
		return [color, message, LogColor.normal];
	}

	private logLevelColor(logLevel: LogLevel) {
		switch (logLevel) {
			case LogLevel.LOG:
				return LogColor.magenta;
			case LogLevel.INFO:
				return LogColor.green;
			case LogLevel.DEBUG:
			case LogLevel.DRIZZLE:
				return LogColor.blue;
			case LogLevel.WARN:
				return LogColor.yellow;
			case LogLevel.ERROR:
				return LogColor.red;
			case LogLevel.FATAL:
				return LogColor.red;
			default:
				return LogColor.cyan;
		}
	}

	private formatMessage(
		name: keyof typeof this.loggerNames,
		logLevel: LogLevel,
		message: any,
		...optionalParams: any[]
	): any {
		const datetime = moment().format('YYYY-MM-DD HH:mm:ss');
		let msg = this.options.format;
		msg = msg.replace('{datetime}', datetime);
		msg = msg.replace(
			'{level}',
			this.wrapInColor(`[${String(logLevel)}]`, this.logLevelColor(logLevel))
		);
		msg = msg.replace(
			'{level_name}',
			this.wrapInColor(
				`[${this.getLogLevelName(logLevel).toUpperCase()}]`,
				this.logLevelColor(logLevel)
			)
		);
		msg = msg.replace(
			'{logger_name}',
			this.wrapInColor(
				String(name).replace(/_/g, ' ').toUpperCase(),
				this.logLevelColor(logLevel)
			)
		);
		msg = msg.replace('{message}', '');
		return [msg.trim(), message, ...optionalParams];
	}

	/**
	 * log a message to the console
	 * @param name  the name of the logger
	 * @param message  the message to log
	 * @param optionalParams  any optional params to log
	 * @note this will exit the process if the log level is `LogLevel.FATAL`
	 * @note this will not log if the log level is `LogLevel.SILENT` and the min level is NOT `LogLevel.SILENT`
	 * @note `LogLevel.FATAL` will always log to `console.error` and exit the process
	 */
	public log(name: keyof typeof this.loggerNames, message: any, ...optionalParams: any[]): void {
		const logLevel = this.getLogLevel(name);
		if (this.shouldLog(logLevel)) {
			this.consoleFn(logLevel)(
				...this.formatMessage(name, logLevel, message, ...optionalParams)
			);
			if (logLevel === LogLevel.FATAL) {
				process.exit(1);
			}
		}
	}
}

export const logger = new Logger(
	{
		'bot': LogLevel.LOG,
		'bot-fatal': LogLevel.FATAL,
		'bot-error': LogLevel.ERROR,
		'bot-warn': LogLevel.WARN,
		'bot-slashcommands': LogLevel.INFO,
		'bot-messages': LogLevel.INFO,
		'tasks': LogLevel.INFO,
		'tasks-error': LogLevel.ERROR,
		'tasks-warn': LogLevel.WARN,
		'ficsit': LogLevel.INFO,
		'ficsit-error': LogLevel.ERROR,
		'ficsit-warn': LogLevel.WARN
	},
	{ colors: true }
);
export const log = logger.log.bind(logger);
