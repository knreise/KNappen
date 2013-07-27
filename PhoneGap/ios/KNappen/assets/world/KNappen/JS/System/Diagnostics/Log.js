var System;
(function (System) {
    /// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
    /// <reference path="../ConfigBase.ts" />
    /**
    Diagnostics modules
    @namespace System.Diagnostics
    */
    (function (Diagnostics) {
        //export enum LogTypeEnum
        //{
        //    Debug,
        //    Info,
        //    Error,
        //    Fatal
        //}
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

            /**
            Send to log.
            @method System.Diagnostics.Log#verboseDebug
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
            */
            Log.prototype.verboseDebug = function (sender, msg) {
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
                if (!config.debug)
                    return;

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
