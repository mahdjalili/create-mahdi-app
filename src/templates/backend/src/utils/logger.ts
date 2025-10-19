/**
 * Logger Utility
 * Simple, fast logging for Bun applications
 */

type LogLevel = "debug" | "info" | "success" | "warn" | "error";

// Lightweight file logging with daily rotation and backpressure-safe queue.
// No external deps; works in Bun and Node runtimes.
const LOG_DIR = process.env.LOG_DIR || "./logs";
const LOG_TO_FILE = (process.env.LOG_TO_FILE || "true").toLowerCase() === "true";
const LOG_MAX_QUEUE = Number(process.env.LOG_MAX_QUEUE || 1000);
const LOG_SYNC_FLUSH = (process.env.LOG_SYNC_FLUSH || "false").toLowerCase() === "true";

async function ensureDir(): Promise<void> {
    try {
        await Bun.$`mkdir -p ${LOG_DIR}`;
    } catch {}
}

function getLogFilePath(date = new Date()): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${LOG_DIR}/${year}-${month}-${day}.log`;
}

class FileAppender {
    private queue: string[] = [];
    private flushing = false;
    private currentFile = getLogFilePath();

    async append(line: string): Promise<void> {
        if (!LOG_TO_FILE) return;
        if (this.queue.length >= LOG_MAX_QUEUE) {
            // Drop oldest to prevent unbounded memory growth
            this.queue.shift();
        }
        const now = new Date();
        const todayFile = getLogFilePath(now);
        if (todayFile !== this.currentFile) {
            this.currentFile = todayFile;
        }
        this.queue.push(line + "\n");
        if (!this.flushing) void this.flush();
        if (LOG_SYNC_FLUSH) await this.flush();
    }

    private async flush(): Promise<void> {
        if (this.flushing) return;
        this.flushing = true;
        try {
            await ensureDir();
            while (this.queue.length > 0) {
                const chunk = this.queue.splice(0, Math.min(this.queue.length, 256)).join("");
                // Bun's type overloads can conflict in some TS setups; cast avoids false-positive
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (Bun.write as any)(this.currentFile, chunk, { append: true, createPath: true });
            }
        } catch (err) {
            // Swallow file errors to avoid crashing the app; console will still show logs
        } finally {
            this.flushing = false;
        }
    }
}

const fileAppender = new FileAppender();

class Logger {
    private logLevel: number;

    constructor() {
        const levelMap: Record<string, number> = {
            debug: 0,
            info: 1,
            success: 1,
            warn: 2,
            error: 3,
        };

        this.logLevel = levelMap[process.env.LOG_LEVEL || "info"] || 1;
    }

    private shouldLog(level: LogLevel): boolean {
        const levelMap: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            success: 1,
            warn: 2,
            error: 3,
        };

        return levelMap[level] >= this.logLevel;
    }

    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        const timestamp = new Date().toISOString();
        const emoji = {
            debug: "🐛",
            info: "ℹ️",
            success: "✅",
            warn: "⚠️",
            error: "❌",
        };

        const prefix = `[${timestamp}] ${emoji[level]} [${level.toUpperCase()}]`;

        if (args.length > 0) {
            return `${prefix} ${message} ${JSON.stringify(args)}`;
        }
        return `${prefix} ${message}`;
    }

    debug(message: string, ...args: any[]): void {
        if (this.shouldLog("debug")) {
            const formatted = this.formatMessage("debug", message, ...args);
            console.debug(formatted);
            void fileAppender.append(formatted);
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.shouldLog("info")) {
            const formatted = this.formatMessage("info", message, ...args);
            console.log(formatted);
            void fileAppender.append(formatted);
        }
    }

    success(message: string, ...args: any[]): void {
        if (this.shouldLog("success")) {
            const formatted = this.formatMessage("success", message, ...args);
            console.log(formatted);
            void fileAppender.append(formatted);
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.shouldLog("warn")) {
            const formatted = this.formatMessage("warn", message, ...args);
            console.warn(formatted);
            void fileAppender.append(formatted);
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.shouldLog("error")) {
            const formatted = this.formatMessage("error", message, ...args);
            console.error(formatted);
            void fileAppender.append(formatted);
        }
    }
}

// Export singleton instance
export const logger = new Logger();
