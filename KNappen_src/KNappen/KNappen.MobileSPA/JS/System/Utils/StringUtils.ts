/// <reference path="../../../Scripts/typings/jquery/jquery.d.ts" />
/**
    System utilities
    @namespace System.Utils
*/
module System.Util {
    export class StringUtils {

        /**
          * StringUtils
          * @class System.Utils.StringUtils
          * @classdesc Provides string related services.
          */
        constructor() { }

        /**
          * Check if string originalString starts with subString.
          * @method System.StringUtils#startsWith
          * @param {string} originalString String to check.
          * @param {string} subString String to check for.
          */
        public startsWith(originalString: string, subString: string) {
            return originalString.slice(0, subString.length) == subString;
        }

        /**
          * Check if string originalString ends with subString.
          * @method System.StringUtils#endsWith
          * @param {string} originalString String to check.
          * @param {string} subString String to check for.
          */
        public endsWith(originalString: string, subString: string) {
            return originalString.slice(-subString.length) == subString;
        }

        /**
          * Create a GUID in form or xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
          * @method System.StringUtils#mkGUID
          */
        public mkGUID(): string {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }


        /**
          * Highlight any occurences of a word using <span style='background-color: '> tags.
          * @method System.StringUtils#highlightWord
          * @param {string} text Text to highlight
          * @param {string} words Space separated words to replace
          * @param {string} color Color code to show
          */
        public highlightWord(text: string, words: string, color: string): string {
            if (!text || !words || !color)
                return text;

            var t: any = text;

            if (typeof (t) == "object" && t.length > 0) {
                t = t[0];
            }

            $.each(words.split(' '), function (k, v) {
                v = v.replace("*", "").replace("%", "");
                t = t.replace(new RegExp("(" + v + ")", "gi"), "<span style='background-color: " + color + ";'>$1</span>");
            });
            return t;
        }

        /**
          * Calculate hash of a string.
          * @method System.StringUtils#hash
          * @param {string} str String to hash
          */
        public hash(str: string): number {
            var hash = 0, l, i, char;
            if (str.length == 0) return hash;
            for (i = 0, l = str.length; i < l; i++) {
                char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }

        /**
          * Create a shortened version of a string ending it with ... after x bytes.
          * @method System.StringUtils#shorten
          * @param {string} str Text to shorten
          * @param {number} len Length of text
          */
        public shorten(str: string, len: number) {
            if (str.length < len + 3)
                return str;
            return str.substring(0, len) + "...";
        }

        /**
          * Get host portion of a URL
          * @method System.StringUtils#getHostFromUrl
          * @param {string} url URL to extract from
          */
        public getHostFromUrl(url: string): string {
            var ret = url.replace(/^[^:]+:\/+([^\/\?]+).*/, "$1");
            return ret;
        }

        /**
          * Get parameters from a URL
          * @method System.StringUtils#getParamsFromUrl
          * @param {string} url URL to extract from
          * @returns {array} Key/value dictionary
          */
        public getParamsFromUrl(url: string): { [key: string]: string; } {
            var ret: { [name: string]: string; } = {};

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
        }
    }
}

var stringUtils = new System.Util.StringUtils();
