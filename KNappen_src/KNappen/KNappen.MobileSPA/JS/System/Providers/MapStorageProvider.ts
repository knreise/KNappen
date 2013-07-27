/// <reference path="../_References.ts" />
module System.Providers {
    declare var config;

    export class MapStorageProvider {

        private enabled: bool = true;

        public setEnabled(enabled: bool) {
            log.debug("MapStorageProvider", "Setting enabled state to: " + enabled);
            this.enabled = enabled;
        }

        public get(cacheType: string, key: string): string {
            if (!this.enabled)
                return null;

            var value = null;
            // Get from standard cache
            if (cacheType === "standard")
                value = storageProvider.get("map:standard:" + stringUtils.hash(key));
            // Get from precache
            if (value) {
                log.debug("MapStorageProvider", "Getting tile from standard cache: " + key);
            }
            else {
                value = storageProvider.get("map:precache:" + stringUtils.hash(key));
                if (value)
                    log.debug("MapStorageProvider", "Getting tile from precache: " + key);
            }
            if (!value)
                log.debug("MapStorageProvider", "Getting tile from cache failed: " + key);

            return value;
        }

        public set(cacheType: string, key: string, value: string) {
            if (!this.enabled)
                return null;
            log.debug("MapStorageProvider", "Adding tile to cache: " + key);

            var fullKey = "map:" + cacheType + ":" + stringUtils.hash(key);
            storageProvider.set(fullKey, value);
            this.cleanHistory(cacheType);
        }

        public cleanHistory(cacheType: string) {
            // Get a list of tiles we want
            var startKey = "map:" + cacheType + ":";
            var sortedList: any[] = [];
            $.each(storageProvider.getAll(), function (k, v) {
                if (stringUtils.startsWith(k, startKey) && !stringUtils.endsWith(k, ".meta")) {
                    sortedList.push({ key: k, value: v, meta: storageProvider.getMeta(k) });
                }
            });

            // Sort by date
            sortedList.sort(function (a: any, b: any): number {
                return (a.meta.changed - b.meta.changed);
            });

            // Make sure missing definition in config doesn't lead to immediate deletion of cache
            var tileLimit = config.mapCacheTileLimit[cacheType];
            if (tileLimit < 1)
                tileLimit = 10000;

            // Remove old tiles
            var amountToRemove: number = sortedList.length - tileLimit;
            if (amountToRemove > 0) {
                for (var i: number = 0; i < amountToRemove; i++) {
                    log.debug("MapStorageProvider", "Removing cache overflow:" + sortedList[i].meta.changed + ": " + sortedList[i].key);
                    storageProvider.remove(sortedList[i].key);
                }
            }

        }

        public clear(cacheType: string) {
            log.info("MapStorageProvider", "Clearing cache for type: " + cacheType);

            var startKey = "map:" + cacheType + ":";
            $.each(storageProvider.getAll(), function (k, v) {
                if (stringUtils.startsWith(k, startKey) && !stringUtils.endsWith(k, ".meta")) {
                    storageProvider.remove(k);
                }
            });
        }
    }
}
var mapStorageProvider = new System.Providers.MapStorageProvider();