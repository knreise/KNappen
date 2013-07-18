/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.Providers
*/
module App.Providers {

    export class TranslationProviderNB {

        /**
            TranslationProviderNB
            @class App.Providers.TranslationProviderNB
            @classdesc Provides norwegian (bokmål) translation
        */
        constructor() {
        }

        /**
            PreInit adds translation for the selected english words, into norwegian
            @method App.Providers.TranslationProviderNB#PreInit
            @public
        */
        public PreInit() {
            log.debug("TranslationProviderNB", "PreInit()");

            // Add translation for Norsk Bokmål
            translater.addTranslation("TIMEOUT", "Tidsavbrudd");
            translater.addTranslation("TIMEOUT_NORVEGIANA_SEARCH", "Tidsavbrudd ved søk i Norvegiana.");
            translater.addTranslation("TIMEOUT_NORVEGIANA_RETRY", "Forsøker nytt søk...");
            translater.addTranslation("SETTINGS", "Innstillinger");
            translater.addTranslation("SETTINGS_SAVED", "Innstillingene er lagret.");
            translater.addTranslation("UNDEFINED", "Ingen");
            translater.addTranslation("PreCache", "Forhåndslagre");
            translater.addTranslation("Done precaching", "Ferdig med forhåndslagring.");
            translater.addTranslation("DISTANCE", "Avstand");
            translater.addTranslation("GENRE", "Sjanger");
            translater.addTranslation("SUBJECTS", "Emner");
            translater.addTranslation("MEDIATYPES", "Mediatyper");
            translater.addTranslation("SEARCH", "S&oslash;k");
            translater.addTranslation("Number of hits from each datasource", "Antall treff fra hver datakilde");
            translater.addTranslation("Text", "Fritekst");
        }
    }
}

var translationProviderNB = new App.Providers.TranslationProviderNB();
startup.addPreInit(function () { translationProviderNB.PreInit(); }, "TranslationProviderNB");
