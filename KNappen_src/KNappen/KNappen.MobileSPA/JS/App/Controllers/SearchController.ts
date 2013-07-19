/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers
{

    export class SearchController
    {
        /** Somewhere to keep events
          *  @ignore 
          */
        private _event: JQuery;
        public searchCriteria: App.Models.SearchCriteria = new App.Models.SearchCriteria();
        public latestSearchResult: App.Models.SearchResult = null;
        private searchProvider: App.Providers.SearchProvider = null;

        private searched: bool = false;

        /**
            SearchController
            @class App.Controllers.SearchController
            @classdesc This class assembles and perform searches
        */
        constructor()
        {
            this._event = $(this);
        }

        /**
            Used to hook up events for when a search is done, for example rendering a view with the new result
            @method App.Controllers.SearchController#addSearchResultCallback
            @public
        */
        public addSearchResultCallback(searchResultCallback: { (event: JQueryEventObject, searchResult: App.Models.SearchResult): void; })
        {
            this._event.on('SearchResult', searchResultCallback);
        }

        /**
            Adds a handler to the gpsProvider when the user's position changes, triggering a new search
            @method App.Controllers.SearchController#Init
            @public
        */
        public Init()
        {
            log.debug("SearchController", "Init()");

            var _that = this;
            var searchCriteria = this.searchCriteria;
            gpsProvider.addPositionChangedHandler(
                function (event: JQueryEventObject, pos: System.Models.Position) {
                    if (!_that.searched && mapController.mapProvider.map) {
                        log.debug("SearchController", "Doing first search by userpos");
                        searchController.searched = true;
                        searchCriteria.pos(pos);
                        searchController.doSearch();
                        mapController.mapProvider.setCenter(pos, settings.startMapZoomLevel());
                    }
                } 
            );

            // Set default values
            this.searchCriteria.radius(settings.startSearchDistance());
            this.searchCriteria.rows(settings.startResultAmount());
            this.searchCriteria.category(settings.startSearchCategory());
            //this.searchCriteria.genre(settings.startSearchGenre());
            //this.searchCriteria.pos(config.mapStartPos); // Startup pos for first search

            //// Databind settings object         
            //ko.applyBindings(searchCriteria);

            //// Refresh all <select /> because of jQuery Mobile madness (no problem, googling this for 2 hours was fun)
            //$("select.refreshSelectAfterDataBind").each(function (index: any, element: Element) {
            //    $(element).selectmenu('refresh', true);
            //});

        }

        /**
            Performs a new search and adds the searchresult to searchResultCallback
            @method App.Controllers.SearchController#doSearch
            @public
        */
        public doSearch()
        {
            // Create a new searchProvider, disable old if any
            if (this.searchProvider)
                this.searchProvider.haltSearch();
            this.searchProvider = new App.Providers.SearchProvider();

            // Perform search
            var srcb = this.searchResultCallback;
            var _t = this;
            this.searchProvider.search(this.searchCriteria,
                function (searchResult: App.Models.SearchResult) { srcb(_t, searchResult); },
                function (errorMessage) {
                    log.debug("SearchController", errorMessage);
                }
            );
            
            //TODO: Change this..
            //viewController.selectView(settings.startView());
        }

        /**
            Trigger event for renderer listeners
            @method App.Controllers.SearchController#searchResultCallback
        */
        public searchResultCallback(_this: SearchController, searchResult: App.Models.SearchResult)
        {
            log.debug("SearchController", "Triggering callback events");
            _this.latestSearchResult = searchResult;
            _this._event.trigger('SearchResult', searchResult);
        }
    }
}
var searchController = new App.Controllers.SearchController();
startup.addPreInit(function () { searchController.Init(); }, "SearchController");
