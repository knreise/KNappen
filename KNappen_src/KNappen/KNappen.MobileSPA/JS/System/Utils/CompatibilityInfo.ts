/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {
    declare var AR;
    export class CompatibilityInfo {

        constructor() {
            this.checkAR();
            this.checkMobile();
            this.checkPhoneGap();
        }

        public hasAR: bool = false;
        private checkAR() {
            try {
                if (AR)
                    this.hasAR = true;
            } catch (exception) { }
            log.debug("CompatibilityInfo", "hasAR: " + this.hasAR);
        }

        public isiPhone: bool = false;
        public isAndroid: bool = false;
        public isMobile: bool = false;
        private checkMobile() {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
                this.isMobile = true;
            if (/Android|webOS/i.test(navigator.userAgent))
                this.isAndroid = true;
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent))
                this.isiPhone = true;

            log.debug("CompatibilityInfo", "isMobile: " + this.isMobile);
            log.debug("CompatibilityInfo", "isAndroid: " + this.isAndroid);
            log.debug("CompatibilityInfo", "isiPhone: " + this.isiPhone);
        }

        public isPhoneGap: bool = false;
        private checkPhoneGap() {
            // TODO: Should have a better check
            this.isPhoneGap = this.hasAR;
            log.debug("CompatibilityInfo", "isPhoneGap: " + this.isPhoneGap);
        }

    }
}
var compatibilityInfo = new System.Utils.CompatibilityInfo();
//startup.addPreInit(function () { compatibilityInfo.PreInit(); }, "CompatibilityInfo");