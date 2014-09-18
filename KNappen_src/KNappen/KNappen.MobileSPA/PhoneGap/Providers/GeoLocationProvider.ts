/// <reference path="../_References.ts" />

module PhoneGap.Providers {
    export class GeoLocationProvider {
        public lastKnownPosition: any = null;

        public PostInit() {
            var _this = this;

            log.debug("GeoLocationProvider", "PostInit: watchPosition: " + compatibilityInfo.isMobile);

            if (compatibilityInfo.isMobile) {
                navigator.geolocation.watchPosition(
                    function (position) {
                        log.verboseDebug("GeoLocationProvider", "Received geolocation: "
                            + 'Latitude: ' + position.coords.latitude + ', '
                            + 'Longitude: ' + position.coords.longitude + ', '
                            + 'Altitude: ' + position.coords.altitude + ', '
                            + 'Accuracy: ' + position.coords.accuracy + ', '
                            + 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + ', '
                            + 'Heading: ' + position.coords.heading + ', '
                            + 'Speed: ' + position.coords.speed + ', '
                            + 'Timestamp: ' + new Date(position.timestamp) + '');

                        _this.lastKnownPosition = position;
                        try {
                            if (_this.lastKnownPosition)
                                _this.UpdateGeoLocation(position);

                        } catch (exception) {
                            log.error("GeoLocationProvider", "Exception sending position: " + exception);
                        }
                    },
                    function (error: GeolocationError) {
                        log.error("GeoLocationProvider", "Error getting geolocation: code: " + error.code + ", message: " + error.message);
                    },
                    {
                        frequency: phoneGapInterop.config.locationUpdateRateMs,
                        maximumAge: 60000,
                        timeout: 5000,
                        enableHighAccuracy: true
                    });
            }
        }

        private UpdateGeoLocation(position: Position): void {
            phoneGapProvider.callbackGeoLocationUpdate(
                position.coords.latitude,
                position.coords.longitude,
                position.coords.altitude,
                position.coords.accuracy,
                position.coords.altitudeAccuracy,
                position.coords.heading,
                position.coords.speed,
                position.timestamp);
        }

    }
}
var geoLocationProvider = new PhoneGap.Providers.GeoLocationProvider();
startup.addPostInit(function () { geoLocationProvider.PostInit(); }, "GeoLocationProvider");