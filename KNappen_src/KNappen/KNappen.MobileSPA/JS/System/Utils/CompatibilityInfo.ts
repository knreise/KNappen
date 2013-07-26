/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {
    declare var AR;
    export class CompatibilityInfo {

        public PreInit() {
            this.checkAR();
            this.checkMobile();
        }

        public hasAR: bool = false;
        private checkAR() {
            try {
                if (AR)
                    this.hasAR = true;
            } catch (exception) { }
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
        }

    }
}
var compatibilityInfo = new System.Utils.CompatibilityInfo();
startup.addPreInit(function () { compatibilityInfo.PreInit(); }, "CompatibilityInfo");
