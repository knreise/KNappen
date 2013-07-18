/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    export class GoogleAnalyticsController {

        /**
            GoogleAnalyticsController
            @class App.Controllers.GoogleAnalyticsController
            @classdesc This class controls Google Analytics
        */
        constructor() {
        }

        private googleAnalyticsProvider: System.Providers.GoogleAnalyticsProvider = null;

        /**
            Initialize properties
            @method App.Controllers.GoogleAnalyticsController#PreInit
            @public
        */
        public PreInit() {
            this.googleAnalyticsProvider = new System.Providers.GoogleAnalyticsProvider();
        }

        /**
            Adds an event to the ViewController to report page visits with Google Analytics when a new view is selected
            @method App.Controllers.GoogleAnalyticsController#Init
            @public
        */
        public Init() {
            var _this = this;
            viewController.addSelectEvent(function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
                _this.googleAnalyticsProvider.reportPageVisit(newView.name);
            });
        }
    }
}
var googleAnalyticsController = new App.Controllers.GoogleAnalyticsController();
startup.addInit(function () { googleAnalyticsController.Init(); }, "GoogleAnalyticsController");
startup.addPreInit(function () { googleAnalyticsController.PreInit(); }, "GoogleAnalyticsController");