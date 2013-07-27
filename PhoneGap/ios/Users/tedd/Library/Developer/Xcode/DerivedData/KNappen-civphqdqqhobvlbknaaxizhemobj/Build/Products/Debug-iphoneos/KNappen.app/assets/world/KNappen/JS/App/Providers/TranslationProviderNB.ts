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
        public Load() {
            log.debug("TranslationProviderNB", "Load()");

            // Add translation for Norsk Bokmål
            translater.addTranslation("TIMEOUT", "Tidsavbrudd");
            translater.addTranslation("TIMEOUT_SEARCH_TOTAL", "Tidsavbrudd ved søk i: {0} av {1} kilder har returnert svar.");
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
            translater.addTranslation("Recommended", "Anbefalte");
            translater.addTranslation("User defined", "Egendefinerte");
            translater.addTranslation("Startup settings", "Oppstartsinnstillinger");
            translater.addTranslation("Adminpassword", "Adminpassord");
            translater.addTranslation("Start view", "Oppstartsvisning");
            translater.addTranslation("Default number of results", "Standard antall resultater fra hver datakilde");
            translater.addTranslation("Default search distance", "Standard avstand i s&oslash;k");
            translater.addTranslation("Default map type", "Standard karttype");
            translater.addTranslation("Default zoom level", "Standard zoomnivå i kart");
            translater.addTranslation("Functional error", "Funksjonelle feil");
            translater.addTranslation("Comment on content", "Kommentar til innhold");
            translater.addTranslation("Your email address", "Din e-post (valgfritt)");
            translater.addTranslation("Send feedback", "Send tilbakemelding");
            translater.addTranslation("Create", "Opprett");
            translater.addTranslation("Create route", "Opprett rute");
            translater.addTranslation("Create route from search", "Opprett rute fra s&oslash;k");
            translater.addTranslation("Description", "Beskrivelse");
            translater.addTranslation("More information", "Mer informasjon");
            translater.addTranslation("Map", "Kart");
            translater.addTranslation("Camera", "Kameravisning");
            translater.addTranslation("List", "Liste");
            translater.addTranslation("Routes", "Ruter");
            translater.addTranslation("Search", "S&oslash;k");
            translater.addTranslation("Settings", "Innstillinger");
            translater.addTranslation("Feedback", "Tilbakemelding");
            translater.addTranslation("About", "Om appen");
            translater.addTranslation("Debug log", "Debug log");
            translater.addTranslation("Map", "Kart");
            translater.addTranslation("Wikipedia article", "Artikkel på Wikipedia");
            translater.addTranslation("No datasources", "Ingen datakilder");
            translater.addTranslation("Search criteria results in 0 datasources. Try modifying your search.", "S&oslash;kekriteriene angitt gir 0 datakilder. Pr&oslash;v &aring; endre s&oslash;kekriterier.");
            translater.addTranslation("Error searching", "Feil ved søk");
            translater.addTranslation("Route created", "Rute opprettet");
            translater.addTranslation("The route '{0}' was created.", "Ruten '{0}' ble opprettet.");
            translater.addTranslation("Follow route", "F&oslash;lg rute");
            translater.addTranslation("Edit", "Rediger");
            translater.addTranslation("Published", "Publisert");
            translater.addTranslation("The route has been published.", "Ruten har blitt publisert.");
            translater.addTranslation("Not published", "Ikke publisert");
            translater.addTranslation("The route has not been published.", "Ruten ble ikke publisert.");
            translater.addTranslation("Delete", "Slett");
            translater.addTranslation("{0} hits found", "{0} treff funnet");
            translater.addTranslation("Subjects", "Emneord");
            translater.addTranslation("Dating", "Datering");
            translater.addTranslation("Source", "Kilde");
            translater.addTranslation("Original version", "Original versjon");
            translater.addTranslation("Creator", "Opphavsperson");
            translater.addTranslation("License", "Lisens");
            translater.addTranslation("External links", "Eksterne lenker");
            translater.addTranslation("Search for place", "S&oslash;k i stedsnavn");
            translater.addTranslation("My position", "Min posisjon");
            translater.addTranslation("Zoom in", "Zoom inn");
            translater.addTranslation("Zoom out", "Zoom ut");
            translater.addTranslation("Change map layer", "Bytt kartlag");
            translater.addTranslation("Feedback sent", "Tilbakemelding sendt.");
            translater.addTranslation("Error sending feedback", "Feil ved sending av tilbakemelding.");
            translater.addTranslation("Loading", "Laster");
            translater.addTranslation("Buffering...", "Mellomlagrer...");
            translater.addTranslation("Name of new route", "Navn p&aring; ny rute");

        }
    }
}

var translationProviderNB = new App.Providers.TranslationProviderNB();
startup.addLoad(function () { translationProviderNB.Load(); }, "TranslationProviderNB");
