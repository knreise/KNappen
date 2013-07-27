/// <reference path="Diagnostics/Log.ts" />
/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
/**
System modules
@namespace System
*/
var System;
(function (System) {
    //declare var log: Log;
    /**
    * Provide startup events so modules can correctly sequence dependencies during startup.
    * @class
    */
    var Startup = (function () {
        /**
        * Startup
        * @class System.Startup
        * @classdesc Add event handler to PostInit event.
        */
        function Startup() {
            this.loadCountdownMs = 10;
            this.loadIntervalCheckMs = 100;
            this.autoStartup = true;
            this.eventHooks = $(this);
        }
        // Methods to hook up to events
        /**
        * Add event handler to Load event. (Run before all others)
        * @method System.Startup#addLoad
        * @param eventCallback Callback function with empty signature.
        * @param {string} [moduleName] Optional name of module (for error logging if exception).
        */
        Startup.prototype.addLoad = function (eventCallback, moduleName) {
            this.addEventHandler('Load', eventCallback, moduleName);
        };

        /**
        * Add event handler to PreInit event.
        * @method System.Startup#addPreInit
        * @param eventCallback Callback function with empty signature.
        * @param {string} [moduleName] Optional name of module (for error logging if exception).
        */
        Startup.prototype.addPreInit = function (eventCallback, moduleName) {
            this.addEventHandler('PreInit', eventCallback, moduleName);
        };

        /**
        * Add event handler to Init event.
        * @method System.Startup#addInit
        * @param eventCallback Callback function with empty signature.
        * @param {string} [moduleName] Optional name of module (for error logging if exception).
        */
        Startup.prototype.addInit = function (eventCallback, moduleName) {
            this.addEventHandler('Init', eventCallback, moduleName);
        };

        /**
        * Add event handler to PostInit event.
        * @method System.Startup#addPostInit
        * @param eventCallback Callback function with empty signature.
        * @param {string} [moduleName] Optional name of module (for error logging if exception).
        */
        Startup.prototype.addPostInit = function (eventCallback, moduleName) {
            this.addEventHandler('PostInit', eventCallback, moduleName);
        };

        /** @ignore */
        Startup.prototype.addEventHandler = function (eventName, eventCallback, moduleName) {
            this.eventHooks.on(eventName, function () {
                try  {
                    eventCallback();
                } catch (error) {
                    var exception = error;
                    log.error("Startup", "[" + eventName + "] Exception in event handler: ModuleName: " + (moduleName || "unknown") + ": " + exception);
                }
            });
        };

        /**
        * Shortcut load timeout. Will force startup to proceed with PreInit, Init and PostInit by reducing remaining wait time.
        * @method System.Startup#shortcutLoadTimeout
        */
        Startup.prototype.shortcutLoadTimeout = function () {
            if (this.loadCountdownMs > 0) {
                log.debug("Startup", "Shortcutting load timeout.");

                // Set remaining time to exactly one tick so it will execute on next tick
                this.loadCountdownMs = this.loadIntervalCheckMs;

                // Execute next tick
                this.waitForLoadContinue();
            }
        };

        /**
        * Timeout waiting for Load to complete so we can continue with PreInit, Init and PostInit.
        * @method System.Startup#waitForLoadContinue
        */
        Startup.prototype.waitForLoadContinue = function () {
            var _this = this;

            if (this.loadCountdownMs < 0) {
                // Redundant call, nothing to do.
                return;
            }

            // Reduce timer
            this.loadCountdownMs -= this.loadIntervalCheckMs;

            if (this.loadCountdownMs > (this.loadIntervalCheckMs / 2)) {
                setTimeout(function () {
                    _this.waitForLoadContinue();
                }, this.loadIntervalCheckMs);
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
        };

        /**
        * Execute startup. Must only be done once by module itself!
        * @method System.Startup#executeStartup
        */
        Startup.prototype.executeStartup = function () {
            var _this = this;
            setTimeout(function () {
                _this.eventHooks.trigger('Load');
                _this.waitForLoadContinue();
            });
        };
        return Startup;
    })();
    System.Startup = Startup;
})(System || (System = {}));

// Globally available to hook up to
var startup = new System.Startup();

// Execute when we are done loading
$(function () {
    if (startup.autoStartup)
        startup.executeStartup();
});
//@ sourceMappingURL=Startup.js.map
