var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var SearchController = (function () {
            /**
            SearchController
            @class App.Controllers.SearchController
            @classdesc This class assembles and perform searches
            */
            function SearchController() {
                this.searchCriteria = new App.Models.SearchCriteria();
                this.latestSearchResult = null;
                this.searchProvider = null;
                this.searched = false;
                this._event = $(this);
            }
            /**
            Used to hook up events for when a search is done, for example rendering a view with the new result
            @method App.Controllers.SearchController#addSearchResultCallback
            @public
            */
            SearchController.prototype.addSearchResultCallback = function (searchResultCallback) {
                this._event.on('SearchResult', searchResultCallback);
            };

            /**
            Adds a handler to the gpsProvider when the user's position changes, triggering a new search
            @method App.Controllers.SearchController#Init
            @public
            */
            SearchController.prototype.Init = function () {
                log.debug("SearchController", "Init()");

                var _that = this;
                var searchCriteria = this.searchCriteria;
                gpsProvider.addPositionChangedHandler(function (event, pos) {
                    if (!_that.searched && mapController.mapProvider.map) {
                        log.debug("SearchController", "Doing first search by userpos");
                        searchController.searched = true;
                        searchCriteria.pos(pos);
                        searchController.doSearch();
                        mapController.mapProvider.setCenter(pos, settings.startMapZoomLevel());
                    }
                });

                // Set default values
                this.searchCriteria.radius(settings.startSearchDistance());
                this.searchCriteria.rows(settings.startResultAmount());
                this.searchCriteria.category(settings.startSearchCategory());
            };

            /**
            Performs a new search and adds the searchresult to searchResultCallback
            @method App.Controllers.SearchController#doSearch
            @public
            */
            SearchController.prototype.doSearch = function () {
                if (this.searchProvider)
                    this.searchProvider.haltSearch();
                this.searchProvider = new App.Providers.SearchProvider();

                // Perform search
                var srcb = this.searchResultCallback;
                var _t = this;
                this.searchProvider.search(this.searchCriteria, function (searchResult) {
                    srcb(_t, searchResult);
                }, function (errorMessage) {
                    log.debug("SearchController", errorMessage);
                });
            };

            /**
            Trigger event for renderer listeners
            @method App.Controllers.SearchController#searchResultCallback
            */
            SearchController.prototype.searchResultCallback = function (_this, searchResult) {
                log.debug("SearchController", "Triggering callback events");
                _this.latestSearchResult = searchResult;
                _this._event.trigger('SearchResult', searchResult);
            };
            return SearchController;
        })();
        Controllers.SearchController = SearchController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var searchController = new App.Controllers.SearchController();
startup.addPreInit(function () {
    searchController.Init();
}, "SearchController");
//@ sourceMappingURL=SearchController.js.map
