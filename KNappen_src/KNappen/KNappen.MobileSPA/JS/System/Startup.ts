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
        /** @ignore */
        private eventHooks: JQuery;

        public autoStartup: boolean = true;

        private loadModulesCount: number = 0;
        private preInitModulesCount: number = 0;
        
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
            this.loadModulesCount++;
        }
        /**
          * Add event handler to PreInit event.
          * @method System.Startup#addPreInit
          * @param eventCallback Callback function with empty signature.
          * @param {string} [moduleName] Optional name of module (for error logging if exception).
          */
        public addPreInit(eventCallback: { (): void; }, moduleName?: string) {
            this.addEventHandler('PreInit', eventCallback, moduleName);
            this.preInitModulesCount++;
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

        public finishedLoad(moduleName: string): void {
            this.loadModulesCount--;
            log.debug("Startup", "Module '" + moduleName + "' finished loading, currently " + this.loadModulesCount + " loading modules");

            if (this.loadModulesCount == 0) {
                this.continueWithLoad();
            }
        }

        public finishedPreInit(moduleName: string): void {
            this.preInitModulesCount--;
            log.debug("Startup", "Module '" + moduleName + "' finished pre-init, currently " + this.preInitModulesCount + " pre-init modules");

            if (this.preInitModulesCount == 0) {
                this.continueWithPreInit();
            }
        }

        /**
          * Timeout waiting for Load to complete so we can continue with PreInit, Init and PostInit.
          * @method System.Startup#waitForLoadContinue
          */
        private continueWithLoad() {
            log.debug("Startup", "Load finished, proceeding with startup procedure.");
            setTimeout(() => this.eventHooks.trigger("PreInit"), 10);
        }

        private continueWithPreInit() {
            var self = this;

            log.debug("Startup", "PreInit finished, proceeding with startup procedure.");
            
            setTimeout(function () {
                self.eventHooks.trigger('Init');
                setTimeout(function () {
                    self.eventHooks.trigger('PostInit');
                    loadingScreenController.hideLoadingScreen();
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
                loadingScreenController.showLoadingScreen("");
                log.debug("Startup", "Loading modules... " + _this.loadModulesCount + " modules to load.");
                _this.eventHooks.trigger('Load');
            });
        }
    }
}

// Globally available to hook up to
var startup = new System.Startup();

// Execute when we are done loading
$(function () {
    if (startup.autoStartup) {
        startup.executeStartup();
    }
});
