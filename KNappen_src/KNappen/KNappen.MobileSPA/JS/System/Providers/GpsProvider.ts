/// <reference path="../Models/Position.ts" />
/// <reference path="../Diagnostics/Log.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {

    declare var AR;
    declare var config: System.ConfigBase;
    export class GpsProvider {

        /** 
            Last position fetched from the user or the default settings
            @member System.Providers.GpsProvider#lastPos
            @public
            @type {System.Models.Position}
        */
        public lastPos: System.Models.Position;

        private PositionChangedHandlers: { (event: JQueryEventObject, pos: System.Models.Position): void; }[];

        private posEvent: JQuery;

        /** 
            Determines if browser supports GPS coordinates
            @class System.Providers.GpsProvider
            @classdesc Manages GPS
        */
        constructor() {
            this.posEvent = $(this);
        }

        public PostInit() {
            var _this = this;
            if (!compatibilityInfo.hasAR) {
                if (navigator.geolocation) {
                    log.debug("GpsProvider", "Runtime environment supports GPS, will use.");
                    this.readBrowserGpsPos(this);
                    setInterval(() => { this.readBrowserGpsPos(this); }, 10000);
                } else {
                    log.debug("GpsProvider", "Runtime environment doesn't support GPS.");
                }
            }

            setInterval(function () {
                try {
                    if (_this.lastPos)
                        _this.posEvent.trigger('PosChanged', [_this.lastPos]);
                } catch (exception) {
                    log.error("GpsProvider", "Exception repeating position: " + exception);
                }

            }, config.locationUpdateRateMs);
        }

        /** 
            Hook up callback to GPS position changed event.
            @method System.Providers.GpsProvider#addPositionChangedHandler
            @param posChangedCallback A function with signature "function(event: JQueryEventObject, pos: System.Models.Position) {}" (just "function (event, pos) {}" in pure JS).
            @public    
        */
        public addPositionChangedHandler(posChangedCallback: { (event: JQueryEventObject, pos: System.Models.Position): void; }) {
            this.posEvent.on('PosChanged', posChangedCallback);
        }


        private readBrowserGpsPos(_this: GpsProvider) {
            //log.debug("GpsSystem", "Reading browser pos...");
            // We are reading browser GPS coordinates at an interval to feed our update method
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var lat: number = position.coords.latitude;
                    var lon: number = position.coords.longitude;
                    var alt: number = position.coords.altitude;
                    var acc: number = position.coords.accuracy;

                    //log.debug("GpsSystem", "New browser based GPS pos found: (" + lat + ", " + lon + ", " + alt + ", " + acc + ")");

                    _this.setPos(lat, lon, alt, acc);
                }, function () {
                    log.debug("GpsProvider", "Error getting GPS position from browser.");
                }, { enableHighAccuracy: true, timeout: 60 * 1000, maximumAge: 60 * 1000 });


        }
        /**
            Send a new GPS position to this module. Will trigger PositionChanged event.
            @method System.Providers.GpsProvider#setPos
            @param {number} lat Latitude.
            @param {number} lon Longditude.
            @param {number} alt Altitude.
          * @param {number} acc Position accuracy
          * @param {number} altitudeAccuracy Altitude accuracy
          * @param {number} heading Heading
          * @param {number} speed Speed
          * @param {number} timestamp Timestamp of pos
            @public
          */
        public setPos(lat: number, lon: number, alt?: number, acc?: number, altitudeAccuracy?: number, heading?: number, speed?: number, timestamp?: number) {
            // We have received an update of GPS pos
            //log.debug("GpsProvider", "Location changed: (" + lat + ", " + lon + ", " + alt + ", " + acc + ")");
            log.verboseDebug("GpsProvider", "Received geolocation: "
                + 'Latitude: ' + lat + ', '
                + 'Longitude: ' + lon + ', '
                + 'Altitude: ' + alt + ', '
                + 'Accuracy: ' + acc + ', '
                + 'Altitude Accuracy: ' + altitudeAccuracy + ', '
                + 'Heading: ' + heading + ', '
                + 'Speed: ' + speed + ', '
                + 'Timestamp: ' + timestamp + '');
            // Set a global position so others parts of app quickly can access last known pos any time
            this.lastPos = new System.Models.Position(lat, lon, alt, acc);
            var lp = this.lastPos;

            this.posEvent.trigger('PosChanged', [lp]);
        }
    }

}

var gpsProvider = new System.Providers.GpsProvider();
startup.addPostInit(function () { gpsProvider.PostInit(); });