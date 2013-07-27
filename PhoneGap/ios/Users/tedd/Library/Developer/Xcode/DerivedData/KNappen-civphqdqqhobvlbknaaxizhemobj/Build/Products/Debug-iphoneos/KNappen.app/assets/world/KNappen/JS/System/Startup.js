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
            this._this = $(this);
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
            this._this.on(eventName, function () {
                try  {
                    eventCallback();
                } catch (error) {
                    var exception = error;
                    log.error("Startup", "[" + eventName + "] Exception in event handler: ModuleName: " + (moduleName || "unknown") + ": " + exception);
                }
            });
        };

        /**
        * Execute startup. Must only be done once by module itself!
        * @method System.Startup#executeStartup
        */
        Startup.prototype.executeStartup = function () {
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
        };
        return Startup;
    })();
    System.Startup = Startup;
})(System || (System = {}));

// Globally available to hook up to
var startup = new System.Startup();

// Execute when we are done loading
$(function () {
    startup.executeStartup();
});
//@ sourceMappingURL=Startup.js.map
