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
          * @param {boolean} onlyFromBeginning Indicates whether to only highlight from the beginning of a word or from everywhere in a word. 
          */
        public highlightWord(text: any, words: string, color: string, onlyFromBeginning: boolean): string {

            words = $.trim(words);

            if (!text || !words || !color)
                return text;

            if (typeof (text) == "object" && text.length > 0) {
                text = text[0];
            }

            var keys = words.split(' ').sort((a: string, b: string) => (a.length > b.length) ? -1 : (a.length == b.length) ? 0 : 1);
            for (var ki in keys) {
                var key = keys[ki].replace("*", "").replace("%", "");
                
                if (onlyFromBeginning)
                    text = text.replace(new RegExp("(\\b" + key + ")", "gi"), "<span style='background-color: " + color + ";'>" + key + "</span>");
                else
                    text = text.replace(new RegExp("(" + key + ")", "gi"), "<span style='background-color: " + color + ";'>$1</span>");
            }

            return text;
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

        /**
          * Formats a key value pair into a field with the key bold.
          * @method System.StringUtils#toFieldBold
          * @param {string} key The field name
          * @param {string[]} values The field values (params)
          * @returns {string} The formated field
          */
        public toFieldBold(key: string, ... values: string[]): string {
            if (values == null) {
                return "";
            }

            var value = "";
            for (var i in values) {
                if (values[i] != null && values[i] != "") {
                    if (i > 0) {
                        value += " ";
                    }

                    value += values[i];
                }
            }

            if (value == "") {
                return "";
            }

            if (key == null) {
                return "<b>" + value + "</b>" + "</br>";
            }

            return "<b>" + key + ": </b>" + value + "</br>";
        }

        /**
          * Formats a key value pair into a field.
          * @method System.StringUtils#toFieldBold
          * @param {string} key The field name
          * @param {string} Value The field vlaue
          * @returns {string} The formated field
          */
        public toField(key: string, value: string): string {
            if (value == null || value == "") {
                return "";
            }

            if (key == null) {
                return value + "</br>";
            }

            return key + ": " + value + "</br>";
        }
        
        /**
          * Formats a key value pair into a field by firstly using a code mapping of the value.
          * @method System.StringUtils#toFieldBold
          * @param {string} key The field name
          * @param {string} code The fields code value
          * @returns {string} The formated field
          */
        public toFieldFromCode(key: string, code: string): string {
            var value = null;

            if (code == null || code == "") {
                return "";
            }

            if (key == "Bostatus") {
                switch (code) {
                    case "b": value = "Bosatt p\u00E5 stedet"; break;
                    case "f": value = "Midlertidig frav\u00E6rende"; break;
                    case "mt": value = "Midlertidig tilstede"; break;
                    default: value = code; break;
                }
            }
            else if (key == "Statsborgerskap") {
                switch (code) {
                    case "n": value = "Norsk"; break;
                    case "l": value = "Lappisk"; break;
                    case "lf": value = "Lappisk, fastboende"; break;
                    case "ln": value = "Lappisk, nomadiserende"; break;
                    case "f": value = "Finsk(kvensk)"; break;
                    case "k": value = "Kvensk(finsk)"; break;
                    case "b": value = "Blandet"; break;
                    default: value = code; break;
                }
            }
            else if (key == "Trossamfunn") {
                switch (code) {
                    case "s": value = "Statskirken"; break;
                    default: value = code; break;
                }
            }
            else if (key == "Familiestilling") {
                switch (code) {
                    case "hf": value = "Husfar"; break;
                    case "hm": value = "Husmor"; break;
                    case "hp": value = "Hovedperson"; break;
                    case "hu": value = "Hustru"; break;
                    case "s": value = "S\u00F8nn"; break;
                    case "d": value = "Datter"; break;
                    case "tj": value = "Tjenestetyende"; break;
                    case "fl": value = "Losjerende, h\u00F8rende til familien"; break;
                    case "b": value = "Bes\u00F8kende"; break;
                    case "el": value = "Enslig losjerende"; break;
                    default: value = code; break;
                }
            }
            else if (key == "Sivilstatus") {
                switch (code) {
                    case "e": value = "Enke / Enkemann"; break;
                    case "g": value = "Gift"; break;
                    case "ug": value = "Ugift"; break;
                    case "s": value = "Separert"; break;
                    case "f": value = "Fraskilt"; break;
                    default: value = code; break;
                }
            }

            return this.toField(key, value);
        }
    }
}

var stringUtils = new System.Util.StringUtils();
