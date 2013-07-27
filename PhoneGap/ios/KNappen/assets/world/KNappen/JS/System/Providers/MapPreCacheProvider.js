var System;
(function (System) {
    /// <reference path="../_References.ts" />
    (function (Providers) {
        var MapPreCacheQueueItem = (function () {
            function MapPreCacheQueueItem(mapProvider, pos, zoomLevel, buffer) {
                this.mapProvider = mapProvider;
                this.pos = pos;
                this.zoomLevel = zoomLevel;
                this.buffer = buffer;
            }
            return MapPreCacheQueueItem;
        })();
        Providers.MapPreCacheQueueItem = MapPreCacheQueueItem;

        var MapPreCacheProvider = (function () {
            function MapPreCacheProvider() {
                this.preCacheQueue = [];
                this.runningPreCaches = 0;
                this.mapProvider = null;
                this.mapLayer = null;
                this.isProcessing = false;
            }
            MapPreCacheProvider.prototype.Init = function () {
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
            };

            MapPreCacheProvider.prototype.processPreCacheQueue = function () {
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
            };

            MapPreCacheProvider.prototype.addPreCacheLayer = function (buffer) {
                if (typeof buffer === "undefined") { buffer = 0; }
                log.debug("MaPPreCacheProvider", "Setting up cache layer.");

                // Set up layer
                var s = new OpenLayers.Strategy.Fixed();
                s.preload = true;
                this.mapLayer = this.mapProvider.createLayer(config.mapCacheMapType, [s], buffer);
                this.mapLayer.setVisibility(false);
                this.mapProvider.map.addLayer(this.mapLayer);
                this.mapProvider.map.setLayerIndex(this.mapLayer, 10);
            };

            MapPreCacheProvider.prototype.removePreCacheLayer = function () {
                log.debug("MaPPreCacheProvider", "Disposing cache layer.");
                this.mapProvider.map.removeLayer(this.mapLayer);

                //this.mapLayer.dispose();
                this.mapLayer = null;
            };

            MapPreCacheProvider.prototype.cachePos = function (pos) {
                var _this = this;

                if (typeof pos === "function")
                    pos = (pos)();

                var posStr = pos.lat() + ", " + pos.lon();
                log.debug("MapPreCacheProvider", "Added " + posStr + " to precache queue.");

                //for (var z: number = config.mapMinZoomLevel; z <= config.mapMaxZoomLevel; z++) {
                $.each(config.mapCacheLevelDetail, function (k, v) {
                    _this.isProcessing = true;
                    var mpc = new System.Providers.MapPreCacheQueueItem(_this.mapProvider, pos, k, v.surroundingTiles);
                    _this.preCacheQueue.push(mpc);
                });
            };

            MapPreCacheProvider.prototype.doCachePos = function (item) {
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
            };
            return MapPreCacheProvider;
        })();
        Providers.MapPreCacheProvider = MapPreCacheProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var mapPreCacheProvider = new System.Providers.MapPreCacheProvider();
startup.addInit(function () {
    mapPreCacheProvider.Init();
});
//@ sourceMappingURL=MapPreCacheProvider.js.map
