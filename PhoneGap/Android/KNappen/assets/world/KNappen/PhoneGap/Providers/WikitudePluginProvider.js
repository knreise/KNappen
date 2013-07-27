var PhoneGap;
(function (PhoneGap) {
    /// <reference path="../_References.ts" />
    (function (Providers) {
        var WikitudeSendInterop = (function () {
            function WikitudeSendInterop() {
            }
            //constructor(private wikitudePluginProvider: PhoneGap.Providers.WikitudePluginProvider) { }
            WikitudeSendInterop.prototype.sendGeoLocationUpdate = function (position) {
                this.callJavaScript("phoneGapProvider.callbackGeoLocationUpdate(" + '' + position.coords.latitude + ', ' + '' + position.coords.longitude + ', ' + '' + position.coords.altitude + ', ' + '' + position.coords.accuracy + ', ' + '' + position.coords.altitudeAccuracy + ', ' + '"' + position.coords.heading + '", ' + '' + position.coords.speed + ', ' + '"' + new Date(position.timestamp) + '"' + ");");
            };

            WikitudeSendInterop.prototype.sendBackButton = function () {
                this.callJavaScript("phoneGapProvider.callbackBackButton();");
            };

            WikitudeSendInterop.prototype.sendMenuButton = function () {
                this.callJavaScript("phoneGapProvider.callbackMenuButton();");
            };

            WikitudeSendInterop.prototype.callJavaScript = function (script) {
                log.debug("WikitudeSendInterop", "PhoneGap executing JS on Wikitude: " + script);
                cordova.exec(function () {
                    log.debug("WikitudeSendInterop", "JS execution success: " + script);
                }, function () {
                    log.error("WikitudeSendInterop", "JS execution failed: " + script);
                }, "WikitudePlugin", "callJavascript", [script]);
            };
            return WikitudeSendInterop;
        })();
        Providers.WikitudeSendInterop = WikitudeSendInterop;

        var WikitudePluginProvider = (function () {
            function WikitudePluginProvider() {
                this.supportedDevice = false;
                this.sendInterop = new PhoneGap.Providers.WikitudeSendInterop();
                this.onDeviceSupported = new System.Utils.Event("onWikitudeDeviceSupported");
                this.onDeviceNotSupported = new System.Utils.Event("onWikitudeDeviceNotSupported");
                this.onARchitectWorldLaunched = new System.Utils.Event("onWikitudeARchitectWorldLaunched");
                this.onARchitectWorldFailedLaunching = new System.Utils.Event("onWikitudeARchitectWorldFailedLaunching");
                this.onUrlInvoke = new System.Utils.Event("onUrlInvoke");
            }
            WikitudePluginProvider.prototype.Startup = function () {
                this.checkCompatibility();
                this.bindEvents();
            };

            WikitudePluginProvider.prototype.bindEvents = function () {
                var _this = this;
                cordova.exec(function (url) {
                    log.info("WikitudePluginProvider", "onUrlInvoke: " + url);
                    _this.onUrlInvoke.trigger(url);
                }, function (error) {
                    log.info("WikitudePluginProvider", "onUrlInvoke: Error: " + error);
                }, "WikitudePlugin", "onUrlInvoke", [""]);
            };

            WikitudePluginProvider.prototype.checkCompatibility = function () {
                var _this = this;
                try  {
                    cordova.exec(function () {
                        log.info("WikitudePluginProvider", "checkWikitudeCompatibility: Device is supported.");
                        _this.supportedDevice = true;
                        _this.onDeviceSupported.trigger();
                    }, function () {
                        log.info("WikitudePluginProvider", "checkWikitudeCompatibility: Device is not supported.");
                        _this.supportedDevice = false;
                        _this.onDeviceNotSupported.trigger();
                    }, "WikitudePlugin", "isDeviceSupported", [phoneGapInterop.config.wikitudeARMode]);
                } catch (exception) {
                    log.debug("WikitudePluginProvider", "checkWikitudeCompatibility: Exception: " + exception);
                }
            };

            WikitudePluginProvider.prototype.loadARchitectWorld = function (worldPath) {
                var _this = this;
                log.info("WikitudePluginProvider", "Loading Wikitude AR world: " + worldPath);

                //	the 'open' function of the Wikitude Plugin requires a option dictionary with two keys:
                //	@param {Object} options (required)
                //	@param {String} options.sdkKey License key for the Wikitude SDK
                //	@param {String} options.filePath The path to a local ARchitect world or to a ARchitect world on a server or your dropbox
                cordova.exec(function () {
                    log.debug("WikitudePluginProvider", "World launched: " + worldPath);
                    _this.onARchitectWorldLaunched.trigger();
                }, function (error) {
                    log.error("WikitudePluginProvider", "Failed to launch world \"" + worldPath + "\": " + error);
                    _this.onARchitectWorldFailedLaunching.trigger(error);
                }, "WikitudePlugin", "open", [phoneGapInterop.config.wikitudeSDKKey, worldPath]);
            };
            return WikitudePluginProvider;
        })();
        Providers.WikitudePluginProvider = WikitudePluginProvider;
    })(PhoneGap.Providers || (PhoneGap.Providers = {}));
    var Providers = PhoneGap.Providers;
})(PhoneGap || (PhoneGap = {}));
//@ sourceMappingURL=WikitudePluginProvider.js.map
