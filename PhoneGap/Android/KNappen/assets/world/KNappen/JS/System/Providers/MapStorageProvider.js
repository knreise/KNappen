var System;
(function (System) {
    /// <reference path="../_References.ts" />
    (function (Providers) {
        var MapStorageProvider = (function () {
            function MapStorageProvider() {
                this.enabled = true;
            }
            MapStorageProvider.prototype.setEnabled = function (enabled) {
                log.debug("MapStorageProvider", "Setting enabled state to: " + enabled);
                this.enabled = enabled;
            };

            MapStorageProvider.prototype.get = function (cacheType, key) {
                if (!this.enabled)
                    return null;

                var value = null;

                if (cacheType === "standard")
                    value = storageProvider.get("map:standard:" + stringUtils.hash(key));

                if (value) {
                    log.debug("MapStorageProvider", "Getting tile from standard cache: " + key);
                } else {
                    value = storageProvider.get("map:precache:" + stringUtils.hash(key));
                    if (value)
                        log.debug("MapStorageProvider", "Getting tile from precache: " + key);
                }
                if (!value)
                    log.debug("MapStorageProvider", "Getting tile from cache failed: " + key);

                return value;
            };

            MapStorageProvider.prototype.set = function (cacheType, key, value) {
                if (!this.enabled)
                    return null;
                log.debug("MapStorageProvider", "Adding tile to cache: " + key);

                var fullKey = "map:" + cacheType + ":" + stringUtils.hash(key);
                storageProvider.set(fullKey, value);
                this.cleanHistory(cacheType);
            };

            MapStorageProvider.prototype.cleanHistory = function (cacheType) {
                // Get a list of tiles we want
                var startKey = "map:" + cacheType + ":";
                var sortedList = [];
                $.each(storageProvider.getAll(), function (k, v) {
                    if (stringUtils.startsWith(k, startKey) && !stringUtils.endsWith(k, ".meta")) {
                        sortedList.push({ key: k, value: v, meta: storageProvider.getMeta(k) });
                    }
                });

                // Sort by date
                sortedList.sort(function (a, b) {
                    return (a.meta.changed - b.meta.changed);
                });

                // Make sure missing definition in config doesn't lead to immediate deletion of cache
                var tileLimit = config.mapCacheTileLimit[cacheType];
                if (tileLimit < 1)
                    tileLimit = 10000;

                // Remove old tiles
                var amountToRemove = sortedList.length - tileLimit;
                if (amountToRemove > 0) {
                    for (var i = 0; i < amountToRemove; i++) {
                        log.debug("MapStorageProvider", "Removing cache overflow:" + sortedList[i].meta.changed + ": " + sortedList[i].key);
                        storageProvider.remove(sortedList[i].key);
                    }
                }
            };

            MapStorageProvider.prototype.clear = function (cacheType) {
                log.info("MapStorageProvider", "Clearing cache for type: " + cacheType);

                var startKey = "map:" + cacheType + ":";
                $.each(storageProvider.getAll(), function (k, v) {
                    if (stringUtils.startsWith(k, startKey) && !stringUtils.endsWith(k, ".meta")) {
                        storageProvider.remove(k);
                    }
                });
            };
            return MapStorageProvider;
        })();
        Providers.MapStorageProvider = MapStorageProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var mapStorageProvider = new System.Providers.MapStorageProvider();
//@ sourceMappingURL=MapStorageProvider.js.map
