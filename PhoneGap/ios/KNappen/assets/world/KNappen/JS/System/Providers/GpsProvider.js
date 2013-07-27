var System;
(function (System) {
    /// <reference path="../Models/Position.ts" />
    /// <reference path="../Diagnostics/Log.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var GpsProvider = (function () {
            /**
            Determines if browser supports GPS coordinates
            @class System.Providers.GpsProvider
            @classdesc Manages GPS
            */
            function GpsProvider() {
                this._this = $(this);
            }
            GpsProvider.prototype.PostInit = function () {
                var _this = this;
                if (!compatibilityInfo.hasAR) {
                    if (navigator.geolocation) {
                        log.debug("GpsProvider", "Runtime environment supports GPS, will use.");
                        this.readBrowserGpsPos(this);
                        setInterval(function () {
                            _this.readBrowserGpsPos(_this);
                        }, 10000);
                    } else {
                        log.debug("GpsProvider", "Runtime environment doesn't support GPS.");
                    }
                }
            };

            /**
            Hook up callback to GPS position changed event.
            @method System.Providers.GpsProvider#addPositionChangedHandler
            @param posChangedCallback A function with signature "function(event: JQueryEventObject, pos: System.Models.Position) {}" (just "function (event, pos) {}" in pure JS).
            @public
            */
            GpsProvider.prototype.addPositionChangedHandler = function (posChangedCallback) {
                this._this.on('PosChanged', posChangedCallback);
            };

            GpsProvider.prototype.readBrowserGpsPos = function (_this) {
                //log.debug("GpsSystem", "Reading browser pos...");
                // We are reading browser GPS coordinates at an interval to feed our update method
                navigator.geolocation.getCurrentPosition(function (position) {
                    var lat = position.coords.latitude;
                    var lon = position.coords.longitude;
                    var alt = position.coords.altitude;
                    var acc = position.coords.accuracy;

                    //log.debug("GpsSystem", "New browser based GPS pos found: (" + lat + ", " + lon + ", " + alt + ", " + acc + ")");
                    _this.setPos(lat, lon, alt, acc);
                }, function () {
                    log.debug("GpsProvider", "Error getting GPS position from browser.");
                }, { enableHighAccuracy: true, timeout: 60 * 1000, maximumAge: 60 * 1000 });
            };

            /**
            Send a new GPS position to this module. Will trigger PositionChanged event.
            @method System.Providers.GpsProvider#setPos
            @param {number} lat Latitude.
            @param {number} lon Longditude.
            @param {number} alt Altitude.
            @param {number} acc Accelleration.
            @public
            */
            GpsProvider.prototype.setPos = function (lat, lon, alt, acc, altitudeAccuracy, heading, speed, timestamp) {
                // We have received an update of GPS pos
                //log.debug("GpsProvider", "Location changed: (" + lat + ", " + lon + ", " + alt + ", " + acc + ")");
                log.verboseDebug("GpsProvider", "Received geolocation: " + 'Latitude: ' + lat + ', ' + 'Longitude: ' + lon + ', ' + 'Altitude: ' + alt + ', ' + 'Accuracy: ' + acc + ', ' + 'Altitude Accuracy: ' + altitudeAccuracy + ', ' + 'Heading: ' + heading + ', ' + 'Speed: ' + speed + ', ' + 'Timestamp: ' + timestamp + '');

                // Set a global position so others parts of app quickly can access last known pos any time
                this.lastPos = new System.Models.Position(lat, lon, alt, acc);
                var lp = this.lastPos;

                this._this.trigger('PosChanged', [lp]);
            };
            return GpsProvider;
        })();
        Providers.GpsProvider = GpsProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));

var gpsProvider = new System.Providers.GpsProvider();
startup.addPostInit(function () {
    gpsProvider.PostInit();
});
//@ sourceMappingURL=GpsProvider.js.map
