/**
 * CacheJS - implements a key/val store with expiry.
 * Swappable storage modules (array, cookie, localstorage)
 * Homepage: http://code.google.com/p/cachejs
 */
var cache = function () {

    /* public */
    var my = {
        /**
         * Sets the storage object to use.
         * On invalid store being passed, current store is not affected.
         * @param new_store store.
         * @return boolean true if new_store implements the required methods and was set to this cache's store. else false
         */
        setStore: function (new_store) {
            if (typeof new_store == "function") {
                new_store = new_store();
                if (new_store.get && new_store.set && new_store.kill && new_store.has) {
                    store = new_store;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },
        /**
         * Returns true if cache contains the key, else false
         * @param key string the key to search for
         * @return boolean
         */
        has: function (key) {
            return store.has(key);
        },
        /**
         * Removes a key from the cache
         * @param key string the key to remove for
         * @return boolean
         */
        kill: function (key) {
            store.kill(key);
            return store.has(key);
        },
        /**
         * Gets the expiry date for given key
         * @param key string. The key to get
         * @return mixed, value for key or NULL if no such key
         */
        getExpiry: function (key) {
            var exp = get(key, EXPIRES);
            if (exp != false && exp != null) {
                exp = new Date(exp);
            }
            return exp;
        },
        /**
         * Sets the expiry date for given key
         * @param key string. The key to set
         * @param expiry; RFC1123 date or false for no expiry
         * @return mixed, value for key or NULL if no such key
         */
        setExpiry: function (key, expiry) {
            if (store.has(key)) {
                storedVal = store.get(key);
                storedVal[EXPIRES] = makeValidExpiry(expiry);
                store.set(key, storedVal);
                return my.getExpiry(key);
            } else {
                return NOSUCHKEY;
            }
        },
        /**
         * Gets a value from the cache
         * @param key string. The key to fetch
         * @return mixed or NULL if no such key
         */
        get: function (key) {
            return get(key, VALUE);
        },
        /**
         * Sets a value in the cache, returns true on sucess, false on failure.
         * @param key string. the name of this cache object
         * @param val mixed. the value to return when querying against this key value
         * @param expiry RFC1123 date, optional. If not set and is a new key, or set to false, this key never expires
         *                       If not set and is pre-existing key, no change is made to expiry date
         *                       If set to date, key expires on that date.
         */
        set: function (key, val, expiry) {

            if (!store.has(key)) {
                // key did not exist; create it
                storedVal = Array();
                storedVal[EXPIRES] = makeValidExpiry(expiry);
                store.set(key, storedVal);
            } else {
                // key did already exist
                storedVal = store.get(key);
                if (typeof expiry != "undefined") {
                    // If we've been given an expiry, set it
                    storedVal[EXPIRES] = makeValidExpiry(expiry);
                } // else do not change the existent expiry
            }

            // always set the value
            storedVal[VALUE] = val;
            store.set(key, storedVal);

            return my.get(key);
        }
    };
    /* /public */

    /* private */
    var store = arrayStore();
    var NOSUCHKEY = null;
    var VALUE = 0;
    var EXPIRES = 1;

    function get(key, part) {
        if (store.has(key)) {
            // this key exists:

            // get the value
            storedVal = store.get(key);

            var now = new Date();
            if (storedVal[EXPIRES] && Date.parse(storedVal[EXPIRES]) <= now) {
                // key has expired
                // remove from memory
                store.kill(key);
                // return NOSUCHKEY
                return NOSUCHKEY;
            } else if (typeof storedVal[part] != "undefined") {
                // not expired or never expires, and part exists in store[key]
                return storedVal[part];
            } else {
                // part is not a member of store[key]
                return NOSUCHKEY;
            }
        } else {
            // no such key
            return NOSUCHKEY;
        }
    }

    function makeValidExpiry(expiry) {
        if (!expiry) {
            // no expiry given; change from "undefined" to false - this value does not expire.
            expiry = false;
        } else {
            // force to date type
            expiry = new Date(expiry);
        }

        return expiry;
    }

    /* /private */

    return my;
};