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
        }

        /**
            Opens the POI Preview inside the footer element
            @method App.Controllers.PoiController#OpenPreview
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the preview
            @public  
        */
        public OpenPreview(poi: App.Models.PointOfInterest, show: Boolean) {
            var _this = this;
            var poiPrev = $("#poiPreview");
            poiPrev.html('<div class="right"><img src="Content/images/AppIcons/moreInfo.png" id="openDetailBtn" class="previewBtn"/><br/>'
                + '<img src="Content/images/AppIcons/lessInfo.png" id="closePreviewBtn" class="previewBtn"/></div>'
                + '<div class="left leftPreview"><img src="' + poi.iconCategoryURL() + '" class="categoryImage"></div>'
                + '<div class="middle previewName"><h2>' + poi.name() + '</h2>'
            //+ _this.renderMediaIcons(poi)
                + '<img src="' + poi.iconMediaTypeURL() + '" class="mediaImage left"/>'
                + '</div>');

            phoneGapProvider.fixALinksIfPhoneGap(poiPrev);

            var _this = this;
            $("#closePreviewBtn").mousedown(function () { _this.hidePoiPreview(); });
            $("#openDetailBtn").mousedown(function () { _this.OpenDetail(poi); });

            if (show)
                $("#poiPreview").show();
        }


        //Not used
        private renderMediaIcons(poi: App.Models.PointOfInterest): string {
            var mediaIcons: string[];

            var mediaIcon: string;
            var mediaType = pointOfInterestTypeProvider.getMediaType(poi);
            $.each(mediaType, function (k, v: App.Providers.MediaTypeItem) {
                mediaIcon = '<img src="' + v.icon + '" class="mediaImage"/>';
                mediaIcons.push(mediaIcon);
            });

            return mediaIcons.toString();
        }

        /**
            Opens the POI Detail inside the poi view
            @method App.Controllers.PoiController#OpenDetail
            @param {App.Models.PointOfInterest} poi Poi to be displayed in the poiView
            @public  
        */
        public OpenDetail(poi: App.Models.PointOfInterest) {
            log.debug("PoiController", "OpenDetail");
            $("#poiPreview").addClass("poiPreviewActiveDetail").show();
            $("#poiPreview #openDetailBtn").hide();

            var _this = this;

            //fill fields with data from POI
            var poiDetail = $("#poiDetail");
            if (poi.thumbnail().length > 0) {
                poiDetail.find("#poiThumbnail").attr("src", poi.thumbnail());
                poiDetail.find("#poiImage").show();
            }

            poiDetail.find("#poiIngress").html(poi.ingress());
            poiDetail.find("#poiDescription").html(poi.description());

            var tags = "";
            if (poi.tags())
                tags = "<b>Emneord:</b> " + poi.tags().toString() + "</br>";
            var date = "";
            if (poi.year())
                date = "<b>Datering:</b> " + poi.year() + " </br>";
            var eierinstitusjon = "";
            if (poi.owner())
                eierinstitusjon = "<b>Kilde:</b> " + poi.owner() + " <br / > "
            var institusjon = "";
            if (poi.institution())
                institusjon = "<b>Institusjon:</b> " + poi.institution() + "</br>";
            var originalVersjon = "";
            if (poi.originalVersion())
                originalVersjon = "<b>Original versjon:</b> " + poi.originalVersion() + "</br>";
            var opphavsPerson = "";
            if (poi.creator())
                opphavsPerson = "<b>Opphavsperson:</b> " + poi.creator() + " </br > ";
            var lisens = "";
            if (poi.license() && poi.license().toString() != "")
                lisens = "<b>Lisens:</b> " + poi.license().toString() + "</br>";
            var eksterneLenker = "";
            if (poi.linkMoreInfo())
                eksterneLenker += "<a href='" + poi.linkMoreInfo() + "'> " + poi.linkMoreInfo() + " </a><br />";
            if (poi.landingPage())
                eksterneLenker += "<a href='" + poi.landingPage() + "'>" + poi.landingPage() + "</a><br />";
            if (poi.link())
                eksterneLenker += "<a href='" + poi.link() + "'>" + poi.link() + "</a>";
            if (eksterneLenker)
                eksterneLenker = "<b>Eksterne lenker:</b> " + eksterneLenker;

            poiDetail.find("#poiAboutData").html(
                    tags
                    + date
                    + eierinstitusjon
                    + institusjon
                    + originalVersjon
                    + opphavsPerson
                    + lisens
                    + eksterneLenker
                );

            //_this.showImage(poi.thumbnail());

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
            $("#closePreviewBtn").mousedown(function () { viewController.selectView(viewController.getOldView().name); });

            phoneGapProvider.fixALinksIfPhoneGap(poiDetail);

            viewController.selectView("poiView");
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
viewController.addPreSelectEvent(function () {
    var oldView = viewController.getOldView();
    var currentView = viewController.getCurrentView();

    if (oldView && oldView.name == "poiView") {
        poiController.hidePoiPreview();
    }

    if (currentView && currentView.name == "arView") {

    }

});
startup.addInit(function () { poiController.Init(); }, "PoiController");