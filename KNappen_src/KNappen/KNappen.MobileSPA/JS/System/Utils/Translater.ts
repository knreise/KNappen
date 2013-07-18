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
        }

        /**
          * Translate string
          * @method System.Startup#translate
          * @param {string} str String to translate.
          */
        public translate(str: string): string
        {
            var ucStr: string = str.toUpperCase();
            var translated: string = this.strings[ucStr];
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