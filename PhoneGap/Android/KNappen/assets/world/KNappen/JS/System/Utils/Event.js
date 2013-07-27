var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    Provider modules
    @namespace System.Utils
    */
    (function (Utils) {
        var Event = (function () {
            function Event(name) {
                this.name = name;
                this.name = null;
                this.eventHooks = $(this);
                if (!this.name)
                    this.name = "AnonymousEvent:" + Math.random().toString();
            }
            /**
            * Add handler to this event
            * @method App.Utils.Event#addHandler
            * @param eventCallback Callback function with empty signature.
            * @param {string} [moduleName] Optional name of module (for error logging if exception).
            */
            Event.prototype.addHandler = function (eventCallback, moduleName) {
                this.eventHooks.on(this.name, function (event) {
                    var args = [];
                    for (var _i = 0; _i < (arguments.length - 1); _i++) {
                        args[_i] = arguments[_i + 1];
                    }
                    try  {
                        // TODO: .apply instead?
                        eventCallback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
                    } catch (error) {
                        var exception = error;
                        log.error("Event", "[" + this.name + "] Exception in event handler: " + exception);
                    }
                });
            };

            /**
            * Trigger this event
            * @method App.Utils.Event#trigger
            */
            Event.prototype.trigger = function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                this.eventHooks.trigger(this.name, args);
            };
            return Event;
        })();
        Utils.Event = Event;
    })(System.Utils || (System.Utils = {}));
    var Utils = System.Utils;
})(System || (System = {}));
//@ sourceMappingURL=Event.js.map
