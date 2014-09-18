/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.SearchProviders
*/
module App.SearchProviders {

    export class DataSourceNorvegiana extends DataSource {

        private searchPosition: System.Models.Position;
        private searchRadius: number;
        private searchText: string;
        private searchCategory: string;
        private searchMediaType: string;
        private searchQueryFields: string = null;

        private searchStart: number;
        private searchCount: number;

        /**
            DataSourceNorvegiana
            @class App.SearchProviders.DataSourceNorvegiana
            @classdesc This class handles the specific search url and field mapping for the datasource "Norvegiana" 
        */
        constructor(searchCriteria: App.Models.SearchCriteria, queryFields: string, successCallback: App.Providers.SearchSuccessCallback, errorCallback: App.Providers.SearchErrorCallback) {

            super(searchCriteria.rows(), successCallback, errorCallback);

            this.searchPosition = searchCriteria.pos();
            this.searchRadius = searchCriteria.radius();
            this.searchText = searchCriteria.query();
            this.searchCategory = searchCriteria.category();
            this.searchMediaType = searchCriteria.mediaType();
            this.searchQueryFields = queryFields;

            this.searchStart = 1;
            this.searchCount = searchCriteria.rows() * config.searchCountMultiplier;
        }

        public search(searchHandle: App.Providers.SearchHandle): boolean {
            
            if (this.searchNotNeeded(this.searchStart)) {
                return false;
            }
            log.debug("DataSourceNorvegiana", "Searching");
            var searchUrl = this.searchCriteriaNorgevianaToUrl();

            log.info("DataSourceNorvegiana", "Search URL: " + searchUrl);
            $.getJSON(searchUrl, data => {
                    log.info("DataSourceNorvegiana", "Processing result from: " + searchUrl);

                    var items = data.result.items;
                
                    for (var i in items) {
                        var object = items[i];
                        var p = object.item.fields;


                        var poi = new App.Models.PointOfInterest();
                        poi.source("norvegiana");
                        if (p.abm_contentProvider && (p.abm_contentProvider == "Digitalt fortalt" || p.abm_contentProvider == "Industrimuseum")) {
                            poi.sourceType("digitaltfortalt");
                        }
                        else {
                            poi.sourceType("fagdata");
                        }
                        
                        var pos = this.createPosition(p);
                        poi.pos(pos);
                    
                        var poiDescription = this.createPoiDescription(p.dc_description);
                        poi.description(poiDescription);

                        poi.id(p.delving_hubId[0]);
                        poi.name(p.dc_title);
                        poi.link(p.dc_identifier || "");
                        
                        poi.thumbnail(p.abm_imageUri || "");
                        poi.year(p.dc_date || "");
                        poi.ingress(p.abm_introduction || "");
                        poi.license(p.europeana_rights || "");

                        var tags = p.dc_subject;
                        if (tags)
                            tags = tags.join(", ");

                        poi.topics(tags || "");
                        poi.categories(p.abm_category || "");
                        poi.institution(p.europeana_dataProvider || "");
                        poi.owner(p.abm_contentProvider || "");
                        poi.creator(p.dc_creator || "");

                        // References
                        if (p.dcterms_references) {
                            for (var index in p.dcterms_references) {
                                var referenceText: string = p.dcterms_references[index];
                                if (stringUtils.startsWith(referenceText.toLowerCase(), "http://")) {
                                    referenceText = "<a class='external' href='" + referenceText + "'>" + referenceText + "</a>";
                                }
                                poi.references(poi.references() + referenceText + "<br />");
                            }
                        }
                        else {
                            poi.references("");
                        }

                        poi.originalVersion(p.europeana_isShownAt || "");

                        for (var i in p.europeana_type) {
                            poi.mediaTypes.push(p.europeana_type[i]);
                        }

                        poi.soundUri(p.abm_soundUri || []);

                        poi.videoUri(p.abm_videoUri || []);

                        var distance = distanceTool.GetDistanceFromLatLon(poi.pos(), this.searchPosition);
                        poi.distance(distance);
                        poi.distanceInKm(distance.toFixed(2) + "km"); 

                        poi.updateIcons();
                        
                        this.addPoi(poi);
                    }

                    this.searchStart += this.searchCount;
                    this.setResultCount(parseInt(data.result.query.numfound));
                    this.raiseSuccess(searchHandle);
                })
            .fail((jqXHR, textStatus, errorThrown) => {
                this.raiseError(errorThrown, searchHandle);
            });

            return true;
        }

        private createPosition(fields: any): System.Models.Position {
            var pos = null;
            var latlon = fields.abm_geo;

            if (latlon == null)
                latlon = fields.abm_latLong;

            if (latlon != null) {
                latlon = latlon[0].toString().split(',');
                var poilat = latlon[0];
                var poilon = latlon[1];
                pos = new System.Models.Position(poilat, poilon);
            }

            return pos;
        }


        private createPoiDescription(norvegianaDescription: Array): string {
            if (!norvegianaDescription)
                return "";
            
            var poiDescription = "";
            
            norvegianaDescription.reverse().forEach((description: string) => {
                poiDescription += description;
                poiDescription += "<br/><br/>";
            });

            return poiDescription;
        }

        private searchCriteriaNorgevianaToUrl(): string {
            var searchQuery: string;
            
            // Query String: Text
            var query = this.searchText;

            if (query)
                query = query.trim();

            if (query == null || query == "" || query == "*" || query == "%") {
                searchQuery = "*:*";
            } else if (query.indexOf('"') != -1) {
                searchQuery = "(*:* " + query + ")";
            } else {
                query = query.replace("%", "*");
                searchQuery = "((*:* " + query + ") OR (*:* " + DataSourceNorvegiana.toPartialQuery(query) + "))";
            }

            // Query String: Category
            if (this.searchQueryFields != null)
                searchQuery += " AND (" + this.searchQueryFields + ")";
            if (this.searchCategory != null && this.searchCategory != "*")
                searchQuery += " AND (abm_category_text:" + this.searchCategory + ")";

            // Facets
            var facets = "&qf=abm_collectionType_text%3AKNreise";
            if (this.searchMediaType != null && this.searchMediaType != "*")
                facets += "&qf=europeana_type_facet%3A" + encodeURIComponent(this.searchMediaType);

            // Position
            var posStr = "&pt=" + this.searchPosition.lat() + '%2C' + this.searchPosition.lon();
            
            return config.norvegianaURL
                + "?format=json"
                + posStr
                + "&sortBy=geodist"
                + "&sortOrder=asc"
                + '&start=' + this.searchStart
                + '&rows=' + this.searchCount
                +  facets
                + "&query=" + searchQuery
                + "&d=" + this.searchRadius;
        }

        private static toPartialQuery(query: string) {
            var partialQuery: string = "";
            var words = query.split(' ');
            for (var i in words) {
                var word = words[i];

                if (i > 0) {
                    partialQuery += " ";
                }

                partialQuery += word;

                if (!stringUtils.endsWith(word, "*")) {
                    partialQuery += "*";
                }
            }

            return partialQuery;
        }
    }
}

