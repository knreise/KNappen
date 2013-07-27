var System;
(function (System) {
    /// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
    /**
    System utilities
    @namespace System.Utils
    */
    (function (Util) {
        var StringUtils = (function () {
            /**
            * StringUtils
            * @class System.Utils.StringUtils
            * @classdesc Provides string related services.
            */
            function StringUtils() {
            }
            /**
            * Check if string originalString starts with subString.
            * @method System.StringUtils#startsWith
            * @param {string} originalString String to check.
            * @param {string} subString String to check for.
            */
            StringUtils.prototype.startsWith = function (originalString, subString) {
                return originalString.slice(0, subString.length) == subString;
            };

            /**
            * Check if string originalString ends with subString.
            * @method System.StringUtils#endsWith
            * @param {string} originalString String to check.
            * @param {string} subString String to check for.
            */
            StringUtils.prototype.endsWith = function (originalString, subString) {
                return originalString.slice(-subString.length) == subString;
            };

            /**
            * Create a GUID in form or xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
            * @method System.StringUtils#mkGUID
            */
            StringUtils.prototype.mkGUID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            };

            StringUtils.prototype.highlightWord = function (text, words, color) {
                if (!text || !words || !color)
                    return text;

                var t = text;

                if (typeof (t) == "object" && t.length > 0) {
                    t = t[0];
                }

                $.each(words.split(' '), function (k, v) {
                    v = v.replace("*", "").replace("%", "");
                    t = t.replace(new RegExp("(" + v + ")", "gi"), "<span style='background-color: " + color + ";'>$1</span>");
                });
                return t;
            };

            StringUtils.prototype.hash = function (str) {
                var hash = 0, l, i, char;
                if (str.length == 0)
                    return hash;
                for (i = 0, l = str.length; i < l; i++) {
                    char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash |= 0;
                }
                return hash;
            };

            StringUtils.prototype.shorten = function (str, len) {
                if (str.length < len + 3)
                    return str;
                return str.substring(0, len) + "...";
            };

            StringUtils.prototype.getHostFromUrl = function (url) {
                var ret = url.replace(/^[^:]+:\/+([^\/\?]+).*/, "$1");
                return ret;
            };

            StringUtils.prototype.getParamsFromUrl = function (url) {
                var ret = {};

                url = url.replace(/^.*?\?/, "");

                url = url.replace(/([^&]*)/gm, function (fullMatch, match, offset) {
                    console.log("Match: Type: " + typeof (match) + ", data: " + match);
                    var k = match.replace(/^&?([^=]*).*/gm, "$1");
                    var v = match.replace(/^&?[^=]*=(.*)/gm, "$1");
                    if (k)
                        ret[decodeURIComponent(k)] = decodeURIComponent(v);
                    return "";
                });

                return ret;
            };
            return StringUtils;
        })();
        Util.StringUtils = StringUtils;
    })(System.Util || (System.Util = {}));
    var Util = System.Util;
})(System || (System = {}));

var stringUtils = new System.Util.StringUtils();
//@ sourceMappingURL=StringUtils.js.map
