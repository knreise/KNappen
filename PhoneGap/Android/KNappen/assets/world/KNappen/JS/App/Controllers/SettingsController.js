var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var SettingsController = (function () {
            /**
            Settings
            @class App.Controllers.SettingsController
            @classdesc Settings
            */
            function SettingsController() {
                this.adminOpenCounter = 0;
            }
            /**
            PreInit
            @method App.Controllers.SettingsController#PreInit
            @public
            */
            SettingsController.prototype.PreInit = function () {
                log.debug("SettingsController", "PreInit()");
                viewController.addSelectEvent(this.onViewChanged);
            };

            /**
            PreInit
            @method App.Controllers.SettingsController#Init
            @public
            */
            SettingsController.prototype.Init = function () {
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
                viewController.addSelectEvent(function (event, oldView, newView) {
                    if (oldView && newView && oldView.name != newView.name)
                        _this.adminOpenCounter = 0;
                });
            };

            SettingsController.prototype.onViewChanged = function (event, oldView, newView) {
                if (oldView && oldView.name == "settingsView") {
                    log.debug("SettingsController", "Entered settings screen.");
                }
            };
            return SettingsController;
        })();
        Controllers.SettingsController = SettingsController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var settingsController = new App.Controllers.SettingsController();
startup.addPreInit(function () {
    settingsController.PreInit();
}, "SettingsController");
startup.addInit(function () {
    settingsController.Init();
}, "SettingsController");
//@ sourceMappingURL=SettingsController.js.map
