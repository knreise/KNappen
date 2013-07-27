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
        }

        /**
            PreInit
            @method App.Controllers.SettingsController#Init
            @public
        */
        public Init() {
            var _this = this;
            log.debug("SettingsController", "Init()");

            // Save button
            $("#settingsButtonSave").mousedown(function () {
                settings.save();
                log.userPopup(tr.translate('SETTINGS'), tr.translate('SETTINGS_SAVED'));
                return false;
            });

            // Need to update module every time settings changes
            mapStorageProvider.setEnabled(!settings.disableCaching);
            settings.onPostSave.addHandler(function () {
                mapStorageProvider.setEnabled(!settings.disableCaching);
            }, "SettingsController");
            settings.onPostLoad.addHandler(function () {
                mapStorageProvider.setEnabled(!settings.disableCaching);
            }, "SettingsController");

            // Clear cache button
            $("#btnClearCache").mousedown(function () {
                $.each(config.mapCacheTileLimit, function (k, v) {
                    mapStorageProvider.clear(k);
                });
                log.userPopup(tr.translate('Cache'), tr.translate('Cache cleared'));
                return false;
            });

            // Open admin if logo clicked 10 times
            $("#logoFrame").mousedown(function () {
                _this.adminOpenCounter++;
                if (_this.adminOpenCounter == 10) {
                    $("#adminSettingsDiv").show();
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
            if (oldView && oldView.name == "settingsView") {
                log.debug("SettingsController", "Entered settings screen.");
            }
        }
    }
}
var settingsController = new App.Controllers.SettingsController();
startup.addPreInit(function () { settingsController.PreInit(); }, "SettingsController");
startup.addInit(function () { settingsController.Init(); }, "SettingsController");