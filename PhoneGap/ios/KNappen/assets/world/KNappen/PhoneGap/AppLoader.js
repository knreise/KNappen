/// <reference path="_References.ts" />
var PhoneGap;
(function (PhoneGap) {
    var AppLoader = (function () {
        function AppLoader() {
        }
        AppLoader.prototype.PostInit = function () {
            var _this = this;
            phoneGapInterop.wikitudePluginProvider.onARchitectWorldFailedLaunching.addHandler(function (error) {
                log.error("AppLoader", "Failed to load Wikitude ARchitect world, falling back to PhoneGap.");
                _this.loadPhoneGapWorld();
            });

            if (phoneGapInterop.wikitudePluginProvider.supportedDevice) {
                log.debug("AppLoader", "Wikitude reports device is compatible, using Wikitude ARchitect world.");
                _this.loadWikitudeWorld();
            } else {
                log.error("AppLoader", "Wikitude reports device is not compatible, using PhoneGap.");
                _this.loadPhoneGapWorld();
            }
        };

        AppLoader.prototype.loadWikitudeWorld = function () {
            log.debug("AppLoader", "Loading Wikitude world: " + phoneGapInterop.config.wikitudeARWorldPath);
            phoneGapInterop.wikitudePluginProvider.loadARchitectWorld(phoneGapInterop.config.wikitudeARWorldPath);
        };

        AppLoader.prototype.loadPhoneGapWorld = function () {
            var path = phoneGapInterop.config.phoneGapWorldPath;
            log.debug("AppLoader", "Loading PhoneGap page: " + path);
            window.location = path;
        };
        return AppLoader;
    })();
    PhoneGap.AppLoader = AppLoader;
})(PhoneGap || (PhoneGap = {}));
var appLoader = new PhoneGap.AppLoader();
startup.addPreInit(function () {
    appLoader.PostInit();
}, "AppLoader");
//@ sourceMappingURL=AppLoader.js.map
