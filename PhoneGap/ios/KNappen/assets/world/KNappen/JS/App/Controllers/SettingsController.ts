/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {


    export class SettingsController {

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
            log.debug("SettingsController", "Init()");
            
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