/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.Providers
*/
module App.Providers {

    export class LazyLoadHandle {
        
        private lazyLoadCount: number = 0;
        private successCallback: () => void;

        constructor(successCallback: () => void ) {
            this.successCallback = successCallback;
        }

        public isLoading(): boolean {
            return this.lazyLoadCount > 0;
        }

        public lazyLoadStarted(): void {
            this.lazyLoadCount++;
        }

        public lazyLoadComplete(): void {
            this.lazyLoadCount--;

            if (this.lazyLoadCount == 0) {
                this.successCallback();
            }
        }
    }

    export interface SearchSuccessCallback {
        (searchContext: SearchHandle): void;
    }

    export interface SearchErrorCallback {
        (errorMessage: string, searchContext: SearchHandle): void;
    }

    export class SearchHandle {

        public haltet: boolean = false;
        public searchCount: number = 0;
        public searchStatus: { [sourceName: string]: boolean; } = {};
    }

    export class PoiChooser {
        public poi: App.Models.PointOfInterest = null;
        public choose: () => void;
    }

    export class SearchProvider {

        public static SourceDigitalArkivet: string = "Digitalarkivet";
        public static SourceNorvegiana: string = "Norvegiana";
        public static SourceWikipedia: string = "Wikipedia";

        private pageNumber: number;
        private pageSize: number;

        private searchNorvegiana: boolean = true;
        private searchDigitalArkivet: boolean = true;
        private searchWikipedia: boolean = true;

        private successCallback: { (searchResult: App.Models.SearchResult): void; } = null;

        private searchProviderNorvegiana: App.SearchProviders.DataSourceNorvegiana;
        private searchProviderDigitalarkivet: App.SearchProviders.DataSourceDigitalarkivetProperty;
        private searchProviderWikipedia: App.SearchProviders.DataSourceWikiLocation;

        private currentSearch: SearchHandle = null;

        private resultCount: number = -1;
        private results: Array<App.Models.PointOfInterest> = new Array<App.Models.PointOfInterest>();

        /**
            SearchProvider
            @class App.Providers.SearchProvider
            @classdesc
        */
        constructor(searchCriteria: App.Models.SearchCriteria, successCallback: { (searchResult: App.Models.SearchResult): void; }) {

            this.pageNumber = 1;
            this.pageSize = searchCriteria.rows();
            this.successCallback = successCallback;

            var norvegianaQueryFields: string = null;
            
            if (searchCriteria.category() && searchCriteria.category().length > 0 && searchCriteria.category() != "*") {
                var category = searchCriteria.category();
                if (category == config.digitalArkivetPropertyCategory) {
                    this.searchNorvegiana = false;
                    this.searchWikipedia = false;
                } else if (category == config.wikiPropertyCategory) {
                    this.searchNorvegiana = false;
                    this.searchDigitalArkivet = false;
                } else {
                    this.searchWikipedia = false;
                    this.searchDigitalArkivet = false;
                }
            }

            if (searchCriteria.mediaType() && searchCriteria.mediaType().length > 0 && searchCriteria.mediaType() != "*") {
                var mediaType = searchCriteria.mediaType();
                if (mediaType != "TEXT") {
                    this.searchDigitalArkivet = false;
                    this.searchWikipedia = false;
                }
            }

            if (searchCriteria.genre() && searchCriteria.genre().length > 0 && searchCriteria.genre() != "*") {
                var genre = searchCriteria.genre();
                if (genre == "wikipedia") {
                    this.searchNorvegiana = false;
                    this.searchDigitalArkivet = false;
                } else if (genre == "digitaltfortalt") {
                    this.searchWikipedia = false;
                    this.searchDigitalArkivet = false;

                    norvegianaQueryFields = 'abm_contentProvider_text:"Digitalt fortalt"'
                    + ' OR abm_contentProvider_text:Industrimuseum';

                } else if (genre == "fagdata") {
                    this.searchWikipedia = false;

                    norvegianaQueryFields = 'abm_contentProvider_text:Artsdatabanken'
                    + ' OR abm_contentProvider_text:DigitaltMuseum'
                    + ' OR abm_contentProvider_text:Kulturminnesøk'
                    + ' OR abm_contentProvider_text:MUSIT'
                    + ' OR abm_contentProvider_text:Naturbase'
                    + ' OR abm_contentProvider_text:"Sentralt stedsnavnregister"';
                }
            }

            if (this.searchNorvegiana) {
                this.searchProviderNorvegiana = new App.SearchProviders.DataSourceNorvegiana(searchCriteria, norvegianaQueryFields,
                    (searchHandle: SearchHandle) => this.searchWithSuccess(SearchProvider.SourceNorvegiana, searchHandle),
                    (errorMessage: string, searchHandle: SearchHandle) => this.searchWithError(SearchProvider.SourceNorvegiana ,errorMessage, searchHandle));
            }

            if (this.searchDigitalArkivet) {
                this.searchProviderDigitalarkivet = new App.SearchProviders.DataSourceDigitalarkivetProperty(searchCriteria,
                    (searchHandle: SearchHandle) => this.searchWithSuccess(SearchProvider.SourceDigitalArkivet, searchHandle),
                    (errorMessage: string, searchHandle: SearchHandle) => this.searchWithError(SearchProvider.SourceDigitalArkivet, errorMessage, searchHandle));
            }

            if (this.searchWikipedia) {
                this.searchProviderWikipedia = new App.SearchProviders.DataSourceWikiLocation(searchCriteria,
                    (searchHandle: SearchHandle) => this.searchWithSuccess(SearchProvider.SourceWikipedia, searchHandle),
                    (errorMessage: string, searchHandle: SearchHandle) => this.searchWithError(SearchProvider.SourceWikipedia, errorMessage, searchHandle));
            }
        }

