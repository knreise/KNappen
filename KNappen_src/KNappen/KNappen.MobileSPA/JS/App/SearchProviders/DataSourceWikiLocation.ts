/// <reference path="../_References.ts" />

/**
    SearchProviders
    @namespace App.SearchProviders
*/
module App.SearchProviders {
    export class DataSourceWikiLocation extends DataSource {

        private searchPosition: System.Models.Position;
        private searchRadius: number;
        private searchTitle: string;

        private searchDone: boolean = false;

        /**
            DataSourceWikiLocation
            @class App.SearchProviders.DataSourceWikiLocation
            @classdesc This class handles the specific search url and field mapping for the datasource "WikiLocation"
        */
        constructor(searchCriteria: App.Models.SearchCriteria, successCallback: App.Providers.SearchSuccessCallback, errorCallback: App.Providers.SearchErrorCallback) {

            super(searchCriteria.rows(), successCallback, errorCallback);

            this.searchPosition = searchCriteria.pos();
            this.searchRadius = (searchCriteria.radius() * 1000);
            this.searchTitle = DataSourceWikiLocation.getSearchTitle(searchCriteria);
        }

        public search(context: App.Providers.SearchHandle): boolean {

            if (this.searchDone) {
                return false;
            }

            var self = this;
            this.searchDone = true;

            log.debug("DataSourceWikiLocation", "Searching");
            var searchUrl = DataSourceWikiLocation.getSearchUrl(this.searchPosition, this.searchRadius, this.searchTitle);

            log.info("DataSourceWikiLocation", "Search URL: " + searchUrl);
            $.getJSON(searchUrl, function (data) {
                log.info("DataSourceWikiLocation", "Processing result from: " + searchUrl);
                var items = data.articles;

                for (var i in items)
                {
                    var o = items[i];
                    var poi = new App.Models.PointOfInterest();
                    poi.source("wikipedia");
                    poi.sourceType("wikipedia");
                    poi.owner("Wikipedia");
                    poi.id(o.id);
                    poi.name(o.title);
                    poi.pos(new System.Models.Position(o.lat, o.lng));
                    poi.tags(o.type || "");
                    poi.body("");
                    poi.license("");
                    poi.institution("");
                    poi.creator("");
                    poi.year("");
                    poi.categories.push(config.wikiPropertyCategory);
                    poi.mediaTypes.push("TEXT");
                    poi.originalVersion(o.mobileurl || "");
                    
                    var distance = distanceTool.GetDistanceFromLatLon(poi.pos(), self.searchPosition);
                    poi.distance(distance);
                    poi.distanceInKm(distance.toFixed(2) + "km");

                    poi.lazyLoadData = DataSourceWikiLocation.searchCriteriaToSingleMediawikiUrl(o.id.toString());
                    poi.lazyLoad = DataSourceWikiLocation.searchMediaWiki;

                    poi.ingress("");

                    poi.updateIcons();

                    self.addPoi(poi);
                }

                self.setResultCount(items.length);
                self.raiseSuccess(context);

            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                self.raiseError(errorThrown, context);
            });

            return true;
        }

        private static searchMediaWiki(poi: App.Models.PointOfInterest, searchUrl: string, lazyLoadHandle: App.Providers.LazyLoadHandle): void {
            lazyLoadHandle.lazyLoadStarted();

            $.ajax({
                url: searchUrl,
                dataType: 'json',
                success: function (data) {
                    var items = data.query.pages;
                    for (var i in items) {
                        var item = items[i];
                        poi.description(item.extract || "");
                    }

                    lazyLoadHandle.lazyLoadComplete();

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    lazyLoadHandle.lazyLoadComplete();
                }
            }); 
        }

        private static searchCriteriaToSingleMediawikiUrl(wikiId: string): string {
            return config.webProxy + encodeURIComponent("http://no.wikipedia.org/w/api.php?action=query"
                + "&pageids=" + wikiId
                + "&prop=extracts&explaintext&exintro&format=json");
        }

        private static getSearchUrl(searchPosition: System.Models.Position, searchRadius: number, searchTitle: string) {
            return "http://api.wikilocation.org/articles?format=json"
                + "&lat=" + searchPosition.lat()
                + "&lng=" + searchPosition.lon()
                + "&limit=" + config.searchLimitWikiLocation
                + "&locale=no"
                + "&radius=" + searchRadius
                + "&offset=" + 0
                + searchTitle;
        }

        private static getSearchTitle(searchCriteria: App.Models.SearchCriteria): string {
            var title = "";

            if (searchCriteria.query() && searchCriteria.query() != "" && searchCriteria.query() != "*" && searchCriteria.query() != "%") {
                var query = searchCriteria.query();
                query = query.trim();
                query = query.replace("%", "");
                query = query.replace("*", "");

                query = encodeURI(query);

                title = "&title=" + query;
            }

            return title;
        }
    }
}