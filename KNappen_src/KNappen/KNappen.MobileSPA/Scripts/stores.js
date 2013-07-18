/**
 * wraps JSON so we can use a JSON encoder which uses toString and fromString or parse and stringify
 */
var JSONWrapper = function () {
    var my = {
        /**
         * passes control to the JSON object; defaults to JSON.stringify
         */
        toString: function () {
            return JSON.stringify(arguments);
        },
        /**
         * passes control to the JSON object; defaults to JSON.parse
         */
        fromString: function () {
            return JSON.parse(arguments);
        },
        /**
         * sets toString handler
         * @param func reference to toString function, eg this.set_toString(JSON.stringify);
         */
        set_toString: function (func) {
            my.toString = function () {
                // send all arguments to the desired function as an array
                var args = Array.prototype.slice.call(arguments);
                return func(args);
            }
        },
        /**
         * sets fromString handler
         * @param func reference to fromString function, eg this.set_toString(JSON.parse);
         */
        set_fromString: function (func) {
            my.fromString = function () {
                // send all arguments to the desired function as an array
                var args = Array.prototype.slice.call(arguments);
                return func(args);
            }
        }
    };

    return my;
};

/**
 * arrayStore - the default Cache storage
 */
var arrayStore = function () {
    var myStore = Array();

    var my = {
        has: function (key) {
            return (typeof myStore[key] != "undefined");
        },
        get: function (key) {
            return myStore[key];
        },
        set: function (key, val) {
            myStore[key] = val;
        },
        kill: function (key) {
            delete myStore[key];
        }
    };

    return my;
};

/**
 * localStorageStore.
 */
var localStorageStore = function () {
    var prefix = "CacheJS_LS"; // change this if you're developing and want to kill everything ;0)

    var my = {
        has: function (key) {
            return (localStorage[prefix + key] != null);
        },
        get: function (key) {
            if (!my.has(key)) {
                return undefined;
            } else {
                return JSON.parse(localStorage[prefix + key]);
            }
        },
        set: function (key, val) {
            if (val === undefined) {
                my.kill(key);
            } else {
                localStorage[prefix + key] = JSON.stringify(val);
            }
        },
        kill: function (key) {
            //delete localStorage[prefix+key]; // not supported in IE8
            localStorage.removeItem(prefix + key);
        }
    };

    if (window.localStorage) {
        return my;
    } else {
        // localStorage not supported on this browser; degrade to arrayStore.
        return arrayStore();
    }
};

/**
 * Cookie Monster Want Cookies.
 * I don't recommend the use of this store really; cookies have limited length, and you can only have a limited number of cookies per domain
 * It's really only included to show how flexible the pluggable storage system is.
 */
var cookieStore = function () {
    // uses cookie functions from http://www.quirksmode.org/js/cookies.html
    var prefix = "CacheJS_CS";

    var my = {
        has: function (key) {
            return (my.get(key) !== undefined);
        },
        get: function (key) {
            var nameEQ = prefix + "=";
            var ca = document.cookie.split(';');
            for (var i = 0 ; i < ca.length ; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) == 0) {
                    // found our cookie; split it out for the specified key
                    cookieContents = JSON.parse(c.substring(nameEQ.length, c.length));
                    if (key) {
                        return cookieContents[key];
                    } else {
                        return cookieContents;
                    }
                }
            }
            return undefined;
        },
        set: function (key, val) {
            cookieContents = my.get();
            if (cookieContents == null) {
                cookieContents = Object();
            }
            cookieContents[key] = val;
            document.cookie = prefix + "=" + JSON.stringify(cookieContents) + "; path=/";
        },
        kill: function (key) {
            my.set(key, undefined);
        }
    };

    return my;
};