        public haltSearch() {
            if (this.currentSearch != null) {
                this.currentSearch.haltet = true;
            }
        }

        public search(pageNumber: number) {
            
            var searchHandle = new SearchHandle();

            this.pageNumber = pageNumber;
            this.currentSearch = searchHandle;
            
            log.debug("SearchProvider", "Searching...");

            if (this.searchNorvegiana) {
                searchHandle.searchStatus[SearchProvider.SourceNorvegiana] = true;
                if (this.searchProviderNorvegiana.search(searchHandle)) {
                    searchHandle.searchCount++;
                }
            }

            if (this.searchDigitalArkivet) {
                searchHandle.searchStatus[SearchProvider.SourceDigitalArkivet] = true;
                if (this.searchProviderDigitalarkivet.search(searchHandle)) {
                    searchHandle.searchCount++;
                }
            }

            if (this.searchWikipedia) {
                searchHandle.searchStatus[SearchProvider.SourceWikipedia] = true;
                if (this.searchProviderWikipedia.search(searchHandle)) {
                    searchHandle.searchCount++;
                }
            }

            if (searchHandle.searchCount > 0) {
                setTimeout(() => this.checkTimeout(searchHandle), config.searchTimeoutSeconds * 1000);
            }
            else {
                this.prepareSearchResult();
            }
        }

        private prepareSearchResult() {

            this.haltSearch();

            if (this.resultCount == -1) {
                this.resultCount = 0;

                if (this.searchNorvegiana)
                    this.resultCount += this.searchProviderNorvegiana.getResultCount();
                if (this.searchDigitalArkivet)
                    this.resultCount += this.searchProviderDigitalarkivet.getResultCount();
                if (this.searchWikipedia)
                    this.resultCount += this.searchProviderWikipedia.getResultCount();
            }

            var start = this.pageSize * (this.pageNumber - 1);
            var end = Math.min(start + this.pageSize, this.resultCount);

            while (this.results.length < end) {
                var poiChooser = new PoiChooser();

                if (this.searchNorvegiana)
                    this.searchProviderNorvegiana.getNextPoi(poiChooser);
                if (this.searchDigitalArkivet)
                    this.searchProviderDigitalarkivet.getNextPoi(poiChooser);
                if (this.searchWikipedia)
                    this.searchProviderWikipedia.getNextPoi(poiChooser);

                poiChooser.choose();

                this.results.push(poiChooser.poi);
            }

            var pageItems = this.results.slice(start, end);

            var searchResult = new App.Models.SearchResult();
            searchResult.items(pageItems);
            searchResult.numFound(this.resultCount);
            searchResult.numPages(Math.ceil(this.resultCount / this.pageSize));

            this.ensureLoadedResultSetAndSignalSuccess(searchResult);
        }

        private ensureLoadedResultSetAndSignalSuccess(searchResult: App.Models.SearchResult) {
            var items = searchResult.items();
            var lazyLoadHandle = new LazyLoadHandle(() => this.successCallback(searchResult));

            for (var index in items) {
                items[index].ensureLoaded(lazyLoadHandle);
            }

            if (!lazyLoadHandle.isLoading()) {
                this.successCallback(searchResult);
            }
        }

        private searchWithSuccess(searchProviderName: string, searchHandle: SearchHandle): void {
            log.debug("SearchProvider", "successCallback - " + searchProviderName);

            if (searchHandle == null || searchHandle.haltet) {
                return;
            }

            searchHandle.searchStatus[searchProviderName] = false;
            searchHandle.searchCount--;

            if (searchHandle.searchCount == 0) {
                this.prepareSearchResult();
            }
        }

        private searchWithError(searchProviderName: string, errorMessage: string, searchHandle: SearchHandle): void {
            log.error("SearchProvider", "errorCallback - " + searchProviderName + " - " + errorMessage);

            if (searchHandle == null || searchHandle.haltet) {
                return;
            }

            searchHandle.searchCount--;

            if (!networkHelper.isConnected()) {
                networkHelper.displayNetworkError();
                return;
            }

            if (errorMessage != "Not Found") {
                userPopupController.sendError(tr.translate("Error searching"), tr.translate("Error searching") + " (" + searchProviderName + ")");
            }

            if (searchHandle.searchCount == 0) {
                this.prepareSearchResult();
            }
        }

        private checkTimeout(searchHandle: SearchHandle): void {

            if (searchHandle == null || searchHandle.haltet) {
                return;
            }

            var errorSourceString = "";

            for (var source in searchHandle.searchStatus) {
                if (searchHandle.searchStatus[source]) {
                    errorSourceString += (errorSourceString == "" ? "" : ", ");
                    errorSourceString += source;
                }
            }

            log.error("Timeout", "Timeout while searching all datasources: Halting search.");
            userPopupController.sendError(tr.translate("Search"), tr.translate("Some sources did not return content in time", [errorSourceString]));
            this.prepareSearchResult();
        }
    }
}