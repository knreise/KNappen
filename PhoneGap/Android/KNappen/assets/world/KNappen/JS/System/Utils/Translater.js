var System;
(function (System) {
    /// <reference path="../Startup.ts" />
    /// <reference path="../Diagnostics/Log.ts" />
    /**
    System utilities
    @namespace System.Utils
    */
    (function (Utils) {
        var Translater = (function () {
            /**
            * Translater
            * @class System.Utils.Translater
            * @classdesc Provides translation service.
            */
            function Translater() {
                //public strings: { [index: string]: string; } = {};
                this.strings = {};
                this.regexMatchConf = new RegExp("^CONFIG:(.*)", "i");
            }
            Translater.prototype.PreInit = function () {
                log.debug("Translator", "PreInit()");
                translater.translateAllClasses();
            };

            /**
            * Translate string
            * @method System.Startup#translate
            * @param {string} str String to translate.
            */
            Translater.prototype.translate = function (str, params) {
                if (typeof params === "undefined") { params = null; }
                var ucStr = str.toUpperCase();
                var translated = this.strings[ucStr];
                var strParametered = translated;
                if (!strParametered)
                    strParametered = str;

                if (params && strParametered) {
                    // Replace {0} {1} etc
                    strParametered = strParametered.replace(/{([^{}]*)}/gm, function (a, b) {
                        return params[b];
                    });
                }

                if (translated) {
                    log.verboseDebug("Translater", "Returning translation for key " + ucStr + ": " + strParametered + "");
                    return strParametered;
                }

                var configVar = this.regexMatchConf.exec(str);
                if (configVar && configVar[1]) {
                    var configVal = config[configVar[1]];
                    log.verboseDebug("Translater", "Returning config for translation key " + configVar[0] + ": " + configVal + "");
                    return configVal;
                }

                log.error("Translater", "Unable to find translation for: '" + str + "'");
                return strParametered;
            };

            /**
            * Translate substrings
            * @method System.Startup#translateSubString
            * @param {string} str String to translate.
            */
            Translater.prototype.translateSubString = function (str) {
                var _this = this;
                var ret = "";
                ret = str.replace(/\$T\[([^\]]+)\]/gm, function (fullMatch, match, offset) {
                    return _this.translate(match);
                });
                return ret;
            };

            Translater.prototype.translateSubStringHtmlElementByName = function (element) {
                var e = $("#" + element);
                this.translateSubStringHtmlElement(e);
            };

            Translater.prototype.translateSubStringHtmlElement = function (element) {
                var original = element.html();
                var translated = this.translateSubString(original);

                if (original === translated) {
                } else {
                    element.html(translated);
                }
            };

            Translater.prototype.translateAllClasses = function () {
                log.debug("Translator", "translateAllClasses(): Iterating DOM");
                var _this = this;
                var count = 0;
                $("body .translate").each(function () {
                    _this.translateSubStringHtmlElement($(this));
                    count++;
                });
                log.debug("Translator", "translateAllClasses(): Done iterating DOM: " + count + " elements processed");
            };

            /**
            * Add string translation
            * @method System.Startup#addTranslation
            * @param {string} str String to translate.
            * @param {string} translation Translation of string.
            */
            Translater.prototype.addTranslation = function (str, translation) {
                this.strings[str.toUpperCase()] = translation;
            };
            return Translater;
        })();
        Utils.Translater = Translater;
    })(System.Utils || (System.Utils = {}));
    var Utils = System.Utils;
})(System || (System = {}));

var translater = new System.Utils.Translater();
var tr = translater;
startup.addPreInit(function () {
    translater.PreInit();
});
//@ sourceMappingURL=Translater.js.map
