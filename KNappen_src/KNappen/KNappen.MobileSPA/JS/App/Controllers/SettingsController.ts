/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {


    export class SettingsController {

        private adminOpenCounter = 0;
        /**
          Settings
          @class App.Controllers.SettingsController
          @classdesc Settings
        */
        constructor() {
        }

        /**
            PreInit
            @method App.Controllers.SettingsController#PreInit
            @public
        */
        public PreInit() {
            log.debug("SettingsController", "PreInit()");
            viewController.addSelectEvent(this.onViewChanged);
            startup.finishedPreInit("SettingsController");
        }

        /**
            PreInit
            @method App.Controllers.SettingsController#Init
            @public
        */
        public postInit() {
            var _this = this;
            log.debug("SettingsController", "postInit()");

            // Save button
            $("#settingsButtonSave").mousedown(function () {
                settings.save();
                userPopupController.sendSuccess(tr.translate('SETTINGS'), tr.translate('SETTINGS_SAVED'));
                viewController.goBack();
                return false;
            });

            // Need to update module every time settings changes
            mapCacheProvider.setEnabled(!settings.disableCaching());
            eventProvider.settings.onPostSave.addHandler(function () { mapCacheProvider.setEnabled(!settings.disableCaching()); }, "SettingsController");
            eventProvider.settings.onPostLoad.addHandler(function () { mapCacheProvider.setEnabled(!settings.disableCaching()); }, "SettingsController");

            // Clear cache button
            $("#btnClearCache").mousedown(function () {
                routeController.clearCache();
                userPopupController.sendSuccess(tr.translate('Cache'), tr.translate('Cache cleared'));
                return false;
            });

            // Open admin if logo clicked 10 times
            $("#logoFrame").mousedown(function () {
                _this.adminOpenCounter++;
                if (_this.adminOpenCounter == 10) {
                    $("#adminSettingsDiv").show();
                    $("#mainPopupMenuButtonDebug").show();
                    viewController.selectView("settingsView");
                }
            });

            // Reset if view changes
            viewController.addSelectEvent(function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
                if (oldView && newView && oldView.name != newView.name)
                    _this.adminOpenCounter = 0;
            });


        }

        private onViewChanged(event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
            if (newView && newView.name == "settingsView") {
                
            }
        }

        private updateDropDowns() {
            var _this = this;
        }
        
    }
}
var settingsController = new App.Controllers.SettingsController();
startup.addPreInit(function () { settingsController.PreInit(); }, "SettingsController");
startup.addPostInit(function () { settingsController.postInit(); }, "SettingsController");