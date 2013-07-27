/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers
{

    // Playing around with use of Enum in this class to see how it works out...
    export enum UserPopupMessageType {
        info,
        error,
        success,
        warning
    }

    export class UserPopupController
    {
        private toastrOptions = { positionClass: 'toast-top-center' };
        private toastrLookUp: { [type: string]: any;} = {};
        private toastrLookUpName: { [type: string]: string; } = {};

        /**
            UserPopupController
            @class App.Controllers.UserPopupController
            @classdesc This class controls how info and error messages are displayed to the user with "toastr"
        */
        constructor() {
        }

        /**
            Adds the different types of popups and their names
            @method App.Controllers.UserPopupController#PreInit
            @public
        */
        public PreInit()
        {
            // Lookup table for methods to execute depending on type
            this.toastrLookUp[App.Controllers.UserPopupMessageType.info.toString()] = toastr.info;
            this.toastrLookUp[App.Controllers.UserPopupMessageType.error.toString()] = toastr.error;
            this.toastrLookUp[App.Controllers.UserPopupMessageType.success.toString()] = toastr.success;
            this.toastrLookUp[App.Controllers.UserPopupMessageType.warning.toString()] = toastr.warning;

            this.toastrLookUpName[App.Controllers.UserPopupMessageType.info.toString()] = "Info";
            this.toastrLookUpName[App.Controllers.UserPopupMessageType.error.toString()] = "Error";
            this.toastrLookUpName[App.Controllers.UserPopupMessageType.success.toString()] = "Success";
            this.toastrLookUpName[App.Controllers.UserPopupMessageType.warning.toString()] = "Warning";

            // Hook up Toastr to log channel "userPopup"
            log.addLogHandler(function (event, logType, sender, msg) {
                if (logType.toLowerCase() == "userpopup") {
                    toastr.error(msg, sender, this.toastrOptions);
                }
            });
        }

        /**
            Displays a toastr popup to the user 
            @method App.Controllers.UserPopupController#send
            @param {App.Controllers.UserPopupMessageType} messageType based on values initiated in PreInit
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            @public
        */
        public send(messageType: App.Controllers.UserPopupMessageType, header: string, msg: string) {
            header = tr.translateSubString(header);
            msg = tr.translateSubString(msg);
            log.debug("UserPopupController", "Send message: [" + this.toastrLookUpName[messageType.toString()] + "] Header: '" + header + "', Message: '" + msg + "'");

            var f: any = this.toastrLookUp[messageType.toString()];
            if (f)
                f(translater.translate(msg), translater.translate(header), this.toastrOptions);
            else
                log.error("UserPopupController", "Unknown message type '" + messageType + "', unable to show popup: Header: '" + header + "', Message: '" + msg + "'");
        }

        /**
            Show a popup as info
            @method App.Controllers.UserPopupController#sendInfo
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
        */
        public sendInfo(header: string, msg: string) {
            this.send(App.Controllers.UserPopupMessageType.info, header, msg);
        }

        /**
            Show a popup as error
            @method App.Controllers.UserPopupController#sendError
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
        */
        public sendError(header: string, msg: string) {
            this.send(App.Controllers.UserPopupMessageType.error, header, msg);
        }
        
        /**
            Show a popup as success
            @method App.Controllers.UserPopupController#sendSuccess
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
        */
        public sendSuccess(header: string, msg: string) {
            this.send(App.Controllers.UserPopupMessageType.success, header, msg);
        }

        /**
            Show a popup as warning
            @method App.Controllers.UserPopupController#sendWarning
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
        */
        public sendWarning(header: string, msg: string) {
            this.send(App.Controllers.UserPopupMessageType.warning, header, msg);
        }
    }
}
var userPopupController = new App.Controllers.UserPopupController();
startup.addPreInit(function () { userPopupController.PreInit(); }, "UserPopupController");