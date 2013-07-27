/// <reference path="_References.ts" />
module PhoneGap {
    declare var WikitudePlugin;

    export class AppLoader {


        public PostInit() {
            var _this = this;
            phoneGapInterop.wikitudePluginProvider.onARchitectWorldFailedLaunching.addHandler(
                function (error) {
                    log.error("AppLoader", "Failed to load Wikitude ARchitect world, falling back to PhoneGap.");
                    _this.loadPhoneGapWorld();    
                });

            // before we actually call load, we check again if the device is able to open the world
            if (phoneGapInterop.wikitudePluginProvider.supportedDevice)
            {
                log.debug("AppLoader", "Wikitude reports device is compatible, using Wikitude ARchitect world.");
                _this.loadWikitudeWorld();
            } else {
                log.error("AppLoader", "Wikitude reports device is not compatible, using PhoneGap.");
                _this.loadPhoneGapWorld();
            }
        }

        private loadWikitudeWorld() {
            log.debug("AppLoader", "Loading Wikitude world: " + phoneGapInterop.config.wikitudeARWorldPath);
            phoneGapInterop.wikitudePluginProvider.loadARchitectWorld(phoneGapInterop.config.wikitudeARWorldPath);
        }

        private loadPhoneGapWorld() {
            var path: any = phoneGapInterop.config.phoneGapWorldPath;
            log.debug("AppLoader", "Loading PhoneGap page: " + path);
            window.location = path;
        }

    }
}
var appLoader = new PhoneGap.AppLoader();
startup.addPreInit(function () { appLoader.PostInit(); }, "AppLoader");