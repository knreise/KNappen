var PhoneGap;
(function (PhoneGap) {
    /// <reference path="../_References.ts" />
    (function (Providers) {
        var GeoLocationProvider = (function () {
            function GeoLocationProvider() {
                this.onLocationUpdate = new System.Utils.Event("onLocationUpdate");
                this.onLocationUpdateError = new System.Utils.Event("onLocationUpdateError");
            }
            GeoLocationProvider.prototype.PostInit = function () {
                var _this = this;
                navigator.geolocation.watchPosition(function (position) {
                    log.verboseDebug("", "Received geolocation: " + 'Latitude: ' + position.coords.latitude + ', ' + 'Longitude: ' + position.coords.longitude + ', ' + 'Altitude: ' + position.coords.altitude + ', ' + 'Accuracy: ' + position.coords.accuracy + ', ' + 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + ', ' + 'Heading: ' + position.coords.heading + ', ' + 'Speed: ' + position.coords.speed + ', ' + 'Timestamp: ' + new Date(position.timestamp) + '');
                    _this.onLocationUpdate.trigger(position);

                    phoneGapInterop.wikitudePluginProvider.sendInterop.sendGeoLocationUpdate(position);
                }, function (error) {
                    log.error("GeoLocationProvider", "Error getting geolocation: code: " + error.code + ", message: " + error.message);
                    _this.onLocationUpdateError.trigger(error);
                }, { frequency: phoneGapInterop.config.locationUpdateRateMs });
            };
            return GeoLocationProvider;
        })();
        Providers.GeoLocationProvider = GeoLocationProvider;
    })(PhoneGap.Providers || (PhoneGap.Providers = {}));
    var Providers = PhoneGap.Providers;
})(PhoneGap || (PhoneGap = {}));
var geoLocationProvider = new PhoneGap.Providers.GeoLocationProvider();
startup.addPostInit(function () {
    geoLocationProvider.PostInit();
}, "GeoLocationProvider");
//@ sourceMappingURL=GeoLocationProvider.js.map
