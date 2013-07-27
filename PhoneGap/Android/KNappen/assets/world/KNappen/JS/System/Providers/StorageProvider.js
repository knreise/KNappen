var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var StorageMetaData = (function () {
            function StorageMetaData() {
                this.changed = "";
            }
            StorageMetaData.prototype.getChanged = function () {
                return moment(this.changed);
            };
            return StorageMetaData;
        })();
        Providers.StorageMetaData = StorageMetaData;

        var StorageItem = (function () {
            function StorageItem() {
            }
            return StorageItem;
        })();
        Providers.StorageItem = StorageItem;

        var StorageProvider = (function () {
            /**
            * StorageProvider
            * @class System.Providers.StorageProvider
            * @classdesc Provides permanent device storage service.
            */
            function StorageProvider() {
                this.store = new cache();
                this.isPhoneGap = false;
                this.metaObjectCache = {};
                //store.setStore(cookieStore);
                this.isPhoneGap = compatibilityInfo.isPhoneGap;
                this.ReInit();
            }
            StorageProvider.prototype.Load = function () {
                if (storageProvider.isPhoneGap) {
                    // Increase startup sequence timeout for load while waiting for phonegap
                    startup.loadCountdownMs = 20 * 1000;

                    // Initiate async SQL read
                    phoneGapProvider.SqlRead("settings");
                }
            };

            /**
            * Set PhoneGap state. If set to true then PhoneGap communication (for SQLite storage) is used. Requires corresponding scripts to handle events in PhoneGap.
            * @method System.Providers.StorageProvider#setPhoneGap
            * @param {bool} state True=Use PhoneGap communication for storage
            */
            StorageProvider.prototype.setPhoneGap = function (state) {
                this.isPhoneGap = state;
                this.ReInit();
            };

            StorageProvider.prototype.ReInit = function () {
                log.debug("StorageProvider", "setPhoneGap: Running in PhoneGap (use PhoneGap SQL storage instead of localStorage): " + this.isPhoneGap);
                if (this.isPhoneGap) {
                    this.store = new Array();
                } else {
                    this.store = localStorage;
                }
            };

            /**
            * Store a key-value pair.
            * @method System.Providers.StorageProvider#set
            * @param {string} key Key to use for storage.
            * @param {string} value Value to store.
            */
            StorageProvider.prototype.set = function (key, value) {
                var old;
                if (this.isPhoneGap)
                    old = this.store[key];

                this.store[key] = value;
                var now = moment().format("X");
                var storageMetaData = new StorageMetaData();
                storageMetaData.changed = now;
                var meta = serializer.serializeJSObject(storageMetaData);
                this.store[key + ".meta"] = meta;

                if (this.isPhoneGap && old != value) {
                    phoneGapProvider.SqlSetKey("settings", key, value, meta);
                }
            };

            /**
            * Store a key-value pair without triggering PhoneGap storage. Used (externally) by PhoneGap to store data in this module.
            * @method System.Providers.StorageProvider#setRaw
            * @param {string} key Key to use for storage.
            * @param {string} value Value to store.
            */
            StorageProvider.prototype.setRaw = function (key, value) {
                log.debug("StorageProvider", "SQL: setRaw: key: " + key);
                this.store[key] = value;
            };

            /**
            * Get a key-value pair.
            * @method System.Providers.StorageProvider#get
            * @param {string} key Key to retrieve.
            * @returns {string} Data stored in key.
            */
            StorageProvider.prototype.get = function (key) {
                return this.store[key];
            };

            /**
            * Get metadata for a key-value pair. (TODO: Deserializes for every use)
            * @method System.Providers.StorageProvider#getMeta
            * @param {string} key Key to retrieve.
            * @returns {any} Metadata stored in key.
            */
            StorageProvider.prototype.getMeta = function (key) {
                var obj = this.metaObjectCache[key];
                if (!obj) {
                    obj = serializer.deserializeJSObject(this.store[key + ".meta"], new StorageMetaData());
                    this.metaObjectCache[key] = obj;
                }
                return obj;
            };

            /**
            * Remove a key-value pair.
            * @method System.Providers.StorageProvider#remove
            * @param {string} key Key to remove.
            */
            StorageProvider.prototype.remove = function (key) {
                delete this.store[key];
                delete this.store[key + ".meta"];
                delete this.metaObjectCache["key"];
                if (this.isPhoneGap)
                    phoneGapProvider.SqlRemoveKey("settings", key);
            };

            StorageProvider.prototype.getAll = function () {
                return this.store;
            };

            /**
            * Check if a key exists.
            * @method System.Providers.StorageProvider#has
            * @param {string} key Key to check for.
            * @returns {bool} True if exists, False if not.
            */
            StorageProvider.prototype.has = function (key) {
                return this.store.has(key);
            };
            return StorageProvider;
        })();
        Providers.StorageProvider = StorageProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var storageProvider = new System.Providers.StorageProvider();
startup.addLoad(function () {
    storageProvider.Load();
}, "StorageProvider");
//@ sourceMappingURL=StorageProvider.js.map
