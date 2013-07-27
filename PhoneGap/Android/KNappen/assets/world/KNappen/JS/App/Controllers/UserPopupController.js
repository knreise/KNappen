var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        // Playing around with use of Enum in this class to see how it works out...
        (function (UserPopupMessageType) {
            UserPopupMessageType[UserPopupMessageType["info"] = 0] = "info";
            UserPopupMessageType[UserPopupMessageType["error"] = 1] = "error";
            UserPopupMessageType[UserPopupMessageType["success"] = 2] = "success";

            UserPopupMessageType[UserPopupMessageType["warning"] = 3] = "warning";
        })(Controllers.UserPopupMessageType || (Controllers.UserPopupMessageType = {}));
        var UserPopupMessageType = Controllers.UserPopupMessageType;

        var UserPopupController = (function () {
            /**
            UserPopupController
            @class App.Controllers.UserPopupController
            @classdesc This class controls how info and error messages are displayed to the user with "toastr"
            */
            function UserPopupController() {
                this.toastrOptions = { positionClass: 'toast-top-center' };
                this.toastrLookUp = {};
                this.toastrLookUpName = {};
            }
            /**
            Adds the different types of popups and their names
            @method App.Controllers.UserPopupController#PreInit
            @public
            */
            UserPopupController.prototype.PreInit = function () {
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
            };

            /**
            Displays a toastr popup to the user
            @method App.Controllers.UserPopupController#send
            @param {App.Controllers.UserPopupMessageType} messageType based on values initiated in PreInit
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            @public
            */
            UserPopupController.prototype.send = function (messageType, header, msg) {
                header = tr.translateSubString(header);
                msg = tr.translateSubString(msg);
                log.debug("UserPopupController", "Send message: [" + this.toastrLookUpName[messageType.toString()] + "] Header: '" + header + "', Message: '" + msg + "'");

                var f = this.toastrLookUp[messageType.toString()];
                if (f)
                    f(translater.translate(msg), translater.translate(header), this.toastrOptions); else
                    log.error("UserPopupController", "Unknown message type '" + messageType + "', unable to show popup: Header: '" + header + "', Message: '" + msg + "'");
            };

            /**
            Show a popup as info
            @method App.Controllers.UserPopupController#sendInfo
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            */
            UserPopupController.prototype.sendInfo = function (header, msg) {
                this.send(App.Controllers.UserPopupMessageType.info, header, msg);
            };

            /**
            Show a popup as error
            @method App.Controllers.UserPopupController#sendError
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            */
            UserPopupController.prototype.sendError = function (header, msg) {
                this.send(App.Controllers.UserPopupMessageType.error, header, msg);
            };

            /**
            Show a popup as success
            @method App.Controllers.UserPopupController#sendSuccess
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            */
            UserPopupController.prototype.sendSuccess = function (header, msg) {
                this.send(App.Controllers.UserPopupMessageType.success, header, msg);
            };

            /**
            Show a popup as warning
            @method App.Controllers.UserPopupController#sendWarning
            @param {string} header Text shown in the top of the popup
            @param {string} msg Text shown inside the popup
            */
            UserPopupController.prototype.sendWarning = function (header, msg) {
                this.send(App.Controllers.UserPopupMessageType.warning, header, msg);
            };
            return UserPopupController;
        })();
        Controllers.UserPopupController = UserPopupController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var userPopupController = new App.Controllers.UserPopupController();
startup.addPreInit(function () {
    userPopupController.PreInit();
}, "UserPopupController");
//@ sourceMappingURL=UserPopupController.js.map
