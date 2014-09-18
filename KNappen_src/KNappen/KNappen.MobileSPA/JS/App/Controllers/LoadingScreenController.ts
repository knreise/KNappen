/// <reference path="../_References.ts" />

module App.Controllers
{
    declare var $;
    export class LoadingScreenController{

        private loader: any = null;
        private loaderText: any = null;
        
        constructor() {
        
        }

        public init(): void {
            phoneGapInterop.onPause.addHandler(function () { loadingScreenController.hideLoadingScreen(); }, "LoadingScreenController");
        }

        public showLoadingScreen(text: string) {

            this.loader = $("#loader");
            this.loaderText = $("#loadTxt");

            this.loaderText.html(text);
            this.loader.addClass("active");
        }

        public hideLoadingScreen() {
            this.loader = $("#loader");
            this.loaderText = $("#loadTxt");
            this.loader.removeClass("active");
        }


    
    }

}

var loadingScreenController = new App.Controllers.LoadingScreenController();
startup.addInit(function () { loadingScreenController.init(); }, "LoadingScreenController");