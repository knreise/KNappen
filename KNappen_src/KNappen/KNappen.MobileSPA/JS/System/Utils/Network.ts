/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {

    export class Network {

        /**
          * Network
          * @class System.Utils.Network
          * @classdesc Information about network conectivity.
          */
        constructor() { }

        private networkErrorToken: number = undefined;

        /**
          * Checks if there is a network connection.
          * @method System.Utils.Network#isConnected
          * @returns {boolean} True if there is a connection, otherwise false. This will always return true on non-mobile devices.
          */
        public isConnected(): boolean {
            if (navigator.network) // navigator.network is a plugin for PhoneGap, i.e. it doesnt exist on non-mobile devices.
                return (navigator.network.connection.type !== Connection.NONE);
            return true; // Assume network conectivity on non-mobile devices.
        }

        /**
          * Displays an no-connection error.
          * @method System.Utils.Network#displayNetworkError
          */
        public displayNetworkError(): void {
            if (this.networkErrorToken)
                clearTimeout(this.networkErrorToken);

            // Bundle errors to only show one.
            this.networkErrorToken = setTimeout(() => {
                userPopupController.sendError(tr.translate("Network"), tr.translate("No connection"));
            }, 250);
        }
    }
}
var networkHelper = new System.Utils.Network();