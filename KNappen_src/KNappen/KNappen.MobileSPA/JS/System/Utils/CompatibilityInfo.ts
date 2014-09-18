/// <reference path="../_References.ts" />
/**
    Provider modules
    @namespace System.Utils
*/
module System.Utils {

    export class CompatibilityInfo {

        /**
          * CompatibilityInfo
          * @class System.Utils.CompatibilityInfo
          * @classdesc Collects compatibility information about runtime environment.
          */
        constructor() {
            this.checkMobile();
        }

        public isiPhone: boolean = false;

        public isAndroid: boolean = false;

        public isMobile: boolean = false;

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
    }
}

var compatibilityInfo = new System.Utils.CompatibilityInfo();