var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    Provider modules
    @namespace System.Utils
    */
    (function (Utils) {
        var CompatibilityInfo = (function () {
            function CompatibilityInfo() {
                this.hasAR = false;
                this.isiPhone = false;
                this.isAndroid = false;
                this.isMobile = false;
                this.isPhoneGap = false;
                this.checkAR();
                this.checkMobile();
                this.checkPhoneGap();
            }
            CompatibilityInfo.prototype.checkAR = function () {
                try  {
                    if (AR)
                        this.hasAR = true;
                } catch (exception) {
                }
                log.debug("CompatibilityInfo", "hasAR: " + this.hasAR);
            };

            CompatibilityInfo.prototype.checkMobile = function () {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
                    this.isMobile = true;
                if (/Android|webOS/i.test(navigator.userAgent))
                    this.isAndroid = true;
                if (/iPhone|iPad|iPod/i.test(navigator.userAgent))
                    this.isiPhone = true;

                log.debug("CompatibilityInfo", "isMobile: " + this.isMobile);
                log.debug("CompatibilityInfo", "isAndroid: " + this.isAndroid);
                log.debug("CompatibilityInfo", "isiPhone: " + this.isiPhone);
            };

            CompatibilityInfo.prototype.checkPhoneGap = function () {
                // TODO: Should have a better check
                this.isPhoneGap = this.hasAR;
                log.debug("CompatibilityInfo", "isPhoneGap: " + this.isPhoneGap);
            };
            return CompatibilityInfo;
        })();
        Utils.CompatibilityInfo = CompatibilityInfo;
    })(System.Utils || (System.Utils = {}));
    var Utils = System.Utils;
})(System || (System = {}));
var compatibilityInfo = new System.Utils.CompatibilityInfo();
//@ sourceMappingURL=CompatibilityInfo.js.map
