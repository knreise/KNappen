/// <reference path="../_References.ts" />
module App.Controllers {
    export class SplashScreenController {
        private div: JQuery = null;
        private label: JQuery = null;

        constructor() {
            this.div = $("<div id=*splashScreen' style='opacity: 0.8; background-color: #ccc; position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; z-index: 1000;' > </div>");
            this.label = $("<div id='splashLabel' style='font-size: 200%; font-weight: bold; min-height: 10em; display: table-cell; vertical-align: middle; text-align: center'></div>");
            this.div.append(this.label);
            $("body").append(this.div);
            this.label.html("Starting up...");
        }

        public Load() {
            this.label.html("Loading settings and map data...");
        }
        public PreInit() {
            this.label.html("Readying modules...");
        }
        public Init() {
            this.label.html("Initializing modules...");
        }
        public PostInit() {
            this.label.html("Almost there...");
            this.div.hide();
            this.div.css('width', '1px');
            this.div.css('height', '1px');
            this.div.css('top', '-1');
            this.div.css('left', '-1');
        }
    }
}
var splashScreenController = new App.Controllers.SplashScreenController();
startup.addLoad(function () { splashScreenController.Load(); });
startup.addPreInit(function () { splashScreenController.PreInit(); });
startup.addInit(function () { splashScreenController.Init(); });
startup.addPostInit(function () { splashScreenController.PostInit(); });
