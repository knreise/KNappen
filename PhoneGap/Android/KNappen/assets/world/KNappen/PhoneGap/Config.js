var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="_References.ts" />
var PhoneGap;
(function (PhoneGap) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            _super.apply(this, arguments);
            this.wikitudeSDKKey = "XXX";
            this.locationUpdateRateMs = 5000;
            this.wikitudeARMode = "Geo";
            this.wikitudeARWorldPath = "assets/world/KNappen/Main.html";
            this.phoneGapWorldPath = "../world/KNappen/Main.html";
        }
        return Config;
    })(System.ConfigBase);
    PhoneGap.Config = Config;
})(PhoneGap || (PhoneGap = {}));
//@ sourceMappingURL=Config.js.map
