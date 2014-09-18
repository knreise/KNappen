/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/

module System.Providers {
    declare var config;
    declare var OpenLayers;

    export class MapPreCacheWork {
        /**
          * MapPreCacheWork
          * @class System.Providers.MapPreCacheQueueItem
          * @classdesc Queue item for map precaching
          */
        constructor(public mapProvider: System.Providers.MapProvider,
            public pos: System.Models.Position,
            public zoomLevel: number,
            public buffer: number,
            public cacheFailed: { (): void; }) {
        }
    }

    export class MapPreCacheProvider {

        private cacheFinishedCallback: (success: boolean) => void;
        private state: System.Utils.WorkQueueState;
        private workComplete: boolean = false;
        private runningPreCaches: boolean = false;
        private mapProvider: System.Providers.MapProvider = null;

        /**
          * MapPreCacheProvider
          * @class System.Providers.MapPreCacheProvider
          * @classdesc Map pre caching provider. Downloads and caches map segments.
          */
        constructor() {
        }

        public Init() {
            var _this = this;

            // Add map container to page
            $("body").append('<div id="preCacheMap" style="height: 256px; width: 256px; position: absolute; top: -1000px; left: -1000px;"></div>');
            
            // Set up new map provider
            this.mapProvider = new System.Providers.MapProvider();
            this.mapProvider.Init(true, "preCacheMap", null);
            
            // Add caching
            mapCacheProvider.addCacheToMap("precache", this.mapProvider.map);
        }

        /**
          * Queue map tiles for a position for precaching.
          * @method System.Providers.MapPreCacheProvider#cachePos
          * @param {System.Models.Position} cachePos Position to precache.
          * @param {object} cacheFinished Callback for when the caching is finished.
        */
        public cachePois(pois: System.Models.PointOfInterestBase[], cacheFinished: (success: boolean) => void): void {

            this.cacheFinishedCallback = cacheFinished;
            this.workComplete = false;
            this.state = new System.Utils.WorkQueueState();

            var queue = new Array<System.Utils.WorkQueueItem<MapPreCacheWork>>();
            var cacheFailed = () => this.state.aborted = true;

            for (var zoomLevel in config.mapCacheLevelDetail) {
                var levelItem = config.mapCacheLevelDetail[zoomLevel];
                for (var index in pois) {
                    var poi = pois[index];
                    var work = new MapPreCacheWork(this.mapProvider, poi.pos(), zoomLevel, levelItem.surroundingTiles, cacheFailed);
                    var item = new System.Utils.WorkQueueItem(work, (w) => this.doCachePos(w), (w) => this.runningPreCaches);
                    queue.push(item);
                }
            }

            System.Utils.WorkHelper.processWork(queue, this.state, (success: boolean) => this.workComplete = true);
        }

        private doCachePos(item: System.Providers.MapPreCacheWork) {
            var _this = this;

            var posStr = item.pos.lat() + ", " + item.pos.lon();
            log.debug("MapPreCacheProvider", "Precaching " + posStr + "");

            var mapLayer = this.addPreCacheLayer(item.buffer);
            mapLayer.clearGrid();
            mapLayer.cacheFailed = item.cacheFailed;


            eventProvider.mapCache.onCacheEnd.addOnceHandler((success: boolean) => this.doCachePosFinished(success));

            mapLayer.events.register("loadstart", mapLayer, function () {
                log.debug("MapPreCacheProvider", posStr + ": Starting precache");
            });

            //mapLayer.events.register("tileloaded", mapLayer, function () {
            //    log.debug("MapPreCacheProvider", posStr + ": Tile precached. " + this.numLoadingTiles + " left.");
            //});

            mapLayer.events.register("loadend", mapLayer, function () {
                log.debug("MapPreCacheProvider", posStr + ": Precache End. Grid:" + this.grid.length + "x" + this.grid[0].length);
                _this.removePreCacheLayer(mapLayer);
                _this.runningPreCaches = false;
            });

            item.mapProvider.setCenter(item.pos, item.zoomLevel);
            _this.runningPreCaches = true;
        }

        private doCachePosFinished(success: boolean): void {
            if (this.workComplete) {
                this.cacheFinishedCallback(success && !this.state.aborted);
            }
        }

        private addPreCacheLayer(buffer: number = 0) {
            log.debug("MapPreCacheProvider", "Setting up cache layer.");

            var strategy = new OpenLayers.Strategy.Fixed();
            strategy.preload = true;

            var mapLayer = this.mapProvider.createLayer(config.mapCacheMapType, [strategy], buffer);
            mapLayer.setVisibility(false);

            this.mapProvider.map.addLayer(mapLayer);
            this.mapProvider.map.setLayerIndex(mapLayer, 10);

            return mapLayer;
        }

        private removePreCacheLayer(mapLayer) {
            log.debug("MapPreCacheProvider", "Disposing cache layer.");
            this.mapProvider.map.removeLayer(mapLayer);
        }
    }
}
var mapPreCacheProvider = new System.Providers.MapPreCacheProvider();
startup.addInit(function () { mapPreCacheProvider.Init(); });