/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {
    export interface JSException {
        name: string;
        message: string;
    }

    export class ErrorTool
    {
        private self: ErrorTool = null;

        /**
          * ErrorTool
          * @class System.Utils.ErrorTool
          * @classdesc Provides Try-Catch execution of tasks
          */
        constructor()
        {
            this.self = this;
        }

        /**
          * Put Try-Catch around execution of a method. Log extensively if it fails.
          * @method System.Utils.ErrorTool#delayedExecuteTryCatchUserMessage
          * @param {string} moduleName The name of the module executing method.
          * @param {string} additionalExceptionMessage Any additional message to put into log if exception is thrown.
          * @param functionToExecute Function to execute. Function signature is blank.
          * @param [functionIfError] Optional function to execute if exception occurs (after log is written).
          * @returns {bool} Successful execution. True=success, False=exception.
          */
        public executeTryCatchLog(moduleName: string, additionalExceptionMessage: string, functionToExecute: { (): void; }, functionIfError?: { (): void; }): bool
        {

            try
            {
                // Attempt execute and successful return
                functionToExecute();
                return true;
            }
            catch (error)
            {
                // Error has occurred
                var exception: Error = <Error>error;

                // Sanitise strings for logging
                if (!moduleName || moduleName == "")
                    moduleName = "[Unnamed module in ExecuteTryCatchLog]";
                if (additionalExceptionMessage)
                    additionalExceptionMessage = '"' + additionalExceptionMessage + '": ';

                // Write to log
                log.error(moduleName,
                    "Exception caught: "
                    + (additionalExceptionMessage || '')
                    + exception);

                // Execute error function
                if (functionIfError)
                    functionIfError();

                // Return
                return false;
            }
        }

        /**
          * Put Try-Catch around execution of a method. Send user popup message + log extensively if it fails.
          * @method System.Utils.ErrorTool#delayedExecuteTryCatchUserMessage
          * @param {string} headline Headline in message to user.
          * @param {string} message Message to user upon failure.
          * @param functionToExecute Function to execute. Function signature is blank.
          * @param [functionIfError] Optional function to execute if exception occurs (after log is written).
          * @param {string} [moduleName] The name of the module executing method.
          * @param {string} [additionalExceptionMessage] Any additional message to put into log if exception is thrown.
          * @returns {bool} Successful execution. True=success, False=exception.
          */
        public executeTryCatchUserMessage(headline: string, message: string, functionToExecute: { (): void; }, functionIfError?: { (): void; }, moduleName?: string, additionalExceptionMessage?: string): bool
        {
            // Execute
            var result = this.executeTryCatchLog(moduleName, additionalExceptionMessage, functionToExecute, functionIfError);

            // Success or failure?
            if (!result) {
                // Failure
                log.userPopup(headline, message);
            }
            return result;
        }

        /**
          * Put Try-Catch around execution of a method. Send user popup message + log extensively if it fails.
          * @method System.Utils.ErrorTool#delayedExecuteTryCatchUserMessage
          * @param {string} headline Headline in message to user.
          * @param {string} message Message to user upon failure.
          * @param functionToExecute Function to execute. Function signature is blank.
          * @param [functionIfError] Optional function to execute if exception occurs (after log is written).
          * @param {string} [moduleName] The name of the module executing method.
          * @param {string} [additionalExceptionMessage] Any additional message to put into log if exception is thrown.
          * @returns {bool} Successful execution. True=success, False=exception.
          */
        public delayedExecuteTryCatchUserMessage(headline: string, message: string, functionToExecute: { (): void; }, functionIfError?: { (): void; }, moduleName?: string, additionalExceptionMessage?: string): any
        {
            var _self = this.self;
            return function () {
                _self.executeTryCatchUserMessage(headline, message, functionToExecute, functionIfError, moduleName, additionalExceptionMessage);
            }
        }
    }
}
var errorTool = new System.Utils.ErrorTool();