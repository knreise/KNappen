var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var WindowSizeController = (function () {
            function WindowSizeController() {
            }
            WindowSizeController.prototype.Load = function () {
                this._window = $(window);
                this.headerSectionSize = $("#headerSectionSize");
                this.headerSection = $("#headerSection");
                this.mainSection = $("#mainSection");
                this.footerSection = $("#footerSection");
                this.map = $("#map");

                this.originalHeaderSectionHeight = this.headerSection.css('height');
                this.resize();
            };

            WindowSizeController.prototype.PreInit = function () {
                var _this = this;
                jQuery(window).resize(function () {
                    _this.resize();
                });
                viewController.addPostSelectEvent(function (event, oldView, newView) {
                    _this.resize();
                });
            };

            WindowSizeController.prototype.PostInit = function () {
                this.resize();
            };

            WindowSizeController.prototype.resize = function () {
                var windowHeight = this._window.outerHeight();
                var headerHeight = this.headerSection.outerHeight();
                var footerHeight = this.footerSection.outerHeight();
                var mainHeight = windowHeight - headerHeight - footerHeight;

                if (!viewController || !viewController.getCurrentView() || viewController.getCurrentView().name != "arView") {
                    this.headerSectionSize.outerHeight(headerHeight);
                    this.mainSection.outerHeight(mainHeight);
                    this.map.outerHeight(mainHeight);

                    log.debug("WindowSizeController", "Resizing mainSection to " + mainHeight + "px (windows: " + windowHeight + ", header: " + headerHeight + ", footer: " + footerHeight + ")");
                }
            };

            WindowSizeController.prototype.ShowTopMenu = function () {
                this.headerSection.show();
                this.headerSection.css('height', this.originalHeaderSectionHeight);
                this.headerSectionSize.css('height', this.originalHeaderSectionHeight);
                this.resize();
            };

            WindowSizeController.prototype.HideTopMenu = function () {
                this.headerSection.css('height', '0px');
                this.headerSectionSize.css('height', '0px');
                this.headerSection.hide();
                this.resize();
            };
            return WindowSizeController;
        })();
        Controllers.WindowSizeController = WindowSizeController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var windowSizeController = new App.Controllers.WindowSizeController();
startup.addLoad(function () {
    windowSizeController.Load();
});
startup.addPreInit(function () {
    windowSizeController.PreInit();
});
startup.addPostInit(function () {
    windowSizeController.PostInit();
});
//@ sourceMappingURL=WindowSizeController.js.map
