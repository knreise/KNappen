/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    declare var $;
    export class PoiController {

        /**
           PoiController
           @class App.Controllers.PoiController
           @classdesc This class controls the way Points of Interest should be displayed
        */
        constructor() {

        }

        public PreInit() {
            log.debug("PoiController", "PreInit()");

            // Queue all templates for downloading immediately
            templateProvider.queueTemplateDownload(config.templatePOIPreview);
            templateProvider.queueTemplateDownload(config.templatePOIDetailsView);
        }

        /**
            Creates the html that will be used for POI Preview and Detail and appends it to 'body'
            @method App.Controllers.PoiController#Init
            @public     
        */
        public Init() {
            log.debug("PoiController", "Init()");
            //append nødvendige elementer til passende steder
            $("body").append('<div id="poiPreview"></div>');

            $(document).mousedown(function () {
                var currentView = viewController.getCurrentView();

                if (currentView && currentView.name != "poiView" && currentView.name != "arView")
                    poiController.hidePoiPreview();
            });

            viewController.addPostSelectEvent(function (event, oldView, newView) {
                if (oldView && oldView.name == "poiView") poiController.closeDetail();
            });
            viewController.addSelectEvent(function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
                if (newView.name === "poiView") {
                    windowSizeController.ShowHeader(false);
                } else {
                    if (oldView && oldView.name == "poiView") {
                        windowSizeController.ShowHeader(true);
                        // Moved away from poiView? Hide it. (not required any more since we are not using dialog)
                        poiController.hidePoiPreview();
                    }
                }
            });
        }

        /**
            Opens the POI Preview inside the footer element
            @method App.Controllers.PoiController#OpenPreview
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the preview
            @public  
        */
        public OpenPreview(poi: App.Models.PointOfInterest, show: Boolean) {

            var content = this.getPreview(poi);

            var poiPrev = $("#poiPreview");
            poiPrev.html(content);

            if (show)
                $("#poiPreview").show();
        }

        private getPreview(poi: App.Models.PointOfInterest): JQuery {
            var _this = this;
            var keys = templateProvider.getReplacementKeys(poi);

            var content = $(templateProvider.getTemplate(config.templatePOIPreview, keys));
            phoneGapProvider.fixALinksIfPhoneGap(content);

            // Hook up actions
            content.find("#closePreviewBtn").mousedown(function () {
                _this.hidePoiPreview();
            });
            content.find("#openDetailBtn").mousedown(function () {
                _this.hidePoiPreview();
                _this.OpenDetail(poi);
            });

            return content;
        }

        /**
            Opens the POI Detail inside the poi view
            @method App.Controllers.PoiController#OpenDetail
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the poiView
            @public  
        */
        public OpenDetail(poi: App.Models.PointOfInterest) {
            log.debug("PoiController", "OpenDetail");
            //$("#poiPreview").addClass("poiPreviewActiveDetail").show();
            $("#poiPreview #openDetailBtn").hide();

            var _this = this;

            var keys = templateProvider.getReplacementKeys(poi);

            var poiViewHeader = $("<div id='poiViewHeader'></div>");
            var previewContent = this.getPreview(poi);
            previewContent.find("#openDetailBtn").hide();

            poiViewHeader.append(previewContent);
            var poiViewBody = $(templateProvider.getTemplate(config.templatePOIDetailsView, keys));

            // Add to view
            var poiView = $("#poiView");
            poiView.html('');
            poiView.append(poiViewHeader);
            poiView.append(poiViewBody)
            phoneGapProvider.fixALinksIfPhoneGap(poiView);

            // Show view
            viewController.selectView("poiView");

            //check mediatypes of POI to show the appropriate viewers
            $.each(poi.mediaTypes(), function (k, v: string) {
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
            //poiView.dialog();

        }

        /**
            Close the poi view, return to the previous view. Reset values in poiview and hide other related parts.
            @method App.Controllers.PoiController#closeDetail
            @public     
        */
        public closeDetail() {
            $("#poiPreview").removeClass("poiPreviewActiveDetail");
            $("#poiPreview #openDetailBtn").show();
            this.clearDetail();
            this.resetDetail();
            _V_("videoElement").src('');
        }

        private clearDetail() {
            //fill fields with data from POI
            var poiDetail = $("#poiDetail");
            poiDetail.find("#poiThumbnail").attr("src", "-");
            poiDetail.find("#poiDetailLicense").html("");
            poiDetail.find("#poiDetailTags").html("");
            poiDetail.find("#poiIngress").html("");
            poiDetail.find("#poiDescription").html("");
            poiDetail.find("#poiAboutData").html("");
            poiDetail.find("#poiRelatedLinks").html("");
        }
        
        private showVideo(path: string) {
            log.debug("PoiController", "Setting video URL: " + path)

            var player = _V_("videoElement", {
                "controls": true,
                "autoplay": false,
                "preload": "none",
                "customControlsOnMobile": true,

            }, function () {
                    // Player (this) is initialized and ready.
                });
            player.src(path);
            //player.play();
            var poiVideoDiv = $("#poiVideo");
            //poiVideoDiv.find("videoSource").attr("src", path);
            poiVideoDiv.show();
        }

        private showAudio(title: string, path: string) {
            this.showAudioStartButton(title, path);
        }

        private showAudioStartButton(title: string, path: string) {
            log.debug("PoiController", "Setting audio URL: " + path)
            var _this = this;
            var poiAudioDiv = $("#poiAudio");
            poiAudioDiv.html('');
            var player = $("<h1><span class='typcn typcn-media-play'></span></h1>").mousedown(function () {
                audioController.play(title, path);
                _this.showAudioStopButton(title, path);
            });
            poiAudioDiv.append(player);

            poiAudioDiv.show();
        }

        private showAudioStopButton(title: string, path: string) {
            var _this = this;
            var poiAudioDiv = $("#poiAudio");
            poiAudioDiv.html('');
            var player = $("<h1><span class='typcn typcn-media-stop'></span></h1>").mousedown(function () {
                audioController.stop();
                _this.showAudioStartButton(title, path);
            });
            poiAudioDiv.append(player);

            poiAudioDiv.show();

        }

        private showImage(path: string) {
            $("#poiThumbnail").attr("src", path).show();
            $("#poiImage").show();
        }

        private resetDetail() {
            //hide all elements that are initially hidden again
            $("#poiVideo").hide();
            $("#poiAudio").hide();
            $("#poiImage").hide();
            $("#addPoiToRouteForm").hide();
            var _this = this;
            _this.hidePoiPreview();
            $("#closePreviewBtn").mousedown(function () { _this.hidePoiPreview(); });
        }

        public hidePoiPreview() {
            $("#poiPreview").hide();
        }

        public hidePoiDialogues() {
            this.hidePoiPreview();
        }
    }


}
var poiController = new App.Controllers.PoiController();
startup.addPreInit(function () { poiController.PreInit(); }, "PoiController");
startup.addInit(function () { poiController.Init(); }, "PoiController");