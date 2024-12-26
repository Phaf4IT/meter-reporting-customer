export class Logger {
    private readonly logLevel: LogLevel = LogLevel[(process.env.LOG_LEVEL ? process.env.LOG_LEVEL.toUpperCase() : "INFO") as keyof typeof LogLevel];
    private readonly logFormat: LogFormat = LogFormat[(process.env.LOG_FORMAT ? process.env.LOG_FORMAT.toUpperCase() : 'SIMPLE') as keyof typeof LogFormat];
    private static _instance: Logger;

    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    public static debug(message: string): void {
        this.Instance.handleMessage(message, LogLevel.DEBUG);
    }

    public static info(message: string): void {
        this.Instance.handleMessage(message, LogLevel.INFO);
    }

    public static warn(message: string): void {
        this.Instance.handleMessage(message, LogLevel.WARN);
    }

    public static error(message: string): void {
        this.Instance.handleMessage(message, LogLevel.ERROR);
    }

    public handleMessage(message: string, level: LogLevel) {
        if (this.logLevel <= level) {
            const trace = this.getCaller();
            if (this.logFormat === LogFormat.FULL) {
                console.log(`${new Date().toISOString().replace('T', ' ')}   ${LogLevel[level]} --- ${trace} : ${message}`);
            } else if (this.logFormat === LogFormat.SIMPLE) {
                console.log(message);
            }
        }
    }

    private getCaller(): string {
        try {
            throw new Error("Test error for stack trace");
        } catch (error) {
            if (error instanceof Error) {
                const thirdCaller = StackTraceExtractor.getNthCaller(error, 4);
                return thirdCaller ? thirdCaller : '';
            }
        }
        return '';
    }
}

export function debug(message: string): void {
    Logger.Instance.handleMessage(message, LogLevel.DEBUG);
}

export function info(message: string): void {
    Logger.Instance.handleMessage(message, LogLevel.INFO);
}

export function warn(message: string): void {
    Logger.Instance.handleMessage(message, LogLevel.WARN);
}

export function error(message: string): void {
    Logger.Instance.handleMessage(message, LogLevel.ERROR);
}

enum LogLevel {
    DEBUG = 0, INFO = 1, WARN = 2, ERROR = 3
}

enum LogFormat {
    FULL, SIMPLE
}

class StackTraceExtractor {
    public static getNthCaller(error: Error, nth: number): string | null {
        const stackLines = error.stack?.split("\n");
        if (stackLines && stackLines.length > nth) {
            return stackLines[nth].trim();
        }
        return null;
    }
}