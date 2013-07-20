/**
    System root
    @namespace
*/
module System {
    /**
      System related config values. Base config used by App.Config.
      @class System.ConfigBase
      */
    export class ConfigBase {
        /**
          Enable debugging mode.
          @type bool
          */
        public debug: bool = true;
        /**
          Short name of application
          @type string 
          */
        public appName: string = "";
        /**
          Full name of application.
          @type string
          */
        public appFullName: string = "";
        /**
          Google Analytics key. Used by {System.Diagnostics.GoogleAnalytics}.
          @type string
          */
        public googleAnalyticsKey: string = "UA-42135626-1";

        public mapBingAPIKey: string = "XXX";

        public wikitudeAddPoiDelayMs: number = 500;

        public openLayersMapUrl: { [key: string]: string; } = {};

        public httpDownloadMaxSimultaneousDownloads: number = 10;

        public mapMinZoomLevel: number = 5;
        public mapMaxZoomLevel: number = 18;

        public mapCacheTileLimit: { [cacheType: string]: number; } = {};
        public mapCacheLevelDetail: { [level: number]: System.MapCacheLevelItem; } = {};
        public mapCacheMapType: string = "WMS:std0:norges_grunnkart"; 

        public mapUseCache = true;

        public TemplateProviderFolder: string = "Templates/";


        /**
         * BaseConfig
         * @class System.ConfigBase
         * @classdesc Contains base config (available to System namespace). Inherited by App.Config.
         */
        constructor() {            
            if (navigator.userAgent.match(/(Android)/)) {
                this.TemplateProviderFolder = "file:///android_asset/world/KNappen/" + this.TemplateProviderFolder;
            }

            //this.openLayersMapUrl["std0"] = "http://opencache.statkart.no/gatekeeper/gk/gk.open?SERVICE=WMS&";
            this.openLayersMapUrl["std0"] = "http://knappen.konge.net/KNappenService.Prod/WebProxy.aspx?url=http%3A%2F%2Fopencache.statkart.no%2Fgatekeeper%2Fgk%2Fgk.open%3FSERVICE%3DWMS%26";
            //this.openLayersMapUrl["std0"] = "http://localhost:44000/WebProxy.aspx?url=http%3A%2F%2Fopencache.statkart.no%2Fgatekeeper%2Fgk%2Fgk.open%3FSERVICE%3DWMS%26";
            //this.openLayersMapUrl["nib0"] = "http://gatekeeper2.geonorge.no/BaatGatekeeper/gk/gk.nibcache?SERVICE=WMS&VERSION=1.1.1&GKT=1E9156534710F9F931B5EEC69FF377B9F6BC6A323696A5EEDFFC660CE39D323580D78D097EF1DB60446FA6981469D4101AC9B95040AF2D3AAB579AAE6F8C5E79";
            this.openLayersMapUrl["nib0"] = "http://wms.geonorge.no/skwms1/wms.kartdata_nib/TI_BK3GBKL3";

            this.mapCacheTileLimit["standard"] = 100;
            this.mapCacheTileLimit["precache"] = 1000;
            //this.mapCacheTileLimit["routes"] = 1000;

            this.mapCacheLevelDetail[16] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[15] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[14] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[13] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[12] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[11] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[10] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[9] = new MapCacheLevelItem(3);
            this.mapCacheLevelDetail[8] = new MapCacheLevelItem(3);
        }

    }

    export class MapCacheLevelItem {
        constructor(public surroundingTiles: number) {

        }
    }

}
