/// <reference path="../_References.ts" />

module System.Providers {
    declare var config;
    declare var OpenLayers;

    export class MapPreCacheQueueItem {
        constructor(public mapProvider: System.Providers.MapProvider,
            public pos: System.Models.Position,
            public zoomLevel: number,
            public buffer: number) {
        }
    }

    export class MapPreCacheProvider {

        private preCacheQueue: System.Providers.MapPreCacheQueueItem[] = [];
        private runningPreCaches: number = 0;
        private mapProvider: System.Providers.MapProvider = null;
        private mapLayer: any = null;
        private isProcessing = false;

        public Init() {
            var _this = this;

            // Add map container to page
            $("body").append('<div id="preCacheMap" style="height: 256px; width: 256px; position: absolute; top: -1000; left: -1000;"></div>');
            
            // Set up new map provider
            this.mapProvider = new System.Providers.MapProvider();
            this.mapProvider.Init(true, "preCacheMap", null);
            //this.mapProvider.Init(true, "map", null);
            
            // Add caching
            mapCacheProvider.addCacheToMap("precache", this.mapProvider.map);

            setInterval(function () {
                _this.processPreCacheQueue();
            }, 500);
        }

        private processPreCacheQueue() {
            if (this.preCacheQueue.length == 0) {
                if (this.isProcessing) {
                    log.userPopup(translater.translate("PreCache"), translater.translate("Done precaching"));
                    this.isProcessing = false;
                }
                return;
            }

            if (this.runningPreCaches < 1) {

                var item = this.preCacheQueue.shift();
                this.doCachePos(item);
            }
        }

        private addPreCacheLayer(buffer: number = 0) {
            log.debug("MaPPreCacheProvider", "Setting up cache layer.");
            // Set up layer
            var s = new OpenLayers.Strategy.Fixed();
            s.preload = true;
            this.mapLayer = this.mapProvider.createLayer(config.mapCacheMapType, [s], buffer);
            this.mapLayer.setVisibility(false);
            this.mapProvider.map.addLayer(this.mapLayer);
            this.mapProvider.map.setLayerIndex(this.mapLayer, 10);
        }

        private removePreCacheLayer() {
            log.debug("MaPPreCacheProvider", "Disposing cache layer.");
            this.mapProvider.map.removeLayer(this.mapLayer);
            //this.mapLayer.dispose();
            this.mapLayer = null;
        }

        public cachePos(pos: System.Models.Position) {
            var _this = this;
            var posStr = pos.lat() + ", " + pos.lon();
            log.debug("MapPreCacheProvider", "Added " + posStr + " to precache queue.");
            //for (var z: number = config.mapMinZoomLevel; z <= config.mapMaxZoomLevel; z++) {
            $.each(config.mapCacheLevelDetail,
                function (k: number, v: System.MapCacheLevelItem) {
                    _this.isProcessing = true;
                    var mpc = new System.Providers.MapPreCacheQueueItem(_this.mapProvider, pos, k, v.surroundingTiles);
                    _this.preCacheQueue.push(mpc);
                });
        }


        private doCachePos(item: System.Providers.MapPreCacheQueueItem) {

            if (!this.mapLayer)
                this.addPreCacheLayer(item.buffer);

            var posStr = item.pos.lat() + ", " + item.pos.lon();
            log.debug("MapPreCacheProvider", "Precaching " + posStr + "");
            var _this = this;
            this.mapLayer.clearGrid();

            this.mapLayer.events.register("loadstart", this.mapLayer, function () {
                log.debug("MapPreCacheProvider", posStr + ": Starting precache");
            });

            this.mapLayer.events.register("tileloaded", this.mapLayer, function () {
                log.debug("MapPreCacheProvider", posStr + ": Tile precached. " + this.numLoadingTiles + " left.");
            });

            this.mapLayer.events.register("loadend", this.mapLayer, function () {
                log.debug("MapPreCacheProvider", posStr + ": Precache End. Grid:" + this.grid.length + "x" + this.grid[0].length);
                _this.removePreCacheLayer();
                _this.runningPreCaches--;
            });

            item.mapProvider.setCenter(item.pos, item.zoomLevel);
            this.runningPreCaches++;

        }

    }
}
var mapPreCacheProvider = new System.Providers.MapPreCacheProvider();
startup.addInit(function () { mapPreCacheProvider.Init(); });
