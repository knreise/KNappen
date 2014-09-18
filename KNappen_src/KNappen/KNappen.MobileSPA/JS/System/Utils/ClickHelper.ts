/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {

    export class Click {

        /**
          * Click
          * @class System.Utils.Click
          * @classdesc Helper functions for click-events.
          */
        constructor() { }

        private suppressClick: boolean;
        private clickToken: number = undefined;
        
         /**
          * A timeout function to avoid multiple clicks in close succession.
          * Only the last callback-function will be called.
          * @method System.Utils.Click#delay
          */
        public delay(callback: Function): void {
            if (this.clickToken)
                clearTimeout(this.clickToken);

            this.clickToken = setTimeout(callback, 350);
        }

        /**
          * Suppresses all calls to this function for the specified duration.
          * The callback fuction is called immediately.
          * @method System.Utils.Click#suppress
          */
        public suppress(callback: Function, milliseconds: number): void {
            if (this.suppressClick)
                return;

            this.suppressClick = true;

            callback();

            setTimeout(() => {
                this.suppressClick = false;
            }, milliseconds);
        }
    }
}
var clickHelper = new System.Utils.Click();