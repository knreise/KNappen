/// <reference path="../_References.ts" />

module PhoneGap.Providers {
    export class GeoLocationProvider {
        public onLocationUpdate = new System.Utils.Event("onLocationUpdate");
        public onLocationUpdateError = new System.Utils.Event("onLocationUpdateError");


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
                    _this.onLocationUpdate.trigger(position);

                    phoneGapInterop.wikitudePluginProvider.sendInterop.sendGeoLocationUpdate(position);
                },
                function (error: GeolocationError) {
                    log.error("GeoLocationProvider", "Error getting geolocation: code: " + error.code + ", message: " + error.message);
                    _this.onLocationUpdateError.trigger(error);
                },
                { frequency: phoneGapInterop.config.locationUpdateRateMs });
        }
    }
}
var geoLocationProvider = new PhoneGap.Providers.GeoLocationProvider();
startup.addPostInit(function () { geoLocationProvider.PostInit(); }, "GeoLocationProvider");