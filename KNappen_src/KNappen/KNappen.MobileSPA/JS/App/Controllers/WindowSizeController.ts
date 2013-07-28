/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    export class WindowSizeController {

        private _window: any;
        private headerSectionSize: any;
        private headerSection: any;
        private mainSection: any;
        private footerSection: any;
        private map: any;
        private originalHeaderSectionHeight: number;
        private originalFooterSectionHeight: number;
        private originalPageBGColor: string;
        private originalBodyHeight: any;
        private originalHTMLHeight: any;

        public Load() {
            this._window = $(window);
            this.headerSectionSize = $("#headerSectionSize");
            this.headerSection = $("#headerSection");
            this.mainSection = $("#mainSection");
            this.footerSection = $("#footerSection");
            this.map = $("#map");

            this.originalHeaderSectionHeight = this.headerSection.css('height');
            this.originalFooterSectionHeight = this.footerSection.css('height');


            this.footerSection.css('height', '0px');
            //this.ShowFooter(false);

            //this.resize(); // Done in post

        }

        public PreInit() {
            var _this = this;
            jQuery(window).resize(function () { _this.resize(); });
            viewController.addPostSelectEvent(function (event, oldView, newView) {
                _this.resize();
            });

        }

        public PostInit() {
            this.resize();
        }

        public resize() {
            var windowHeight = this._window.outerHeight();
            var headerHeight = this.headerSection.outerHeight();
            var footerHeight = this.footerSection.outerHeight();
            var mainHeight = windowHeight - headerHeight - footerHeight;

            if (!viewController || !viewController.getCurrentView() || viewController.getCurrentView().name != "arView") {
                this.headerSectionSize.outerHeight(headerHeight);
                this.mainSection.outerHeight(mainHeight);
                this.map.outerHeight(mainHeight);

                this.mainSection.css('top', headerHeight);
                //this.map.css('top', headerHeight);

                log.debug("WindowSizeController", "Resizing mainSection to " + mainHeight + "px (windows: " + windowHeight + ", header: " + headerHeight + ", footer: " + footerHeight + ")");
            }

        }

        public ShowHeader(visible: bool) {
            log.debug("WindowSizeController", "showHeader: " + visible);
            if (visible) {
                this.headerSection.show();
                this.headerSection.css('height', this.originalHeaderSectionHeight);
                this.headerSectionSize.css('height', this.originalHeaderSectionHeight);
            } else {
                this.headerSection.css('height', '0px');
                this.headerSectionSize.css('height', '0px');
                this.headerSection.hide();
            }
            this.resize();
        }

        public ShowFooter(visible: bool) {
            log.debug("WindowSizeController", "showFooter: " + visible);
            if (visible) {
                this.footerSection.show();
                this.footerSection.css('height', this.originalFooterSectionHeight);
            } else {
                this.footerSection.css('height', '0px');
                this.footerSection.hide();
            }
            this.resize();
        }

        public ShowPage(visible: bool) {
            log.debug("WindowSizeController", "showPage: " + visible);
            
            if (visible) {
                $("body").css('background-color', this.originalPageBGColor);
                $("html").css('height', this.originalHTMLHeight);
                $("body").css('height', this.originalBodyHeight);
                this.ShowHeader(true);
            } else {
                this.ShowHeader(false);
                this.ShowFooter(false);
                this.mainSection.css('height', '0px');
                this.mainSection.hide();

                this.originalPageBGColor = $("body").css('background-color');
                this.originalBodyHeight = $("body").css('height');
                this.originalHTMLHeight = $("html").css('height');

                $("body").css('background-color', 'transparent');
                $("body").css('height', '0');
                $("html").css('height', '0');
            }
        }

    }
}
var windowSizeController = new App.Controllers.WindowSizeController();
startup.addLoad(function () { windowSizeController.Load(); });
startup.addPreInit(function () { windowSizeController.PreInit(); });
startup.addPostInit(function () { windowSizeController.PostInit(); });