/// <reference path="_References.ts" />
module PhoneGap {
    declare var WikitudePlugin;

    export class AppLoader {
        private isLoaded = false;
        public Load() {
            var _this = this;
            phoneGapInterop.wikitudePluginProvider.onARchitectWorldFailedLaunching.addHandler(
                function (error) {
                    log.error("AppLoader", "Failed to load Wikitude ARchitect world, falling back to PhoneGap.");
                    _this.isLoaded = true;
                    _this.loadPhoneGapWorld();
                });
            phoneGapInterop.wikitudePluginProvider.onDeviceSupported.addHandler(
                function () {
                    log.error("AppLoader", "Device is supported, using Wikitude ARchitect world.");
                    _this.loadWikitudeWorld();
                });
            phoneGapInterop.wikitudePluginProvider.onDeviceSupported.addHandler(
                function () {
                    log.error("AppLoader", "Device is not supported, using PhoneGap.");

                    _this.loadWikitudeWorld();
                });
        }

        public PostInit() {
            var _this = this;


            setTimeout(function () {
                // before we actually call load, we check again if the device is able to open the world
                if (!this.isLoaded && phoneGapInterop.wikitudePluginProvider.supportedDevice)
                {
                    log.debug("AppLoader", "Wikitude reports device is compatible, using Wikitude ARchitect world.");
                    _this.loadWikitudeWorld();
                } else {
                    log.error("AppLoader", "Wikitude reports device is not compatible, using PhoneGap.");
                    _this.loadPhoneGapWorld();
                }
            }, 1000);

        }

        private loadWikitudeWorld() {
            this.isLoaded = true;
            log.debug("AppLoader", "Loading Wikitude world: " + phoneGapInterop.config.wikitudeARWorldPath);
            phoneGapInterop.wikitudePluginProvider.loadARchitectWorld(phoneGapInterop.config.wikitudeARWorldPath);
        }

        private loadPhoneGapWorld() {
            this.isLoaded = true;
            var path: any = phoneGapInterop.config.phoneGapWorldPath;
            log.debug("AppLoader", "Loading PhoneGap page: " + path);
            window.location = path;
        }

    }
}
var appLoader = new PhoneGap.AppLoader();
startup.addPreInit(function () { appLoader.PostInit(); }, "AppLoader");
startup.addLoad(function () { appLoader.Load(); }, "AppLoader");