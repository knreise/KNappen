/// <reference path="Diagnostics/Log.ts" />
/// <reference path="Utils/CompatibilityInfo.ts" />
/**
System root
@namespace
*/
var System;
(function (System) {
    /**
    System related config values. Base config used by App.Config.
    @class System.ConfigBase
    */
    var ConfigBase = (function () {
        /**
        * BaseConfig
        * @class System.ConfigBase
        * @classdesc Contains base config (available to System namespace). Inherited by App.Config.
        */
        function ConfigBase() {
            /**
            Log level
            @type System.Diagnostics.LogTypeEnum.Debug
            */
            this.logLevel = System.Diagnostics.LogTypeEnum.VerboseDebug;
            /**
            Short name of application
            @type string
            */
            this.appName = "";
            /**
            Full name of application.
            @type string
            */
            this.appFullName = "";
            /**
            Google Analytics key. Used by {System.Diagnostics.GoogleAnalytics}.
            @type string
            */
            this.googleAnalyticsKey = "UA-42135626-1";
            this.mapBingAPIKey = "XXX";
            this.wikitudeAddPoiDelayMs = 500;
            this.openLayersMapUrl = {};
            this.httpDownloadMaxSimultaneousDownloads = 10;
            this.mapMinZoomLevel = 5;
            this.mapMaxZoomLevel = 18;
            this.mapCacheTileLimit = {};
            this.mapCacheLevelDetail = {};
            this.mapCacheMapType = "WMS:std0:norges_grunnkart";
            this.mapUseCache = true;
            this.TemplateProviderFolder = "Templates/";
            this.maxViewControllerBackHistory = 2;
            this.TemplateProviderFolder = this.fixLocalFileRef(this.TemplateProviderFolder);
            log.setLogLevel(this.logLevel);

            this.openLayersMapUrl["std0"] = "http://opencache.statkart.no/gatekeeper/gk/gk.open?SERVICE=WMS&";

            //this.openLayersMapUrl["std0"] = "http://knappen.konge.net/KNappenService.Prod/WebProxy.aspx?url=http%3A%2F%2Fopencache.statkart.no%2Fgatekeeper%2Fgk%2Fgk.open%3FSERVICE%3DWMS%26";
            //this.openLayersMapUrl["std0"] = "http://localhost:44000/WebProxy.aspx?url=http%3A%2F%2Fopencache.statkart.no%2Fgatekeeper%2Fgk%2Fgk.open%3FSERVICE%3DWMS%26";
            //this.openLayersMapUrl["nib0"] = "http://gatekeeper2.geonorge.no/BaatGatekeeper/gk/gk.nibcache?SERVICE=WMS&VERSION=1.1.1&GKT=1E9156534710F9F931B5EEC69FF377B9F6BC6A323696A5EEDFFC660CE39D323580D78D097EF1DB60446FA6981469D4101AC9B95040AF2D3AAB579AAE6F8C5E79";
            this.openLayersMapUrl["nib0"] = "http://wms.geonorge.no/skwms1/wms.kartdata_nib/TI_BK3GBKL3";

            this.mapCacheTileLimit["standard"] = 100;
            this.mapCacheTileLimit["precache"] = 100;

            //this.mapCacheTileLimit["routes"] = 1000;
            //this.mapCacheLevelDetail[16] = new MapCacheLevelItem(3);
            //this.mapCacheLevelDetail[15] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[14] = new MapCacheLevelItem(3);
        }
        ConfigBase.prototype.fixLocalFileRef = function (file) {
            if (compatibilityInfo.isPhoneGap && compatibilityInfo.isAndroid) {
                return "file:///" + ("android_asset/world/KNappen/" + file).replace(/\/\//, "/");
            } else {
                return file;
            }
        };
        return ConfigBase;
    })();
    System.ConfigBase = ConfigBase;

    var MapCacheLevelItem = (function () {
        function MapCacheLevelItem(surroundingTiles) {
            this.surroundingTiles = surroundingTiles;
        }
        return MapCacheLevelItem;
    })();
    System.MapCacheLevelItem = MapCacheLevelItem;
})(System || (System = {}));
//@ sourceMappingURL=ConfigBase.js.map
