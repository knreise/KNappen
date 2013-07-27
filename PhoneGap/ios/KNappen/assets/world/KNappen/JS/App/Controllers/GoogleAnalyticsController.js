var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var GoogleAnalyticsController = (function () {
            /**
            GoogleAnalyticsController
            @class App.Controllers.GoogleAnalyticsController
            @classdesc This class controls Google Analytics
            */
            function GoogleAnalyticsController() {
                this.googleAnalyticsProvider = null;
            }
            /**
            Initialize properties
            @method App.Controllers.GoogleAnalyticsController#PreInit
            @public
            */
            GoogleAnalyticsController.prototype.PreInit = function () {
                this.googleAnalyticsProvider = new System.Providers.GoogleAnalyticsProvider();
            };

            /**
            Adds an event to the ViewController to report page visits with Google Analytics when a new view is selected
            @method App.Controllers.GoogleAnalyticsController#Init
            @public
            */
            GoogleAnalyticsController.prototype.Init = function () {
                var _this = this;
                viewController.addSelectEvent(function (event, oldView, newView) {
                    _this.googleAnalyticsProvider.reportPageVisit(newView.name);
                });
            };
            return GoogleAnalyticsController;
        })();
        Controllers.GoogleAnalyticsController = GoogleAnalyticsController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var googleAnalyticsController = new App.Controllers.GoogleAnalyticsController();
startup.addInit(function () {
    googleAnalyticsController.Init();
}, "GoogleAnalyticsController");
startup.addPreInit(function () {
    googleAnalyticsController.PreInit();
}, "GoogleAnalyticsController");
//@ sourceMappingURL=GoogleAnalyticsController.js.map
