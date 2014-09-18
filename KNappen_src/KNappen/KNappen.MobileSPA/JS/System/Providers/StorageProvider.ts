/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {

    declare var cache: any;
    declare var localStorageStore: any;
    declare var arrayStore: any;
    
    export class StorageMetaData {

        public changed: string = "";
        
        public getChanged(): Moment {
            return moment(this.changed);
        }
    }

    export class StorageProvider {

        private store: any;
        private hasDatabase: boolean;

        /**
          * StorageProvider
          * @class System.Providers.StorageProvider
          * @classdesc Provides permanent device storage service.
          */
        constructor() {
            this.hasDatabase = compatibilityInfo.isMobile;

            if (this.hasDatabase) {
                log.debug("StorageProvider", "Running in PhoneGap (use PhoneGap SQL storage)");
                this.store = new cache();
                this.store.setStore(arrayStore);
            } else {
                log.debug("StorageProvider", "Not running in PhoneGap (use localStorage)");
                this.store = new cache();
                this.store.setStore(localStorageStore);
            }
        }

        /**
          * Pre-Init Storage Provider
          * @method System.Providers.StorageProvider#preInit
          */
        public preInit(): void {
            if (this.hasDatabase) {
                phoneGapProvider.SqlRead("settings", () => startup.finishedPreInit("StarageProvider"));
            } else {
                startup.finishedPreInit("StorageProvider");
            }
        }

        /**
          * Store a key-value pair.
          * @method System.Providers.StorageProvider#set
          * @param {string} key Key to use for storage.
          * @param {string} value Value to store.
          */
        public set(key: string, value: string) {

            var now = moment().format("X");
            var storageMetaData = new StorageMetaData();
            storageMetaData.changed = now;
            var meta = serializer.serializeJSObject(storageMetaData);

            var old = this.store.get(key);

            this.store.set(key, value);
            this.store.set(key + ".meta", meta);

            if (this.hasDatabase && old != value) {
                phoneGapProvider.SqlSetKey("settings", key, value, meta);
            }
        }
        
        /**
          * Store a key-value pair without triggering PhoneGap storage. Used (externally) by PhoneGap to store data in this module.
          * @method System.Providers.StorageProvider#setRaw
          * @param {string} key Key to use for storage.
          * @param {string} value Value to store.
          */
        public setRaw(key: string, value: string) {
            log.debug("StorageProvider", "SQL: setRaw: key: " + key);
            this.store.set(key, value);
        }

        /**
          * Get a key-value pair.
          * @method System.Providers.StorageProvider#get
          * @param {string} key Key to retrieve.
          * @returns {string} Data stored in key.
          */
        public get(key: string): string {
            return this.store.get(key);
        }

        /**
          * Remove a key-value pair.
          * @method System.Providers.StorageProvider#remove
          * @param {string} key Key to remove.
          */
        public remove(key: string) {
            delete this.store.get(key);
            delete this.store.get(key + ".meta");
            if (this.hasDatabase) {
                phoneGapProvider.SqlRemoveKey("settings", key);
            }
        }

        /**
          * Check if a key exists.
          * @method System.Providers.StorageProvider#has
          * @param {string} key Key to check for.
          * @returns {bool} True if exists, False if not.
          */
        public has(key: string) {
            return this.store.has(key);
        }
    }
}
var storageProvider = new System.Providers.StorageProvider();
startup.addPreInit(function () { storageProvider.preInit(); }, "StorageProvider");
