import { Constants } from "../constants";

/**
 * A wrapper around console calls only containing a simple message, standardizing some output format
 */
export class Logger {
    static log(...args: any[]): void {
        console.log(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, ...args);
    }

    static warn(...args: any[]): void {
        console.warn(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, ...args);
    }

    static error(...args: any[]): void {
        console.error(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, ...args);
    }
}