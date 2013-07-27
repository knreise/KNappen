var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    SearchProviders
    @namespace App.SearchProviders
    */
    (function (SearchProviders) {
        var DataSourceWikiLocation = (function () {
            /**
            DataSourceWikiLocation
            @class App.SearchProviders.DataSourceWikiLocation
            @classdesc This class handles the specific search url and field mapping for the datasource "WikiLocation"
            */
            function DataSourceWikiLocation() {
            }
            /**
            search
            @method App.SearchProviders.DataSourceWikiLocation#search
            @public
            */
            DataSourceWikiLocation.prototype.search = function (searchCriteria, successCallback, errorCallback) {
                log.debug("DataSourceWikiLocation", "Searching");

                if (!searchCriteria.pos() || !searchCriteria.pos().lat() || !searchCriteria.pos().lon()) {
                    log.debug("DataSourceWikiLocation", "Have no pos. Search not possible.");
                    return;
                }

                //var searchUrl = searchCriteria.norvegiana.mkUrl();
                var searchUrl = this.searchCriteriaToDigitalArkivetUrl(searchCriteria);
                log.info("DataSourceWikiLocation", "Search URL: " + searchUrl);
                $.getJSON(searchUrl, function (data) {
                    log.info("DataSourceWikiLocation", "Processing result from: " + searchUrl);
                    var items = data.articles;
                    var retItems = new Array();

                    //id
                    $.each(items, function (objid, o) {
                        var poi = new App.Models.PointOfInterest();
                        poi.source("wikipedia");
                        poi.sourceType("wikipedia");
                        poi.owner("Wikipedia");
                        poi.id(o.id);
                        poi.name(o.title);
                        poi.pos(new System.Models.Position(o.lat, o.lng));
                        poi.link(o.mobileurl || "");
                        poi.tags(o.type || "");
                        poi.ingress("<a href='" + o.mobileurl + "'>" + tr.translate("Wikipedia article") + "</a>");
                        poi.body("");
                        poi.license("");
                        poi.institution("");
                        poi.creator("");
                        poi.year("");
                        poi.categories.push("wikipedia");
                        poi.linkMoreInfo("");
                        poi.landingPage(o.mobileurl);

                        // Add to return
                        retItems.push(poi);
                    });

                    var result = new App.Models.SearchResult();
                    result.numFound(data.total_found);
                    result.items(retItems);

                    // Success callback
                    successCallback(result);
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    errorCallback(errorThrown);
                });
            };

            DataSourceWikiLocation.prototype.searchCriteriaToDigitalArkivetUrl = function (searchCriteria) {
                //return config.webProxy + encodeURIComponent("http://api.wikilocation.org/articles?format=json"
                return "http://api.wikilocation.org/articles?format=json" + "&lat=" + searchCriteria.pos().lat() + "&lng=" + searchCriteria.pos().lon() + "&limit=" + searchCriteria.rows() + "&locale=no" + "&radius=" + (searchCriteria.radius() * 1000) + "&offset=" + (searchCriteria.rows() * (searchCriteria.pageNumber() - 1));
            };
            return DataSourceWikiLocation;
        })();
        SearchProviders.DataSourceWikiLocation = DataSourceWikiLocation;
    })(App.SearchProviders || (App.SearchProviders = {}));
    var SearchProviders = App.SearchProviders;
})(App || (App = {}));
//@ sourceMappingURL=DataSourceWikiLocation.js.map
