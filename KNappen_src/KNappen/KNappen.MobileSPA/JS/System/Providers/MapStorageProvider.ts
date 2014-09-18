/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {

    declare var cache;
    declare var arrayStore;

    export class MapStorageProvider {

        private static tableMapCache: string = "mapcache";

        private mapCache: any;
        private cacheLoaded: boolean;
        private hasDatabase: boolean;

        /**
          * MapStorageProvider
          * @class System.Providers.MapStorageProvider
          * @classdesc Wrapper for StorageProvider for map.
          */
        constructor() {
            this.mapCache = new cache();
            this.mapCache.setStore(arrayStore);
            this.cacheLoaded = false;
            this.hasDatabase = compatibilityInfo.isMobile;
        }

        /**
          * Load cached tiles from database.
          * @method System.Providers.MapStorageProvider#loadCache
          */
        public loadStoredCache(): void {
            if (this.hasDatabase && !this.cacheLoaded) {
                log.debug("MapStorageProvider", "Loading tiles from database");
                var sql = "SELECT * FROM " + MapStorageProvider.tableMapCache;
                sqlProvider.sqlDo("LoadTiles", (tx, results) => this.loadCacheSuccessCallback(tx, results), (error) => this.loadCacheErrorCallback(error), null, sql, null);
            }
        }
        
        /**
          * Check if a tile is cached.
          * @method System.Providers.MapStorageProvider#hasTile
          */
        public hasTile(url: string): void {
            this.mapCache.has(url);
        }
        
        /**
          * Try fetch a cached tile.
          * @method System.Providers.MapStorageProvider#fetchTile
          */
        public fetchTile(url: string): any {
            return this.mapCache.get(url);
        }
        
        /**
          * Save tile to cache.
          * @method System.Providers.MapStorageProvider#cacheTile
          */
        public cacheTile(url: string, tile: any): void {
            this.mapCache.set(url, tile);
        }

        /**
          * Save tile to database.
          * @method System.Providers.MapStorageProvider#storeTile
          * @param {string} url Cache key to set
          * @param {string} tile Cache value to set
          */
        public storeTile(url: string, tile: any): void {
            if (this.hasDatabase) {
                log.debug("MapStorageProvider", "Adding tile to cache: " + url);
                var sql = "INSERT OR IGNORE INTO " + MapStorageProvider.tableMapCache + " (key, value) VALUES (?, ?)";
                sqlProvider.sqlDo("StoreTile", (tx, results) => this.storeTileSuccessCallback(tx, results), (error) => this.storeTileErrorCallback(error), null, sql, [url, tile]);
            }
        }

        /**
          * Clear cache for certain cacheType.
          * @method System.Providers.MapStorageProvider#clearCache
          * @param {string} cacheType Type of cache to clear
          */
        public clearCache() {
            delete this.mapCache;
            this.mapCache = new cache();
            this.mapCache.setStore(arrayStore);

            if (this.hasDatabase) {
                log.info("MapStorageProvider", "Clearing saved cache");
                var sql = "DELETE FROM " + MapStorageProvider.tableMapCache;
                sqlProvider.sqlDo("ClearTiles", (tx, results) => this.clearCacheSuccessCallback(tx, results), (error) => this.clearCacheErrorCallback(error), null, sql, null);
            }
        }

        private loadCacheSuccessCallback(tx: SQLTransaction, results: SQLResultSet): void {
            log.debug("MapStorageProvider", "Map cache loaded from database");
            log.debug("MapStorageProvider", "Number of tiles cached: " + results.rows.length);

            var len = results.rows.length;

            try {
                for (var i = 0; i < len; i++) {
                    var rKey = results.rows.item(i).key;
                    var rValue = results.rows.item(i).value;

                    this.cacheTile(rKey, rValue);
                }
                log.debug("MapStorageProvider", "Done loading Map cache");
            } catch (e) {
                log.error("MapStorageProvider", "Error loading tiles to cache from sqlresultset: " + e.toString());
            }

            this.cacheLoaded;
        }

        private loadCacheErrorCallback(error: SQLError): void {
            log.error("MapStorageProvider", "Error loading map cache from database: " + error.code + " - " + error.message);
        }

        private storeTileSuccessCallback(tx: SQLTransaction, results: SQLResultSet): void {
            log.debug("MapStorageProvider", "Saved tile to database");
        }

        private storeTileErrorCallback(error: SQLError): void {
            log.error("MapStorageProvider", "Error saving tile to database: " + error.code + " - " + error.message);
        }

        private clearCacheSuccessCallback(tx: SQLTransaction, results: SQLResultSet): void {
            log.debug("MapStorageProvider", "Map cache cleared from database");
        }

        private clearCacheErrorCallback(error: SQLError): void {
            log.error("MapStorageProvider", "Error clearing map cache from database: " + error.code + " - " + error.message);
        }
    }
}
var mapStorageProvider = new System.Providers.MapStorageProvider();
startup.addPostInit(() => mapStorageProvider.loadStoredCache(), "MapStorageProvider");