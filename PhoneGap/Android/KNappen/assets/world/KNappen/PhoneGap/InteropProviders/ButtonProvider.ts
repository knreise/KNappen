/// <reference path="../_References.ts" />

module PhoneGap.InteropProviders {
    export class ButtonProvider {

        public PreInit() {
            var _this = this;
            document.addEventListener("backbutton", function () { _this.onBackButton }, false);
            document.addEventListener("menubutton", function() { _this.onMenuButton}, false);
        }

        private onBackButton() {
            log.info("PhoneGapButtonProvider", "Back button pressed, forwarding through interop.");
            phoneGapInterop.wikitudePluginProvider.sendInterop.sendBackButton();
        }
        private onMenuButton() {
            log.info("PhoneGapButtonProvider", "Menu button pressed, forwarding through interop.");
            phoneGapInterop.wikitudePluginProvider.sendInterop.sendMenuButton();
        }

    }
}
var buttonProvider = new PhoneGap.InteropProviders.ButtonProvider();
startup.addPreInit(function () { buttonProvider.PreInit(); }, "ButtonProvider");