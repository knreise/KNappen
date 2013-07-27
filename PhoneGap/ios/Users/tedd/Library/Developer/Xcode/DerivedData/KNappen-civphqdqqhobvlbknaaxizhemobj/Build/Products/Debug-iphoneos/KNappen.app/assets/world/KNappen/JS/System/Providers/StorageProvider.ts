/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var cache: any;
    declare var localStorageStore: any;
    declare var arrayStore: any;
    declare var cookieStore: any;
    declare var AR: any;

    export class StorageMetaData {
        public changed: string = "";
        
        public getChanged(): Moment {
            return moment(this.changed);
        }
    }

    export class StorageItem {
        public key: string;
        public value: string;
        public meta: System.Providers.StorageMetaData;
    }

    export class StorageProvider {
        private store: any = new cache();
        public isPhoneGap = false;
        private metaObjectCache: { [key: string]: any; } = {};

        /**
          * StorageProvider
          * @class System.Providers.StorageProvider
          * @classdesc Provides permanent device storage service.
          */
        constructor() {

            //store.setStore(cookieStore);
            try {
                if (AR)
                    this.isPhoneGap = true;
            } catch (exception) {
            }
            this.ReInit();
        }

        /**
          * Set PhoneGap state. If set to true then PhoneGap communication (for SQLite storage) is used. Requires corresponding scripts to handle events in PhoneGap.
          * @method System.Providers.StorageProvider#setPhoneGap
          * @param {bool} state True=Use PhoneGap communication for storage
          */
        public setPhoneGap(state: bool) {
            this.isPhoneGap = state;
            this.ReInit();
        }

        public ReInit() {
            log.debug("StorageProvider", "setPhoneGap: Running in PhoneGap (use PhoneGap SQL storage instead of localStorage): " + this.isPhoneGap);
            if (this.isPhoneGap) {
                this.store = new Array();
            } else {
                this.store = localStorage;
            }

        }

        /**
          * Store a key-value pair.
          * @method System.Providers.StorageProvider#set
          * @param {string} key Key to use for storage.
          * @param {string} value Value to store.
          */
        public set(key: string, value: string) {

            var old;
            if (this.isPhoneGap)
                old = this.store[key];

            this.store[key] = value;
            var now = moment().format("X");
            var storageMetaData = new StorageMetaData();
            storageMetaData.changed = now;
            var meta = serializer.serializeJSObject(storageMetaData);
            this.store[key + ".meta"] = meta;

            // Save only if changed
            if (this.isPhoneGap && old != value) {
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
            this.store[key] = value;
        }

        /**
          * Get a key-value pair.
          * @method System.Providers.StorageProvider#get
          * @param {string} key Key to retrieve.
          * @returns {string} Data stored in key.
          */
        public get(key: string): string {
            return this.store[key];
        }
        /**
          * Get metadata for a key-value pair. (TODO: Deserializes for every use)
          * @method System.Providers.StorageProvider#getMeta
          * @param {string} key Key to retrieve.
          * @returns {any} Metadata stored in key.
          */
        public getMeta(key: string): System.Providers.StorageMetaData {
            var obj = this.metaObjectCache[key];
            if (!obj) {
                obj = serializer.deserializeJSObject(this.store[key + ".meta"], new StorageMetaData());
                this.metaObjectCache[key] = obj;
            }
            return obj;
        }

        /**
          * Remove a key-value pair.
          * @method System.Providers.StorageProvider#remove
          * @param {string} key Key to remove.
          */
        public remove(key: string) {
            delete this.store[key];
            delete this.store[key + ".meta"];
            delete this.metaObjectCache["key"];
            if (this.isPhoneGap)
                phoneGapProvider.SqlRemoveKey("settings", key);
        }

        public getAll(): { [key: string]: string; } {
            return this.store;
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
startup.addLoad(function () {
    if (storageProvider.isPhoneGap)
        phoneGapProvider.SqlRead("settings");
}, "StorageProvider");

