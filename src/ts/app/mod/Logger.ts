import { Constants } from "../constants";

/**
 * A wrapper around console calls only containing a simple message, standardizing some output format
 */
export class Logger {
    static log(message: string): void {
        console.log(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, `${message}`);
    }

    static warn(message: string): void {
        console.warn(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, `${message}`);
    }

    static error(message: string): void {
        console.error(`%c[${Constants.FRIENDLY_NAME}]`, `color: ${Constants.UNIQUE_CONSOLE_TEXT_COLOR};`, `${message}`);
    }
}