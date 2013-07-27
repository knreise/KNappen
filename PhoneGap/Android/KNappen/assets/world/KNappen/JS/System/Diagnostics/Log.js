var System;
(function (System) {
    /// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
    /**
    Diagnostics modules
    @namespace System.Diagnostics
    */
    (function (Diagnostics) {
        (function (LogTypeEnum) {
            LogTypeEnum[LogTypeEnum["VerboseDebug"] = 0] = "VerboseDebug";
            LogTypeEnum[LogTypeEnum["Debug"] = 1] = "Debug";
            LogTypeEnum[LogTypeEnum["Info"] = 2] = "Info";
            LogTypeEnum[LogTypeEnum["Error"] = 3] = "Error";

            LogTypeEnum[LogTypeEnum["Fatal"] = 4] = "Fatal";
        })(Diagnostics.LogTypeEnum || (Diagnostics.LogTypeEnum = {}));
        var LogTypeEnum = Diagnostics.LogTypeEnum;

        /**
        * Creates a new logger.
        * @class Porvides logging service.
        */
        var Log = (function () {
            /**
            Log
            @class System.Diagnostics.Log
            @classdesc This class contains methods for logging informational messages and errors from the app
            */
            function Log() {
                this.logLevel = null;
                this.logLevelEnabled_VerboseDebug = true;
                this.logLevelEnabled_Debug = true;
                this.logLevelEnabled_Info = true;
                this.logLevelEnabled_Error = true;
                this.logLevelEnabled_Fatal = true;
                this._this = $(this);
                var _t = this;

                try  {
                    window.onerror = function (msg, url, line) {
                        _t.log('Error', 'GlobalException', '"' + msg.message + '" in ' + url + ' line ' + line);
                    };
                } catch (e) {
                }
            }
            /**
            Add handler to receive log entries.
            @method System.Diagnostics.Log#addLogHandler
            @param logHandlerCallback Callback method logHandlerCallback: { (event: JQueryEventObject, logType: string, sender: string, msg: string): void; }
            @public
            */
            Log.prototype.addLogHandler = function (logHandlerCallback) {
                this._this.on('Log', logHandlerCallback);
            };

            Log.prototype.setLogLevel = function (logLevel) {
                this.logLevel = logLevel;
                this.logLevelEnabled_Fatal = true;
                this.logLevelEnabled_Error = false;
                this.logLevelEnabled_Info = false;
                this.logLevelEnabled_Debug = false;
                this.logLevelEnabled_VerboseDebug = false;

                if (this.logLevel == System.Diagnostics.LogTypeEnum.Fatal)
                    return;
                this.logLevelEnabled_Error = true;
                if (this.logLevel == System.Diagnostics.LogTypeEnum.Error)
                    return;
                this.logLevelEnabled_Info = true;
                if (this.logLevel == System.Diagnostics.LogTypeEnum.Info)
                    return;
                this.logLevelEnabled_Debug = true;
                if (this.logLevel == System.Diagnostics.LogTypeEnum.Debug)
                    return;
                this.logLevelEnabled_VerboseDebug = true;
            };

            /**
            Send to log.
            @method System.Diagnostics.Log#verboseDebug
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.verboseDebug = function (sender, msg) {
                if (this.logLevelEnabled_VerboseDebug)
                    this.log('VerboseDebug', sender, msg);
            };

            /**
            Send to log.
            @method System.Diagnostics.Log#debug
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.debug = function (sender, msg) {
                if (this.logLevelEnabled_Debug)
                    this.log('Debug', sender, msg);
            };

            /**
            Send to log.
            @method System.Diagnostics.Log#info
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.info = function (sender, msg) {
                if (this.logLevelEnabled_Info)
                    this.log('Info', sender, msg);
            };

            /**
            Send to log.
            @method System.Diagnostics.Log#error
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.error = function (sender, msg) {
                if (this.logLevelEnabled_Error)
                    this.log('Error', sender, msg);
            };

            /**
            Send to log.
            @method System.Diagnostics.Log#fatal
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.fatal = function (sender, msg) {
                if (this.logLevelEnabled_Fatal)
                    this.log('Fatal', sender, msg);
            };

            /**
            Send to user popup window to display this in the app
            @method System.Diagnostics.Log#userPopup
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.userPopup = function (sender, msg) {
                this.log('UserPopup', sender, msg);
            };

            /** @ignore */
            Log.prototype.log = function (logType, sender, msg) {
                this.raw('[' + logType + '] ' + sender + ' ' + msg);
                this._this.trigger('Log', [logType, sender, msg]);
            };

            /** @ignore */
            Log.prototype.raw = function (msg) {
                try  {
                    if ('console' in self && 'log' in console)
                        console.log(msg);
                } catch (e) {
                }

                if (!this.logger || this.logger.length == 0)
                    this.logger = $('#debugLog');

                if (this.logger) {
                    var html = this.logger.html();
                    if (html) {
                        if (html.length > 10000)
                            this.logger.html(html.substring(5000));
                    }

                    this.logger.append(msg + '<br />');
                }
            };
            return Log;
        })();
        Diagnostics.Log = Log;
    })(System.Diagnostics || (System.Diagnostics = {}));
    var Diagnostics = System.Diagnostics;
})(System || (System = {}));

var log = new System.Diagnostics.Log();
//@ sourceMappingURL=Log.js.map
