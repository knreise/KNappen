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
            translater.addTranslation("Search text", "Søk etter tekst");
            translater.addTranslation("TIMEOUT", "Tidsavbrudd");
            translater.addTranslation("TIMEOUT_SEARCH_TOTAL", "Tidsavbrudd ved søk i: {0} av {1} kilder har returnert svar.");
            translater.addTranslation("TIMEOUT_NORVEGIANA_SEARCH", "Tidsavbrudd ved søk i Norvegiana.");
            translater.addTranslation("TIMEOUT_NORVEGIANA_RETRY", "Forsøker nytt søk...");
            translater.addTranslation("SETTINGS", "Oppstartsinnstillinger");
            translater.addTranslation("SETTINGS_SAVED", "Innstillingene er lagret.");
            translater.addTranslation("UNDEFINED", "Ingen");
            translater.addTranslation("PreCache", "Forhåndslagre");
            translater.addTranslation("Done precaching", "Ferdig med forhåndslagring.");
            translater.addTranslation("DISTANCE", "Avstand");
            translater.addTranslation("GENRE", "Sjanger");
            translater.addTranslation("SUBJECTS", "Kategorier");
            translater.addTranslation("MEDIATYPES", "Medietyper");
            translater.addTranslation("SEARCH", "S&oslash;k");
            translater.addTranslation("Some sources did not return content in time", "Noen av kildene leverte ikke innhold i tide: {0}");
            translater.addTranslation("Number of hits from each datasource", "Antall treff");
            translater.addTranslation("Text", "Fritekst");
            translater.addTranslation("Recommended", "Anbefalte");
            translater.addTranslation("User defined", "Egendefinerte");
            translater.addTranslation("Startup settings", "Oppstartsinnstillinger");
            translater.addTranslation("PlaceSearch", "Sted");
            translater.addTranslation("Adminpassword", "Adminpassord");
            translater.addTranslation("Start view", "Oppstartsvisning");
            translater.addTranslation("Default number of hits from each datasource", "Antall treff");
            translater.addTranslation("Default search distance", "Avstand");
            translater.addTranslation("Default map type", "Karttype");
            translater.addTranslation("Default zoom level", "Detaljeringsnivå kart");
            translater.addTranslation("Default category", "Kategori");
            translater.addTranslation("Functional error", "Funksjonelle feil");
            translater.addTranslation("Comment on content", "Kommentar til innhold");
            translater.addTranslation("Your email address", "Din e-post (valgfritt)");
            translater.addTranslation("Send feedback", "Send tilbakemelding");
            translater.addTranslation("Cancel", "Avbryt");
            translater.addTranslation("Create", "Opprett");
            translater.addTranslation("Create route", "Opprett rute");
            translater.addTranslation("Create route from search", "Opprett rute fra s&oslash;k");
            translater.addTranslation("POI added", "Lagt til");
            translater.addTranslation("POI added to route", "Interessepunkt lagt til rute");
            translater.addTranslation("POI not added", "Ikke lagt til");
            translater.addTranslation("POI already exists", "Interessepunkt er allerede lagt til");
            translater.addTranslation("Add a new route or select one from the dropdown", "Legg til ny rute eller velg en fra nedtreksfeltet");
            translater.addTranslation("Description", "Beskrivelse");
            translater.addTranslation("More information", "Mer informasjon");
            translater.addTranslation("Map", "Kart");
            translater.addTranslation("Camera", "Kameravisning");
            translater.addTranslation("List", "Liste");
            translater.addTranslation("Routes", "Ruter");
            translater.addTranslation("Search", "Søk");
            translater.addTranslation("Settings", "Innstillinger");
            translater.addTranslation("Feedback", "Tilbakemelding");
            translater.addTranslation("About", "Om");
            translater.addTranslation("Debug log", "Debug log");
            translater.addTranslation("Map", "Kart");
            translater.addTranslation("Wikipedia article", "Artikkel på Wikipedia");
            translater.addTranslation("No datasources", "Ingen datakilder");
            translater.addTranslation("Search criteria results in 0 datasources. Try modifying your search.", "S&oslash;kekriteriene angitt gir 0 datakilder. Pr&oslash;v &aring; endre s&oslash;kekriterier.");
            translater.addTranslation("Error searching", "Feil ved søk");
            translater.addTranslation("Route created", "Rute opprettet");
            translater.addTranslation("The route '{0}' was created.", "Ruten '{0}' ble opprettet.");
            translater.addTranslation("ROUTE_DELETED", "Rute slettet");
            translater.addTranslation("ROUTE_DELETED_MSG", "Ruten er nå slettet");
            translater.addTranslation("ROUTE_NOT_ADDED", "Rute ikke lagt til");
            translater.addTranslation("ROUTE_NOT_ADDED_MSG", "Allerede en rute med det navnet");
            translater.addTranslation("Follow route", "F&oslash;lg rute");
            translater.addTranslation("Edit", "Rediger");
            translater.addTranslation("Published", "Publisert");
            translater.addTranslation("The route has been published.", "Ruten har blitt publisert.");
            translater.addTranslation("Not published", "Ikke publisert");
            translater.addTranslation("The route has not been published.", "Ruten ble ikke publisert.");
            translater.addTranslation("Delete", "Slett");
            translater.addTranslation("NumberOfSearchResultHits", "Viser {0} av {1} treff");
            translater.addTranslation("PagesInSearchResult", "{0} av {1}");
            translater.addTranslation("Subjects", "Kategorier");
            translater.addTranslation("Topic", "Emner");
            translater.addTranslation("Dating", "Datering");
            translater.addTranslation("Source", "Kilde");
            translater.addTranslation("Original version", "Original versjon");
            translater.addTranslation("Creator", "Opphavsperson");
            translater.addTranslation("License", "Lisens");
            translater.addTranslation("References", "Referanser");
            translater.addTranslation("External links", "Eksterne lenker");
            translater.addTranslation("Search for place", "S&oslash;k i stedsnavn");
            translater.addTranslation("My position", "Min posisjon");
            translater.addTranslation("Zoom in", "Zoom inn");
            translater.addTranslation("Zoom out", "Zoom ut");
            translater.addTranslation("Change map layer", "Bytt kartlag");
            translater.addTranslation("Feedback sent", "Tilbakemelding sendt.");
            translater.addTranslation("Error sending feedback", "Feil ved sending av tilbakemelding.");
            translater.addTranslation("Missing field feedback message", "Vennligst fyll inn beskjed.");
            translater.addTranslation("Missing field", "Tomt felt");
            translater.addTranslation("Loading", "Laster");
            translater.addTranslation("Buffering...", "Mellomlagrer...");
            translater.addTranslation("Name of new route", "Navn p&aring; ny rute");
            translater.addTranslation("Disable caching", "Sl&aring; av mellomlagring");
            translater.addTranslation("Clear cache", "T&oslash;m mellomlagring");
            translater.addTranslation("Cache", "Mellomlagring");
            translater.addTranslation("Cache cleared", "Mellomlagring t&oslash;mt");
            translater.addTranslation("Save", "Lagre");
            translater.addTranslation("Message", "Beskjed");
            translater.addTranslation("LoadingScreen", "Laster inn...");
            translater.addTranslation("ROUTE_DOWNLOAD_SUCCESS", "Rute nedlastet");
            translater.addTranslation("ROUTE_DOWNLOAD_SUCCESS_MSG", "Ruten '{0}' ble nedlastet.");
            translater.addTranslation("ROUTE_DOWNLOAD_FAILURE", "Nedlastning feilet");
            translater.addTranslation("ROUTE_DOWNLOAD_FAILURE_MSG", "Ruten '{0}' kunne ikke bli lastet ned.");
            translater.addTranslation("Cache result", "Lagre resultat");
            translater.addTranslation("Network", "Nettverk");
            translater.addTranslation("No connection", "Ingen internettilgang");

            startup.finishedLoad("TranslationProviderNB");
        }
    }
}

var translationProviderNB = new App.Providers.TranslationProviderNB();
startup.addLoad(function () { translationProviderNB.Load(); }, "TranslationProviderNB");
