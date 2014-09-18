/// <reference path="../_References.ts" />

module PhoneGap.InteropProviders {
    export class ButtonProvider {

        public load() {
            var _this = this;
            document.addEventListener("backbutton", _this.onBackButton, false);
            document.addEventListener("menubutton", _this.onMenuButton, false);

            startup.finishedLoad("ButtonProvider");
        }
        
        private onBackButton() {
            log.info("PhoneGapButtonProvider", "Back button pressed.");
            phoneGapProvider.callbackBackButton();
        }

        private onMenuButton() {
            log.info("PhoneGapButtonProvider", "Menu button pressed.");
            phoneGapProvider.callbackMenuButton();
        }
    }
}
var buttonProvider = new PhoneGap.InteropProviders.ButtonProvider();
startup.addLoad(function () { buttonProvider.load(); }, "ButtonProvider");