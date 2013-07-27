/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />

/**
    Diagnostics modules
    @namespace System.Diagnostics
*/
module System.Diagnostics {

    export enum LogTypeEnum {
        VerboseDebug,
        Debug,
        Info,
        Error,
        Fatal
    }

    /**
      * Creates a new logger.
      * @class Porvides logging service.
      */
    export class Log {
        // Somewhere to keep events
        /** @ignore */ private _this: JQuery;
        private logLevel: System.Diagnostics.LogTypeEnum = null;

        private logLevelEnabled_VerboseDebug: bool = true;
        private logLevelEnabled_Debug: bool = true;
        private logLevelEnabled_Info: bool = true;
        private logLevelEnabled_Error: bool = true;
        private logLevelEnabled_Fatal: bool = true;

        /**
            Log
            @class System.Diagnostics.Log
            @classdesc This class contains methods for logging informational messages and errors from the app 
        */
        constructor() {
            this._this = $(this);
            var _t = this;
            // Try to hook up a global exception logger
            try {
                window.onerror = function (msg, url, line) {
                    _t.log('Error', 'GlobalException', '"' + msg.message + '" in ' + url + ' line ' + line);
                };
            } catch (e) { }
        }

        /**
            Add handler to receive log entries.
            @method System.Diagnostics.Log#addLogHandler
            @param logHandlerCallback Callback method logHandlerCallback: { (event: JQueryEventObject, logType: string, sender: string, msg: string): void; }
            @public
        */
        public addLogHandler(logHandlerCallback: { (event: JQueryEventObject, logType: string, sender: string, msg: string): void; }) {
            this._this.on('Log', logHandlerCallback);
        }

        public setLogLevel(logLevel: System.Diagnostics.LogTypeEnum) {
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
        }

        //UserDisplay true/false, vis som toast? Toast.Make("","", {}); for de forskjellige, show i metodene
        /** @ignore */ private logger: JQuery;
        /**
           Send to log.
           @method System.Diagnostics.Log#verboseDebug
           @param {string} sender Source of log entry.
           @param {string} msg Message to log.
           @public
          */
        public verboseDebug(sender: string, msg: string) { if (this.logLevelEnabled_VerboseDebug) this.log('VerboseDebug', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#debug
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public debug(sender: string, msg: string) { if (this.logLevelEnabled_Debug) this.log('Debug', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#info
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public info(sender: string, msg: string) { if (this.logLevelEnabled_Info) this.log('Info', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#error
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public error(sender: string, msg: string) { if (this.logLevelEnabled_Error) this.log('Error', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#fatal
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public fatal(sender: string, msg: string) { if (this.logLevelEnabled_Fatal) this.log('Fatal', sender, msg); }
        /**
            Send to user popup window to display this in the app
            @method System.Diagnostics.Log#userPopup
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public userPopup(sender: string, msg: string) { this.log('UserPopup', sender, msg); }

        /** @ignore */
        private log(logType, sender, msg) {
            this.raw('[' + logType + '] ' + sender + ' ' + msg);
            this._this.trigger('Log', [logType, sender, msg]);
        }

        /** @ignore */
        private raw(msg) {
            try {
                //if (typeof console === "undefined" || typeof console.log === "undefined") {
                //} else {
                if ('console' in self && 'log' in console)
                    console.log(msg);

            } catch (e) { }

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
        }
    }
}

var log = new System.Diagnostics.Log();