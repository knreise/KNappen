/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {
    export class Event {
        /** @ignore */ private eventHooks: JQuery;
        private name: string = null;
        constructor(public name?: string) {
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
        public addHandler(eventCallback: any, moduleName?: string) {
            this.eventHooks.on(this.name, function (event: any, ...args: any[]) {
                try {
                    // TODO: .apply instead?
                    eventCallback(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
                } catch (error) {
                    var exception: Error = <Error>error;
                    log.error("Event", "[" + this.name + "] Exception in event handler: " + exception);
                }
            });
        }

        /**
          * Trigger this event
          * @method App.Utils.Event#trigger
          */
        public trigger(...args: any[]) {
            this.eventHooks.trigger(this.name, args);
        }
    }
}
