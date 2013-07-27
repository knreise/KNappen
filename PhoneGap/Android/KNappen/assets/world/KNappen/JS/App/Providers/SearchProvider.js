var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Providers
    @namespace App.Providers
    */
    (function (Providers) {
        var SearchProvider = (function () {
            /**
            SearchProvider
            @class App.Providers.SearchProvider
            @classdesc
            */
            function SearchProvider() {
                this.searchHalted = false;
                this.combinedSearchResult = null;
                this.numSearchProviders = 0;
                this.numSearchSuccess = 0;
                this.numSearchError = 0;
                this.successCallback = null;
                this.errorCallback = null;
                this.isSearching = false;
            }
            /**
            Search
            @method App.Providers.SearchProvider#search
            @param {App.Models.SearchCriteria} searchCriteria
            @param {App.Models.SearchResult} searchResult
            @public
            */
            SearchProvider.prototype.search = function (searchCriteria, successCallback, errorCallback) {
                log.debug("SearchProvider", "Searching: DataSourceNorvegiana");

                var _this = this;

                this.combinedSearchResult = new App.Models.SearchResult();
                this.successCallback = successCallback;
                this.errorCallback = errorCallback;
                this.isSearching = true;

                var searchNorvegiana = true;
                var searchDigitalArkivet = true;
                var searchWikipedia = true;

                if (searchCriteria.query() && searchCriteria.query() != "" && searchCriteria.query() != "*" && searchCriteria.query() != "%") {
                    searchDigitalArkivet = false;
                }

                if (searchCriteria.category() && searchCriteria.category().length > 0 && searchCriteria.category()[0] != "*") {
                    if (searchCriteria.category()[0] != config.digitakArkivetPropertyCategory)
                        searchDigitalArkivet = false;
                    searchWikipedia = false;
                }
                if (searchCriteria.mediaType() && searchCriteria.mediaType().length > 0 && searchCriteria.mediaType()[0] != "TEXT" && searchCriteria.mediaType()[0] != "*") {
                    searchDigitalArkivet = false;
                    searchWikipedia = false;
                }
                if (searchCriteria.genre() && searchCriteria.genre().length > 0 && searchCriteria.genre() != "*") {
                    var genre = searchCriteria.genre();
                    if (genre != "fagdata") {
                        searchDigitalArkivet = false;
                        searchNorvegiana = false;
                    }
                    if (genre != "wikipedia")
                        searchWikipedia = false;
                }

                //searchDigitalArkivet = false;
                //searchWikipedia = false;
                this.numSearchProviders = 0;
                if (searchNorvegiana)
                    this.numSearchProviders++;
                if (searchDigitalArkivet)
                    this.numSearchProviders++;
                if (searchWikipedia)
                    this.numSearchProviders++;

                if (this.numSearchProviders == 0) {
                    log.error("SearchProvider", "The given combination of search criterias results in 0 datasources to search.");
                    userPopupController.sendError(tr.translate("No datasources"), tr.translate("Search criteria results in 0 datasources. Try modifying your search."));
                    return;
                }

                setTimeout(function () {
                    _this.checkTimeout();
                }, config.searchTimeoutSeconds * 1000);

                if (searchNorvegiana) {
                    (new App.SearchProviders.DataSourceNorvegiana()).search(searchCriteria, function (searchResult) {
                        log.debug("SearchProvider", "DataSourceNorvegiana: successCallback");
                        _this.successCombine(searchResult);
                    }, function (errorMessage) {
                        log.debug("SearchProvider", "DataSourceNorvegiana: errorCallback: " + errorMessage);
                        _this.errorCombine("Norvegiana", errorMessage);
                    });
                }

                if (searchDigitalArkivet) {
                    (new App.SearchProviders.DataSourceDigitalarkivetProperty()).search(searchCriteria, function (searchResult) {
                        log.debug("SearchProvider", "DataSourceDigitalarkivetProperty: successCallback");
                        _this.successCombine(searchResult);
                    }, function (errorMessage) {
                        log.debug("SearchProvider", "DataSourceDigitalarkivetProperty: errorCallback: " + errorMessage);
                        _this.errorCombine("Digitalarkivet", errorMessage);
                    });
                }

                if (searchWikipedia) {
                    (new App.SearchProviders.DataSourceWikiLocation()).search(searchCriteria, function (searchResult) {
                        log.debug("SearchProvider", "DataSourceWikiLocation: successCallback");
                        _this.successCombine(searchResult);
                    }, function (errorMessage) {
                        log.debug("SearchProvider", "DataSourceWikiLocation: errorCallback: " + errorMessage);
                        _this.errorCombine("Wikipedia", errorMessage);
                    });
                }
            };

            SearchProvider.prototype.haltSearch = function () {
                this.searchHalted = true;
            };

            SearchProvider.prototype.returnSuccess = function () {
                this.sortAndFilterResult(this.combinedSearchResult);
                this.isSearching = false;
                this.haltSearch();
                this.successCallback(this.combinedSearchResult);
            };

            SearchProvider.prototype.successCombine = function (searchResult) {
                this.numSearchSuccess++;
                if (this.searchHalted)
                    return;
                var _this = this;
                $.each(searchResult.items(), function (k, v) {
                    // Set icon to the genre if any, if not use default poi icon
                    var iconGenreStr = v.iconGenreURL();
                    var genre = pointOfInterestTypeProvider.getGenre(v);
                    if (genre)
                        iconGenreStr = genre.icon || v.iconGenreURL();

                    v.iconGenreURL(iconGenreStr);

                    // Set icon to the category if any
                    var iconCategoryStr = v.iconCategoryURL();
                    var category = pointOfInterestTypeProvider.getCategory(v);
                    if (category)
                        iconCategoryStr = category.icon || v.iconCategoryURL();

                    v.iconCategoryURL(iconCategoryStr);

                    // Set icon(s?) to the mediatypes if any
                    var iconMediaTypeStr = v.iconMediaTypeURL();
                    var mediaType = pointOfInterestTypeProvider.getMediaType(v);
                    if (mediaType)
                        iconMediaTypeStr = mediaType.icon || v.iconMediaTypeURL();

                    v.iconMediaTypeURL(iconMediaTypeStr);

                    _this.combinedSearchResult.items.push(v);
                });
                if (searchResult.numFound())
                    this.combinedSearchResult.numFound(0 + parseInt(this.combinedSearchResult.numFound()) + parseInt(searchResult.numFound()));
                if (searchResult.singleMaxNum() < searchResult.numFound()) {
                    searchResult.singleMaxNum(searchResult.numFound());
                }

                if (this.numSearchSuccess + this.numSearchError >= this.numSearchProviders) {
                    this.returnSuccess();
                }
            };

            SearchProvider.prototype.errorCombine = function (source, errorMessage) {
                this.numSearchError++;
                if (this.searchHalted)
                    return;
                if (errorMessage != "Not Found")
                    log.userPopup(tr.translate("Error searching"), tr.translate("Error searching") + " (" + source + "): " + errorMessage);

                if (this.numSearchSuccess + this.numSearchError >= this.numSearchProviders) {
                    this.returnSuccess();
                }
            };

            SearchProvider.prototype.checkTimeout = function () {
                if (this.searchHalted)
                    return;

                if (this.isSearching) {
                    //if (this.numSearchSuccess + this.numSearchError < this.numSearchProviders) {
                    var totalnum = 0 + this.numSearchError + this.numSearchSuccess;
                    log.error("Timeout", "Timeout while searching all datasources: " + totalnum + " of " + this.numSearchProviders + " sources responded so far. Halting search.");
                    log.userPopup(tr.translate("TIMEOUT"), tr.translate("TIMEOUT_SEARCH_TOTAL", [totalnum, this.numSearchProviders]));

                    //}
                    this.returnSuccess();
                }
            };

            SearchProvider.prototype.sortAndFilterResult = function (searchResult) {
                var myLocForSort = null;

                if (gpsProvider.lastPos != null)
                    myLocForSort = new LatLon(gpsProvider.lastPos.lat(), gpsProvider.lastPos.lon());

                if (myLocForSort != null) {
                    $.each(searchResult.items(), function (id, item) {
                        if (item && item.pos() && item.pos().lat() && item.pos().lon()) {
                            var geoLat = new LatLon(item.pos().lat(), item.pos().lon());
                            item.lastKnownDistanceMeter(myLocForSort.distanceTo(geoLat) * 1000.0);
                        }
                    });
                    searchResult.items.sort(this.distanceSortFunction);
                }

                // Chop result
                //searchResult.items = searchResult.items.slice(0, maxLen);
                return searchResult;
            };

            SearchProvider.prototype.distanceSortFunction = function (a, b) {
                return a.lastKnownDistanceMeter() - b.lastKnownDistanceMeter();
            };
            return SearchProvider;
        })();
        Providers.SearchProvider = SearchProvider;
    })(App.Providers || (App.Providers = {}));
    var Providers = App.Providers;
})(App || (App = {}));
//@ sourceMappingURL=SearchProvider.js.map
