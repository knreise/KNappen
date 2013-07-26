/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    export class ARProvider {
        public wikitudeProvider: System.Providers.WikitudeProvider = null;
        /** @ignore */ private _this: ARProvider;

        /**
          * ARProvider
          * @class System.Providers.ARProvider
          * @classdesc Provides AR functionality
          */
        constructor() {
            this._this = this;
        }

        public PreInit() {
            log.debug("ARProvider", "PreInit()");
            // If we don't have AR then no need to run this
            if (!compatibilityInfo.hasAR)
                return;


            this.wikitudeProvider = new System.Providers.WikitudeProvider();
            this.wikitudeProvider.PreInit();

            var w = this.wikitudeProvider;
            window.setTimeout(function () {
                // Disable camera by default (first load)
                w.resetARState();
            }, 1000);
        }


        /**
          * Paint POI array onto  AR.
          * @method System.Providers.ARProvider#resultToPoI
          * @param {array} poi Array of System.Models.KnockoutObservablePointOfInterestBaseArray
          * @param {function} htmlDrawCallBack Function to call for HTML content of POI: function(poi: System.Models.PointOfInterestBase) { return "<h1>id: " + poi.id + "</h1>"; }
          */
        public resultToPoI(poi: System.Models.KnockoutObservablePointOfInterestBaseArray, htmlDrawCallback: { (poi: System.Models.PointOfInterestBase): string; }) {
            // If we don't have AR then no need to run this
            if (!compatibilityInfo.hasAR)
                return;

            var count: number = 0;
            if (poi && poi())
                count = poi().length;
            log.debug("ARProvider", "Drawing " + count + " PoIs.");

            this.wikitudeProvider.resultToWikitudePoI(poi, htmlDrawCallback);
            
        }

        /**
          * Change state of AR camera
          * @method System.Providers.ARProvider#enableAR
          * @param {bool} state True=enable AR camera, False=disable AR camera
          */
        public enableAR(state: bool) {
            // If we don't have AR then no need to run this
            if (!compatibilityInfo.hasAR)
                return;

            log.debug("ARProvider", "Setting AR camera state to: " + state);
            this._this.wikitudeProvider.enableAR(state);
        }
                
        /**
          * Add click handler for POI
          * @method System.Providers.ARProvider#addPoiClickHandler
          * @param {function} clickCallback Callback function with signature function (event: JQueryEventObject, poi: System.Models.PointOfInterestBase) {}
          */
        public addPoiClickHandler(clickCallback: { (event: JQueryEventObject, poi: System.Models.PointOfInterestBase): void; }) {
            this._this.wikitudeProvider.addPoiClickHandler(clickCallback);
        }
    }
}
var arProvider = new System.Providers.ARProvider();
startup.addPreInit(function () { arProvider.PreInit(); }, "ARProvider");