var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    Provider modules
    @namespace System.Utils
    */
    (function (Utils) {
        var ErrorTool = (function () {
            /**
            * ErrorTool
            * @class System.Utils.ErrorTool
            * @classdesc Provides Try-Catch execution of tasks
            */
            function ErrorTool() {
                this.self = null;
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
            ErrorTool.prototype.executeTryCatchLog = function (moduleName, additionalExceptionMessage, functionToExecute, functionIfError) {
                try  {
                    // Attempt execute and successful return
                    functionToExecute();
                    return true;
                } catch (error) {
                    // Error has occurred
                    var exception = error;

                    if (!moduleName || moduleName == "")
                        moduleName = "[Unnamed module in ExecuteTryCatchLog]";
                    if (additionalExceptionMessage)
                        additionalExceptionMessage = '"' + additionalExceptionMessage + '": ';

                    // Write to log
                    log.error(moduleName, "Exception caught: " + (additionalExceptionMessage || '') + exception);

                    if (functionIfError)
                        functionIfError();

                    // Return
                    return false;
                }
            };

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
            ErrorTool.prototype.executeTryCatchUserMessage = function (headline, message, functionToExecute, functionIfError, moduleName, additionalExceptionMessage) {
                // Execute
                var result = this.executeTryCatchLog(moduleName, additionalExceptionMessage, functionToExecute, functionIfError);

                if (!result) {
                    // Failure
                    log.userPopup(headline, message);
                }
                return result;
            };

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
            ErrorTool.prototype.delayedExecuteTryCatchUserMessage = function (headline, message, functionToExecute, functionIfError, moduleName, additionalExceptionMessage) {
                var _self = this.self;
                return function () {
                    _self.executeTryCatchUserMessage(headline, message, functionToExecute, functionIfError, moduleName, additionalExceptionMessage);
                };
            };
            return ErrorTool;
        })();
        Utils.ErrorTool = ErrorTool;
    })(System.Utils || (System.Utils = {}));
    var Utils = System.Utils;
})(System || (System = {}));
var errorTool = new System.Utils.ErrorTool();
//@ sourceMappingURL=ErrorTool.js.map
