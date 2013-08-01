/// <reference path="../_References.ts" />

module PhoneGap.Providers {
    export class GeoLocationProvider {
        public onLocationUpdate = new System.Utils.Event("onLocationUpdate");
        public onLocationUpdateError = new System.Utils.Event("onLocationUpdateError");
        public lastKnownPosition: any = null;

        public PostInit() {
            var _this = this;

            navigator.geolocation.watchPosition(
                function (position) {
                    log.verboseDebug("", "Received geolocation: "
                        + 'Latitude: ' + position.coords.latitude + ', '
                        + 'Longitude: ' + position.coords.longitude + ', '
                        + 'Altitude: ' + position.coords.altitude + ', '
                        + 'Accuracy: ' + position.coords.accuracy + ', '
                        + 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + ', '
                        + 'Heading: ' + position.coords.heading + ', '
                        + 'Speed: ' + position.coords.speed + ', '
                        + 'Timestamp: ' + new Date(position.timestamp) + '');

                    _this.lastKnownPosition = position;

                    // Set position in Wikitude
                    try {
                        phoneGapInterop.wikitudePluginProvider.setWikitudePosition(position);
                    } catch (exception) {
                        log.error("GeoLocationProvider", "Exception setting Wikitude position: " + exception);
                    }

                    try {
                        if (_this.lastKnownPosition)
                            phoneGapInterop.wikitudePluginProvider.sendInterop.sendGeoLocationUpdate(position);
                    } catch (exception) {
                        log.error("GeoLocationProvider", "Exception sending position to Wikitude (interop): " + exception);
                    }
                    
                    _this.onLocationUpdate.trigger(position);

                
                },
                function (error: GeolocationError) {
                    log.error("GeoLocationProvider", "Error getting geolocation: code: " + error.code + ", message: " + error.message);
                    _this.onLocationUpdateError.trigger(error);
                },
                {
                    frequency: phoneGapInterop.config.locationUpdateRateMs,
                    maximumAge: 60000,
                    timeout: 5000,
                    enableHighAccuracy: true
                });
        }
    }
}
var geoLocationProvider = new PhoneGap.Providers.GeoLocationProvider();
startup.addPostInit(function () { geoLocationProvider.PostInit(); }, "GeoLocationProvider");