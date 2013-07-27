var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var ARProvider = (function () {
            /**
            * ARProvider
            * @class System.Providers.ARProvider
            * @classdesc Provides AR functionality
            */
            function ARProvider() {
                this.wikitudeProvider = null;
                this._this = this;
            }
            ARProvider.prototype.PreInit = function () {
                log.debug("ARProvider", "PreInit()");

                if (!compatibilityInfo.hasAR)
                    return;

                this.wikitudeProvider = new System.Providers.WikitudeProvider();
                this.wikitudeProvider.PreInit();

                var w = this.wikitudeProvider;
                window.setTimeout(function () {
                    // Disable camera by default (first load)
                    w.resetARState();
                }, 1000);
            };

            /**
            * Paint POI array onto  AR.
            * @method System.Providers.ARProvider#resultToPoI
            * @param {array} poi Array of System.Models.KnockoutObservablePointOfInterestBaseArray
            * @param {function} htmlDrawCallBack Function to call for HTML content of POI: function(poi: System.Models.PointOfInterestBase) { return "<h1>id: " + poi.id + "</h1>"; }
            */
            ARProvider.prototype.resultToPoI = function (poi, htmlDrawCallback) {
                if (!compatibilityInfo.hasAR)
                    return;

                var count = 0;
                if (poi && poi())
                    count = poi().length;
                log.debug("ARProvider", "Drawing " + count + " PoIs.");

                this.wikitudeProvider.resultToWikitudePoI(poi, htmlDrawCallback);
            };

            /**
            * Change state of AR camera
            * @method System.Providers.ARProvider#enableAR
            * @param {bool} state True=enable AR camera, False=disable AR camera
            */
            ARProvider.prototype.enableAR = function (state) {
                if (!compatibilityInfo.hasAR)
                    return;

                log.debug("ARProvider", "Setting AR camera state to: " + state);
                this._this.wikitudeProvider.enableAR(state);
            };

            /**
            * Add click handler for POI
            * @method System.Providers.ARProvider#addPoiClickHandler
            * @param {function} clickCallback Callback function with signature function (event: JQueryEventObject, poi: System.Models.PointOfInterestBase) {}
            */
            ARProvider.prototype.addPoiClickHandler = function (clickCallback) {
                this._this.wikitudeProvider.addPoiClickHandler(clickCallback);
            };
            return ARProvider;
        })();
        Providers.ARProvider = ARProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var arProvider = new System.Providers.ARProvider();
startup.addPreInit(function () {
    arProvider.PreInit();
}, "ARProvider");
//@ sourceMappingURL=ARProvider.js.map
