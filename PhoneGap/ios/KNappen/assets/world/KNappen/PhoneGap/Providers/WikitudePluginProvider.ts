/// <reference path="../_References.ts" />
module PhoneGap.Providers {
    declare var cordova;

    export class WikitudeSendInterop {
        //constructor(private wikitudePluginProvider: PhoneGap.Providers.WikitudePluginProvider) { }

        public sendGeoLocationUpdate(position) {
            this.callJavaScript("phoneGapProvider.callbackGeoLocationUpdate("
                + '' + position.coords.latitude + ', '
                + '' + position.coords.longitude + ', '
                + '' + position.coords.altitude + ', '
                + '' + position.coords.accuracy + ', '
                + '' + position.coords.altitudeAccuracy + ', '
                + '"' + position.coords.heading + '", '
                + '' + position.coords.speed + ', '
                + '"' + new Date(position.timestamp) + '"'
                + ");");
        }

        public sendBackButton() {
            this.callJavaScript("phoneGapProvider.callbackBackButton();");
        }

        public sendMenuButton() {
            this.callJavaScript("phoneGapProvider.callbackMenuButton();");
        }

        public callJavaScript(script: string) {
            log.debug("WikitudeSendInterop", "PhoneGap executing JS on Wikitude: " + script);
            cordova.exec(
                function () {
                    log.debug("WikitudeSendInterop", "JS execution success: " + script);
                },
                function () {
                    log.error("WikitudeSendInterop", "JS execution failed: " + script);
                }, "WikitudePlugin", "callJavascript", [script]);
        }

    }

    export class WikitudePluginProvider {
        public supportedDevice: bool = false;

        public sendInterop: PhoneGap.Providers.WikitudeSendInterop = new PhoneGap.Providers.WikitudeSendInterop();

        public onDeviceSupported = new System.Utils.Event("onWikitudeDeviceSupported");
        public onDeviceNotSupported = new System.Utils.Event("onWikitudeDeviceNotSupported");
        public onARchitectWorldLaunched = new System.Utils.Event("onWikitudeARchitectWorldLaunched");
        public onARchitectWorldFailedLaunching = new System.Utils.Event("onWikitudeARchitectWorldFailedLaunching");
        public onUrlInvoke = new System.Utils.Event("onUrlInvoke");

        constructor() {

        }

        public Startup() {

            this.checkCompatibility();
            this.bindEvents();
        }

        private bindEvents() {
            var _this = this;
            cordova.exec(
                function (url: string) {
                    log.info("WikitudePluginProvider", "onUrlInvoke: " + url);
                    _this.onUrlInvoke.trigger(url);
                },
                function (error) {
                    log.info("WikitudePluginProvider", "onUrlInvoke: Error: " + error);
                },
                "WikitudePlugin", "onUrlInvoke", [""]);
        }


        private checkCompatibility() {
            var _this = this;
            try {
                cordova.exec(
                    function () {
                        log.info("WikitudePluginProvider", "checkWikitudeCompatibility: Device is supported.");
                        _this.supportedDevice = true;
                        _this.onDeviceSupported.trigger();
                    },
                    function () {
                        log.info("WikitudePluginProvider", "checkWikitudeCompatibility: Device is not supported.");
                        _this.supportedDevice = false;
                        _this.onDeviceNotSupported.trigger();
                    },
                    "WikitudePlugin", "isDeviceSupported", [phoneGapInterop.config.wikitudeARMode]);
            } catch (exception) {
                log.debug("WikitudePluginProvider", "checkWikitudeCompatibility: Exception: " + exception);
            }
        }

        public loadARchitectWorld(worldPath: string) {
            var _this = this;
            log.info("WikitudePluginProvider", "Loading Wikitude AR world: " + worldPath);

            //	the 'open' function of the Wikitude Plugin requires a option dictionary with two keys:
            //	@param {Object} options (required)
            //	@param {String} options.sdkKey License key for the Wikitude SDK
            //	@param {String} options.filePath The path to a local ARchitect world or to a ARchitect world on a server or your dropbox

            cordova.exec(
                function () {
                    log.debug("WikitudePluginProvider", "World launched: " + worldPath);
                    _this.onARchitectWorldLaunched.trigger();
                }, function (error) {
                    log.error("WikitudePluginProvider", "Failed to launch world \"" + worldPath + "\": " + error);
                    _this.onARchitectWorldFailedLaunching.trigger(error);
                },
                "WikitudePlugin", "open", [phoneGapInterop.config.wikitudeSDKKey, worldPath]);

        }

    }
}