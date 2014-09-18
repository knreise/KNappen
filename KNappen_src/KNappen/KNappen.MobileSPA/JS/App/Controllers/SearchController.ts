/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {

    export class SearchController {
        /** Somewhere to keep events
          *  @ignore 
          */
        private _event: JQuery;
        public searchCriteria: App.Models.SearchCriteria = new App.Models.SearchCriteria();
        public latestSearchResult: App.Models.SearchResult = null;
        private searchProvider: App.Providers.SearchProvider = null;

        private firstSearch: boolean = true;

        /**
            SearchController
            @class App.Controllers.SearchController
            @classdesc This class assembles and perform searches
        */
        constructor() {
            this._event = $(this);
        }

        /**
            Used to hook up events for when a search is done, for example rendering a view with the new result
            @method App.Controllers.SearchController#addSearchResultCallback
            @public
        */
        public addSearchResultCallback(searchResultCallback: { (event: JQueryEventObject, searchResult: App.Models.SearchResult, inRoute: boolean): void; }) {
            this._event.on('SearchResult', searchResultCallback);
        }

        /**
            Adds a handler to the gpsProvider when the user's position changes, triggering a new search
            @method App.Controllers.SearchController#Init
            @public
        */
        public postInit() {
            log.debug("SearchController", "postInit()");
            var searchCriteria = this.searchCriteria;
            gpsProvider.addPositionChangedHandler((event: JQueryEventObject, pos: System.Models.Position) => {
                if (this.firstSearch) {
                    log.debug("SearchController", "Doing first search by users positions");
                    searchController.firstSearch = false;
                    searchCriteria.pos(pos);
                    searchController.doNewSearch();
                }
            });

            this.searchCriteria.radius(settings.startSearchDistance());
            this.searchCriteria.rows(settings.startResultAmount());
            this.searchCriteria.category(settings.startSearchCategory());
        }

        /**
            Performs a new search, by resetting the page count, and adds the searchresult to searchResultCallback
            @method App.Controllers.SearchController#doNewSearch
            @public
        */
        public doNewSearch() {

            if (!this.searchCriteria.pos()) {
                this.searchCriteria.pos(config.mapStartPos);
            }
            
            this.searchCriteria.pageNumber(1);

            // Create a new searchProvider, disable old if any
            if (this.searchProvider) {
                this.searchProvider.haltSearch();
            }

            this.searchProvider = new App.Providers.SearchProvider(this.searchCriteria, (searchResult: App.Models.SearchResult) => {
                this.searchResultCallback(this, searchResult);
            });

            // Perform search
            if (networkHelper.isConnected()) {
                loadingScreenController.showLoadingScreen("");
                this.searchProvider.search(this.searchCriteria.pageNumber());
            } else {
                networkHelper.displayNetworkError();
            }
        }

        /**
            Performs a new search and adds the searchresult to searchResultCallback
            @method App.Controllers.SearchController#doSearch
            @public
        */
        public doSearch() {
            loadingScreenController.showLoadingScreen("");
            setTimeout(() => this.searchProvider.search(this.searchCriteria.pageNumber()), 25);
        }

        /**
            Trigger event for renderer listeners
            @method App.Controllers.SearchController#searchResultCallback
        */
        public searchResultCallback(that: SearchController, searchResult: App.Models.SearchResult, inRoute: boolean = false) {
            log.debug("SearchController", "Triggering callback events");
            that.latestSearchResult = searchResult;
            that._event.trigger('SearchResult', [searchResult, inRoute]);
            loadingScreenController.hideLoadingScreen();
        }
    }
}
var searchController = new App.Controllers.SearchController();
startup.addPostInit(() => { searchController.postInit(); }, "SearchController");
