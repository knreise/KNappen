/// <reference path="../Startup.ts" />
/// <reference path="../Diagnostics/Log.ts" />
/**
    System utilities
    @namespace System.Utils
*/
module System.Utils
{
    declare var config: any;
    export class Translater
    {
        //public strings: { [index: string]: string; } = {};
        public strings: { [key: string]: string; } = {};
        private regexMatchConf = new RegExp("^CONFIG:(.*)", "i");

        /**
          * Translater
          * @class System.Utils.Translater
          * @classdesc Provides translation service.
          */
        constructor() { }

        public PreInit()
        {
            log.debug("Translator", "PreInit()");
            translater.translateAllClasses();
        }

        /**
          * Translate string
          * @method System.Startup#translate
          * @param {string} str String to translate.
          */
        public translate(str: string, params: any[] = null): string
        {
            var ucStr: string = str.toUpperCase();
            var translated: string = this.strings[ucStr];

            if (params) {
                // Replace {0} {1} etc
                translated = translated.replace(/{([^{}]*)}/g,
                    function (a, b) {
                        var r = params[b];
                        return typeof r === 'string' ? r : a;
                    }
                );
            }

            if (translated) {
                log.verboseDebug("Translater", "Returning translation for key " + ucStr + ": " + translated + "");
                return translated;
            }

            var configVar = this.regexMatchConf.exec(str);
            if (configVar && configVar[1])
            {
                var configVal = config[configVar[1]];
                log.verboseDebug("Translater", "Returning config for translation key " + configVar[0] + ": " + configVal + "");
                return configVal;
            }

            log.error("Translater", "Unable to find translation for: '" + str + "'");
            return str;
        }

        /**
          * Translate substrings
          * @method System.Startup#translateSubString
          * @param {string} str String to translate.
          */
        public translateSubString(str: string): string {
            var _this = this;
            var ret = "";
            ret = str.replace(/\$T\[([^\]]+)\]/, function (fullMatch, match, offset) {
                return _this.translate(match);
            });
            return ret;
        }

        public translateSubStringHtmlElementByName(element: string) {
            var e = $("#" + element);
            this.translateSubStringHtmlElement(e);
        }

        public translateSubStringHtmlElement(element: JQuery) {
            var original = element.html();
            var translated = this.translateSubString(original);
            // Only update DOM if string was modified
            if (original === translated) {
            } else {
                element.html(translated);
            }
        }

        public translateAllClasses() {
            log.debug("Translator", "translateAllClasses(): Iterating DOM");
            var _this = this;
            var count = 0;
            $("body .translate").each(function () {
                _this.translateSubStringHtmlElement($(this));
                count++;
            });
            log.debug("Translator", "translateAllClasses(): Done iterating DOM: " + count + " elements processed");
        }


        /**
          * Add string translation
          * @method System.Startup#addTranslation
          * @param {string} str String to translate.
          * @param {string} translation Translation of string.
          */
        public addTranslation(str: string, translation: string)
        {
            this.strings[str.toUpperCase()] = translation;
        }
    }
}

var translater = new System.Utils.Translater();
var tr = translater;
startup.addPreInit(function () { translater.PreInit(); });