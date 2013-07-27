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
                log.debug("SettingsController", "Init()");
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
