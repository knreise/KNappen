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
        /** @ignore */ private eventHooks: JQuery;

        private loadCountdownMs = 10 * 1000; // Plus loadIntervalCheckMs to be exact, but who keeps track
        private loadIntervalCheckMs = 100;

        /**
         * Startup
         * @class System.Startup
         * @classdesc Add event handler to PostInit event.
         */
        constructor() {
            this.eventHooks = $(this);
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
            this.eventHooks.on(eventName, function () {
                try {
                    eventCallback();
                } catch (error) {
                    var exception: Error = <Error>error;
                    log.error("Startup", "[" + eventName + "] Exception in event handler: ModuleName: " + (moduleName || "unknown") + ": " + exception);
                }
            });
        }

        /**
          * Shortcut load timeout. Will force startup to proceed with PreInit, Init and PostInit by reducing remaining wait time.
          * @method System.Startup#shortcutLoadTimeout
          */
        public shortcutLoadTimeout() {
            // Make sure we don't re-execute startup if called after startup is done
            if (this.loadCountdownMs > 0) {
                log.debug("Startup", "Shortcutting load timeout.");
                // Set remaining time to exactly one tick so it will execute on next tick
                this.loadCountdownMs = this.loadIntervalCheckMs;
                // Execute next tick
                this.waitForLoadContinue();
            }
        }

        /**
          * Timeout waiting for Load to complete so we can continue with PreInit, Init and PostInit.
          * @method System.Startup#waitForLoadContinue
          */
        private waitForLoadContinue() {

            var _this = this;

            if (this.loadCountdownMs < 0) {
                // Redundant call, nothing to do.
                return;
            }
            // Reduce timer
            this.loadCountdownMs -= this.loadIntervalCheckMs;

            // If we aren't low enough yet we need another pass, so set up a timeout for it
            if (this.loadCountdownMs > (this.loadIntervalCheckMs / 2))
            {
                setTimeout(function () { _this.waitForLoadContinue(); }, this.loadIntervalCheckMs);
                return;
            }

            // We made it this far, it means we should consider ourselves done.
            this.loadCountdownMs = -1;
    
            log.debug("Startup", "Load timeout, proceeding with startup procedure.");
            setTimeout(function () {
                _this.eventHooks.trigger('PreInit');
                setTimeout(function () {
                    _this.eventHooks.trigger('Init');
                    setTimeout(function () {
                        _this.eventHooks.trigger('PostInit');
                    }, 10);
                }, 10);
            }, 10);

        }

        /**
          * Execute startup. Must only be done once by module itself!
          * @method System.Startup#executeStartup
          */
        public executeStartup() {
            var _this = this;
            setTimeout(function () {
                _this.eventHooks.trigger('Load');
                _this.waitForLoadContinue();
            });
        }
    }
}

// Globally available to hook up to
var startup = new System.Startup();

// Execute when we are done loading
$(function () {
    startup.executeStartup();
});
