/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.SearchProviders
*/
module App.SearchProviders {
    export class DataSourceDigitalarkivetProperty implements App.Providers.ISearchProvider
    {
        /**
            DataSourceDigitalarkivetProperty
            @class App.SearchProviders.DataSourceDigitalarkivetProperty
            @classdesc This class handles the specific search url and field mapping for the datasource "Digitalarkivet"
        */
        constructor() {
        }
    
        /**
            search
            @method App.SearchProviders.DataSourceDigitalarkivetProperty#search
            @public
        */
        public search(searchCriteria: App.Models.SearchCriteria, successCallback: { (searchResult: App.Models.SearchResult): void; }, errorCallback: { (errorMessage: string): void; }) {
            log.debug("DataSourceDigitalarkivetProperty", "Searching");

            if (!searchCriteria.pos() || !searchCriteria.pos().lat() || !searchCriteria.pos().lon())
            {
                log.debug("DataSourceDigitalarkivetProperty", "Have no pos. Search not possible.");
                return;
            }

            //var searchUrl = searchCriteria.norvegiana.mkUrl();
            var searchUrl = this.searchCriteriaToDigitalArkivetUrl(searchCriteria);
            log.info("DataSourceDigitalarkivetProperty", "Search URL: " + searchUrl);
            $.getJSON(searchUrl, function (data) {
                log.info("DataSourceDigitalarkivetProperty", "Processing result from: " + searchUrl);
                var items = data.results;
                var retItems = new Array();
                //autoid efid
                $.each(items, function (objid, o) {
                    var poi = new App.Models.PointOfInterest();
                    poi.source("digitalarkivet");
                    poi.sourceType("fagdata");
                    //poi.id(o.efid);
                    poi.id(o.autoid);
                    poi.name(o.gaardsnavn_gateadr);
                    poi.year(o.hendelsesdato || "");
                    poi.institution(o.kildenavn || "");
                    poi.owner("Digitalarkivet");
                    poi.creator("");
                    poi.landingPage(o.kildeside || "");
                    poi.tags(o.kildetype || "");
                    poi.ingress(o.kildenavn || "");
                    poi.body("");
                    poi.license(o.lisenstype || "");
                    poi.year(o.startaar || "");
                    poi.thumbnail("");
                    // TODO: need confirmation from Kulturrådet what category they want
                    poi.categories.push(config.digitakArkivetPropertyCategory);
                    poi.linkMoreInfo("");


                    // Not much to map logically here, feedback from 
                    // kulturrådet after beta?
                    poi.pos(new System.Models.Position(o.latitude, o.longitude));

                    // Add to return
                    retItems.push(poi);
                });

                var result = new App.Models.SearchResult();
                result.numFound(data.total_found);
                result.items(retItems);

                // Success callback
                successCallback(result);

            }).fail(function (jqXHR, textStatus, errorThrown) { errorCallback(errorThrown); });
                
        }

        private searchCriteriaToDigitalArkivetUrl(searchCriteria: App.Models.SearchCriteria)
        {
            //return config.webProxy + encodeURIComponent("http://api.digitalarkivet.arkivverket.no/v1/census/1910/search_property_geo?"

            return "http://api.digitalarkivet.arkivverket.no/v1/census/1910/search_property_geo?"
                + "latitude=" + searchCriteria.pos().lat()
                + "&longitude=" + searchCriteria.pos().lon()
                + "&presicion=" + (searchCriteria.radius() * 1000)
                + "&limit=" + searchCriteria.rows()
                + "&page=" + searchCriteria.pageNumber();
        }
    }
}