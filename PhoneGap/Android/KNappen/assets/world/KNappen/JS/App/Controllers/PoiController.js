var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var PoiController = (function () {
            /**
            PoiController
            @class App.Controllers.PoiController
            @classdesc This class controls the way Points of Interest should be displayed
            */
            function PoiController() {
            }
            PoiController.prototype.PreInit = function () {
                log.debug("PoiController", "PreInit()");

                // Queue all templates for downloading immediately
                templateProvider.queueTemplateDownload(config.templatePOIPreview);
                templateProvider.queueTemplateDownload(config.templatePOIDetailsView);
            };

            /**
            Creates the html that will be used for POI Preview and Detail and appends it to 'body'
            @method App.Controllers.PoiController#Init
            @public
            */
            PoiController.prototype.Init = function () {
                log.debug("PoiController", "Init()");

                //append nødvendige elementer til passende steder
                $("body").append('<div id="poiPreview"></div>');

                $(document).mousedown(function () {
                    var currentView = viewController.getCurrentView();

                    if (currentView && currentView.name != "poiView" && currentView.name != "arView")
                        poiController.hidePoiPreview();
                });

                viewController.addPostSelectEvent(function (event, oldView, newView) {
                    if (oldView && oldView.name == "poiView")
                        poiController.closeDetail();
                });
                viewController.addSelectEvent(function (event, oldView, newView) {
                    if (newView.name === "poiView") {
                        windowSizeController.HideTopMenu();
                    } else {
                        if (oldView && oldView.name == "poiView") {
                            windowSizeController.ShowTopMenu();

                            // Moved away from poiView? Hide it. (not required any more since we are not using dialog)
                            poiController.hidePoiPreview();
                        }
                    }
                });
            };

            /**
            Opens the POI Preview inside the footer element
            @method App.Controllers.PoiController#OpenPreview
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the preview
            @public
            */
            PoiController.prototype.OpenPreview = function (poi, show) {
                var _this = this;
                var poiPrev = $("#poiPreview");
                var keys = templateProvider.getReplacementKeys(poi);
                var str = templateProvider.getTemplate(config.templatePOIPreview, keys);
                poiPrev.html(str);
                phoneGapProvider.fixALinksIfPhoneGap(poiPrev);

                var _this = this;
                $("#closePreviewBtn").mousedown(function () {
                    _this.hidePoiPreview();
                });
                $("#openDetailBtn").mousedown(function () {
                    _this.OpenDetail(poi);
                });

                if (show)
                    $("#poiPreview").show();
            };

            //Not used
            PoiController.prototype.renderMediaIcons = function (poi) {
                var mediaIcons;

                var mediaIcon;
                var mediaType = pointOfInterestTypeProvider.getMediaType(poi);
                $.each(mediaType, function (k, v) {
                    mediaIcon = '<img src="' + v.icon + '" class="mediaImage"/>';
                    mediaIcons.push(mediaIcon);
                });

                return mediaIcons.toString();
            };

            /**
            Opens the POI Detail inside the poi view
            @method App.Controllers.PoiController#OpenDetail
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the poiView
            @public
            */
            PoiController.prototype.OpenDetail = function (poi) {
                log.debug("PoiController", "OpenDetail");
                $("#poiPreview").addClass("poiPreviewActiveDetail").show();
                $("#poiPreview #openDetailBtn").hide();

                var _this = this;

                var keys = templateProvider.getReplacementKeys(poi);

                viewController.selectView("poiView");

                var str = templateProvider.getTemplate(config.templatePOIDetailsView, keys);
                var poiView = $("#poiView");
                poiView.html(str);
                phoneGapProvider.fixALinksIfPhoneGap(poiView);

                //check mediatypes of POI to show the appropriate viewers
                $.each(poi.mediaTypes(), function (k, v) {
                    v = v.toUpperCase();

                    if (v == "IMAGE")
                        _this.showImage(poi.thumbnail());
                    if (v == "VIDEO" && poi.videoUri())
                        _this.showVideo(poi.videoUri()[0]);
                    if (v == "SOUND" && poi.soundUri())
                        _this.showAudio(poi.name()[0], poi.soundUri()[0]);
                });

                var detailAccordion = $("#detailAccordion");
                detailAccordion.accordion({ active: false, collapsible: false });

                //Todo: fix this later
                detailAccordion.accordion("option", "icons", { 'header': 'showMoreAccordion', 'activeHeader': 'showLessAccordion' });
                $('#detailAccordion .ui-accordion-content').show();

                $("#addPoiToRoute").mousedown(function () {
                    routeController.openRouteList(poi);
                });

                $("#createNewRouteBtn").mousedown(function () {
                    var name = $("#newRouteName").val();
                    routeController.createRoute(name, poi);
                    $("#newRouteName").val("");
                });

                //return to previous view when closing the dialog, should this be handled some other way,
                //such as placing the poiview on top of current view instead? how?
                $("#closePreviewBtn").mousedown(function () {
                    viewController.selectView(viewController.getOldView().name);
                });
            };

            /**
            Close the poi view, return to the previous view. Reset values in poiview and hide other related parts.
            @method App.Controllers.PoiController#closeDetail
            @public
            */
            PoiController.prototype.closeDetail = function () {
                $("#poiPreview").removeClass("poiPreviewActiveDetail");
                $("#poiPreview #openDetailBtn").show();
                this.clearDetail();
                this.resetDetail();
                _V_("videoElement").src('');
            };

            PoiController.prototype.clearDetail = function () {
                //fill fields with data from POI
                var poiDetail = $("#poiDetail");
                poiDetail.find("#poiThumbnail").attr("src", "-");
                poiDetail.find("#poiDetailLicense").html("");
                poiDetail.find("#poiDetailTags").html("");
                poiDetail.find("#poiIngress").html("");
                poiDetail.find("#poiDescription").html("");
                poiDetail.find("#poiAboutData").html("");
                poiDetail.find("#poiRelatedLinks").html("");
            };

            PoiController.prototype.showVideo = function (path) {
                log.debug("PoiController", "Setting video URL: " + path);

                var player = _V_("videoElement", {
                    "controls": true,
                    "autoplay": false,
                    "preload": "none",
                    "customControlsOnMobile": true
                }, function () {
                });
                player.src(path);

                //player.play();
                var poiVideoDiv = $("#poiVideo");

                //poiVideoDiv.find("videoSource").attr("src", path);
                poiVideoDiv.show();
            };

            PoiController.prototype.showAudio = function (title, path) {
                this.showAudioStartButton(title, path);
            };

            PoiController.prototype.showAudioStartButton = function (title, path) {
                log.debug("PoiController", "Setting audio URL: " + path);
                var _this = this;
                var poiAudioDiv = $("#poiAudio");
                poiAudioDiv.html('');
                var player = $("<h1><span class='typcn typcn-media-play'></span></h1>").mousedown(function () {
                    audioController.play(title, path);
                    _this.showAudioStopButton(title, path);
                });
                poiAudioDiv.append(player);

                poiAudioDiv.show();
            };

            PoiController.prototype.showAudioStopButton = function (title, path) {
                var _this = this;
                var poiAudioDiv = $("#poiAudio");
                poiAudioDiv.html('');
                var player = $("<h1><span class='typcn typcn-media-stop'></span></h1>").mousedown(function () {
                    audioController.stop();
                    _this.showAudioStartButton(title, path);
                });
                poiAudioDiv.append(player);

                poiAudioDiv.show();
            };

            PoiController.prototype.showImage = function (path) {
                $("#poiThumbnail").attr("src", path).show();
                $("#poiImage").show();
            };

            PoiController.prototype.resetDetail = function () {
                //hide all elements that are initially hidden again
                $("#poiVideo").hide();
                $("#poiAudio").hide();
                $("#poiImage").hide();
                $("#addPoiToRouteForm").hide();
                var _this = this;
                _this.hidePoiPreview();
                $("#closePreviewBtn").mousedown(function () {
                    _this.hidePoiPreview();
                });
            };

            PoiController.prototype.hidePoiPreview = function () {
                $("#poiPreview").hide();
            };

            PoiController.prototype.hidePoiDialogues = function () {
                this.hidePoiPreview();
            };
            return PoiController;
        })();
        Controllers.PoiController = PoiController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var poiController = new App.Controllers.PoiController();
startup.addPreInit(function () {
    poiController.PreInit();
}, "PoiController");
startup.addInit(function () {
    poiController.Init();
}, "PoiController");
//@ sourceMappingURL=PoiController.js.map
