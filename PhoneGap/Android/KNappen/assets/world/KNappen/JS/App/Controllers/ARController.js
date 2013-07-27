var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var ARController = (function () {
            /**
            ARController
            @class App.Controllers.ARController
            @classdesc This class controls Augmented Reality experience for user. For example hides the background to show the camera, and render Points of Interest
            */
            function ARController() {
                this._this = this;
            }
            ARController.prototype.PreInit = function () {
                templateProvider.queueTemplateDownload(config.templatePOIAR);
            };

            /**
            Hooks up the searchresultcallback event to renderView and adds a PoiClickHandler
            @method App.Controllers.ARController#Init
            @public
            */
            ARController.prototype.Init = function () {
                log.debug("ARController", "Init()");
                viewController.addPreSelectEvent(this.onViewChangedPre);
                viewController.addSelectEvent(this.onViewChanged);

                var rv = this.renderView;
                searchController.addSearchResultCallback(function (event, searchResult) {
                    rv(this._this, searchResult);
                });

                arProvider.addPoiClickHandler(function (event, _poi) {
                    var poi = _poi;

                    //todo, switch to openpreview when it is positioned right on map and ar..
                    //poiController.OpenDetail(poi);
                    poiController.OpenPreview(poi, true);
                });
            };

            /**
            Renders the searchresult to Points of Interest in Augmented Reality
            @method App.Controllers.ARController#renderView
            @param {App.Controllers.ARController} _this
            @param {App.Models.SearchResult} searchResult
            @private
            */
            ARController.prototype.renderView = function (_this, searchResult) {
                log.debug("ARController", "renderView()");

                // Send search result for rendering. Using HTML render callback to draw each POI elements HTML code.
                arProvider.resultToPoI(searchResult.items, function (_poi) {
                    var poi = _poi;
                    var preImageUrl = "";

                    var keys = templateProvider.getReplacementKeys(poi);
                    (keys).iconCategoryURL(config.fixLocalFileRef((keys).iconCategoryURL()));

                    return templateProvider.getTemplate(config.templatePOIAR, keys);
                });
            };

            ARController.prototype.onViewChangedPre = function (event, oldView, newView) {
                if (oldView && oldView.name == "arView") {
                    log.debug("ARController", "View changed away from AR: Disabling camera");

                    // Turn off AR camera
                    arProvider.enableAR(false);

                    // Restore back what was here before endering arView
                    $("body").css('background-color', this.oldBodyBackgroundColor);
                    $("body").css('height', this.oldBodyHeight);
                    $("html").css('height', this.oldHtmlHeight);

                    //$("#mainSection").css('min-height', this.oldmainPageHeight);
                    $("#headerSection").css('height', this.oldHeaderSectionHeight);
                    $("#mainSection").show();
                    $("#headerSectionSize").show();
                    $("#logoFrame").show();

                    //$("[data-role=page]").show();
                    $("#footerSection").show();
                }
            };

            /**
            Toggles the html to show camera when changing to or from the AR view
            @method App.Controllers.ARController#onViewChanged
            @param {JQueryEventObject} event
            @param {System.GUI.ViewControllerItem} oldView
            @param {System.GUI.ViewControllerItem} newView
            @private
            */
            ARController.prototype.onViewChanged = function (event, oldView, newView) {
                if (!oldView)
                    $("#arMenu").hide();

                if (newView.name == "arView") {
                    log.debug("ARController", "View changed to AR: Enabling camera");

                    // Turn on AR camera
                    arProvider.enableAR(true);

                    // Remember settings
                    this.oldBodyBackgroundColor = $("body").css('background-color');
                    this.oldBodyHeight = $("body").css('height');
                    this.oldHtmlHeight = $("html").css('height');

                    //this.oldmainPageHeight = $("#mainPage").css('height');
                    this.oldHeaderSectionHeight = $("#headerSection").css('height');

                    // Now hide HTML
                    $("body").css('background-color', 'transparent');
                    $("body").css('height', '0');
                    $("html").css('height', '0');
                    $("#mainSection").hide();
                    $("#headerSectionSize").hide();
                    $("#logoFrame").hide();

                    // TODO: TEMP, just to make it look ok
                    $("#headerSection").css('height', '24');

                    $("#footerSection").hide();
                }
            };
            return ARController;
        })();
        Controllers.ARController = ARController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

var arController = new App.Controllers.ARController();
startup.addInit(function () {
    arController.Init();
}, "ARController");
startup.addPreInit(function () {
    arController.PreInit();
}, "ARController");
//@ sourceMappingURL=ARController.js.map
