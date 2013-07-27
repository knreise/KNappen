var PhoneGap;
(function (PhoneGap) {
    /// <reference path="../_References.ts" />
    (function (InteropProviders) {
        var ButtonProvider = (function () {
            function ButtonProvider() {
            }
            ButtonProvider.prototype.PreInit = function () {
                var _this = this;
                document.addEventListener("backbutton", function () {
                    _this.onBackButton;
                }, false);
                document.addEventListener("menubutton", function () {
                    _this.onMenuButton;
                }, false);
            };

            ButtonProvider.prototype.onBackButton = function () {
                log.info("PhoneGapButtonProvider", "Back button pressed, forwarding through interop.");
                phoneGapInterop.wikitudePluginProvider.sendInterop.sendBackButton();
            };
            ButtonProvider.prototype.onMenuButton = function () {
                log.info("PhoneGapButtonProvider", "Menu button pressed, forwarding through interop.");
                phoneGapInterop.wikitudePluginProvider.sendInterop.sendMenuButton();
            };
            return ButtonProvider;
        })();
        InteropProviders.ButtonProvider = ButtonProvider;
    })(PhoneGap.InteropProviders || (PhoneGap.InteropProviders = {}));
    var InteropProviders = PhoneGap.InteropProviders;
})(PhoneGap || (PhoneGap = {}));
var buttonProvider = new PhoneGap.InteropProviders.ButtonProvider();
startup.addPreInit(function () {
    buttonProvider.PreInit();
}, "ButtonProvider");
//@ sourceMappingURL=ButtonProvider.js.map
