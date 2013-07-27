/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../ConfigBase.ts" />

/**
    Diagnostics modules
    @namespace System.Diagnostics
*/
module System.Diagnostics {
    // This is necessary since this module won't know the App.Config module instance yet.
    declare var config: System.ConfigBase;

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
    export class Log {
        // Somewhere to keep events
        /** @ignore */ private _this: JQuery;

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
        public addLogHandler(logHandlerCallback: { (event: JQueryEventObject, logType: string, sender: string, msg: string): void; })
        {
            this._this.on('Log', logHandlerCallback);
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
        public verboseDebug(sender: string, msg: string) { this.log('VerboseDebug', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#debug
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public debug(sender: string, msg: string) { this.log('Debug', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#info
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public info(sender: string, msg: string) { this.log('Info', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#error
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public error(sender: string, msg: string) { this.log('Error', sender, msg); }
        /**
            Send to log.
            @method System.Diagnostics.Log#fatal
            @param {string} sender Source of log entry.
            @param {string} msg Message to log.
            @public
          */
        public fatal(sender: string, msg: string) { this.log('Fatal', sender, msg); }
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
            if (!config.debug)
                return;

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