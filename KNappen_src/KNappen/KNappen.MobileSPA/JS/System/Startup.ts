/// <reference path="Diagnostics/Log.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />

/**
    System modules
    @namespace System
*/
module System {
    //declare var log: Log;
    /**
     * Provide startup events so modules can correctly sequence dependencies during startup.
     * @class
     */
    export class Startup {
        // Somewhere to keep events
        /** @ignore */ private _this: JQuery;

         /**
          * Startup
          * @class System.Startup
          * @classdesc Add event handler to PostInit event.
          */
        constructor() {
            this._this = $(this);
        }

        // Methods to hook up to events
        /**
          * Add event handler to Load event. (Run before all others)
          * @method System.Startup#addLoad
          * @param eventCallback Callback function with empty signature.
          * @param {string} [moduleName] Optional name of module (for error logging if exception).
          */
        public addLoad(eventCallback: { (): void; }, moduleName?: string) {
            this.addEventHandler('Load', eventCallback, moduleName);
        }
        /**
          * Add event handler to PreInit event.
          * @method System.Startup#addPreInit
          * @param eventCallback Callback function with empty signature.
          * @param {string} [moduleName] Optional name of module (for error logging if exception).
          */
        public addPreInit(eventCallback: { (): void; }, moduleName?: string) {
            this.addEventHandler('PreInit', eventCallback, moduleName);
        }
        /**
          * Add event handler to Init event.
          * @method System.Startup#addInit
          * @param eventCallback Callback function with empty signature.
          * @param {string} [moduleName] Optional name of module (for error logging if exception).
          */
        public addInit(eventCallback: { (): void; }, moduleName?: string) {
            this.addEventHandler('Init', eventCallback, moduleName);
        }
        /**
          * Add event handler to PostInit event.
          * @method System.Startup#addPostInit
          * @param eventCallback Callback function with empty signature.
          * @param {string} [moduleName] Optional name of module (for error logging if exception).
          */
        public addPostInit(eventCallback: { (): void; }, moduleName?: string) {
            this.addEventHandler('PostInit', eventCallback, moduleName);

        }

        /** @ignore */
        private addEventHandler(eventName: string, eventCallback: { (): void; }, moduleName?: string) {
            this._this.on(eventName, function () {
                try {
                    eventCallback();
                } catch (error) {
                    var exception: Error = <Error>error;
                    log.error("Startup", "[" + eventName + "] Exception in event handler: ModuleName: " + (moduleName || "unknown") + ": " + exception);
                }
            });
        }

        /**
          * Execute startup. Must only be done once by module itself!
          * @method System.Startup#executeStartup
          */
        public executeStartup() {
            var that = this;
            setTimeout(function () {
                that._this.trigger('Load');
                setTimeout(function () {
                    that._this.trigger('PreInit');
                    setTimeout(function () {
                        that._this.trigger('Init');
                        setTimeout(function () {
                            that._this.trigger('PostInit');
                        }, 10);
                    }, 10);
                }, 1000);
            }, 10);
        }
    }
}

// Globally available to hook up to
var startup = new System.Startup();

// Execute when we are done loading
$(function () {
    startup.executeStartup();
});
