/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.SearchProviders
*/
module App.SearchProviders {
    var inNorvegianaSearch = false;
    var autoRetries = 3;

    export class DataSourceNorvegiana implements App.Providers.ISearchProvider {

        /**
            DataSourceNorvegiana
            @class App.SearchProviders.DataSourceNorvegiana
            @classdesc This class handles the specific search url and field mapping for the datasource "Norvegiana" 
        */
        constructor() {
        }

        /**
            search
            @method App.SearchProviders.DataSourceNorvegiana#search
            @public
        */
        public search(searchCriteria: App.Models.SearchCriteria, successCallback: { (searchResult: App.Models.SearchResult): void; }, errorCallback: { (errorMessage: string): void; }) {
            log.debug("DataSourceNorvegiana", "Searching");
            //var urlHash = searchCriteria.norvegiana.toHash();
            var _this = this;

            inNorvegianaSearch = true;
            setTimeout(function () {
                if (inNorvegianaSearch) {
                    // Handle error accordingly
                    log.error("DataSourceNorvegiana", "Error: Search timeout / error condition.")
                    log.userPopup(tr.translate("TIMEOUT"), tr.translate("TIMEOUT_NORVEGIANA_SEARCH"));
                    inNorvegianaSearch = false;

                    // Retry search
                    autoRetries--;
                    if (autoRetries > 0) {
                        setTimeout(function () {
                            if (!inNorvegianaSearch) {
                                log.info("DataSourceNorvegiana", "Autoretrying search...")
                                log.userPopup(tr.translate("TIMEOUT"), tr.translate("TIMEOUT_NORVEGIANA_RETRY"));
                                _this.search(searchCriteria, successCallback, errorCallback);
                            }
                        }, config.norvegianaAutoRetryDelaySeconds * 1000);
                    } else {
                        autoRetries = config.norvegianaAutoRetryCount;
                    }
                }
            }, config.norvegianaSearchTimeoutSeconds * 1000);


            //var searchUrl = searchCriteria.norvegiana.mkUrl();
            var searchUrl = this.searchCriteriaNorgevianaToUrl(searchCriteria);
            //http://kulturnett2.delving.org/organizations/kulturnett/api/search?query=norge&pt=59.9636,10.8773&d=5&format=json
            log.info("DataSourceNorvegiana", "Search URL: " + searchUrl);
            $.getJSON(searchUrl, function (data) {
                log.info("DataSourceNorvegiana", "Processing result from: " + searchUrl);
                inNorvegianaSearch = false;
                //$(".searchingDiv").hide();
                autoRetries = config.norvegianaAutoRetryCount;

                var items = data.result.items;
                var retItems = new Array();

                $.each(items, function (objid, object) {
                    var p = object.item.fields;
                    var latlon = '';
                    latlon = p.abm_geo;

                    if (latlon == null)
                        latlon = p.abm_latLong;

                    var pos = null;
                    if (latlon != null) {
                        latlon = latlon[0].toString().split(',');
                        var poilat = latlon[0];
                        var poilon = latlon[1];
                        pos = new System.Models.Position(poilat, poilon);
                    }

                    // Copy from result to PoI
                    var poi = new App.Models.PointOfInterest();
                    poi.source("norvegiana");
                    poi.sourceType("fagdata");
                    poi.id(p.delving_hubId);
                    poi.name(p.dc_title);
                    //todo: abm_introduction is supposed to exist, according to updated documentation in cloudbox
                    poi.description(p.dc_description || "");
                    poi.link(p.dc_identifier || "");
                    poi.pos(pos);
                    var thumb = p.delving_thumbnail;
                    if (thumb)
                        thumb = thumb[0];
                    poi.thumbnail(thumb || "");
                    poi.year(p.dc_date || "");
                    poi.landingPage(p.delving_landingPage || "");
                    poi.ingress(p.abm_introduction || "");
                    poi.license(p.europeana_rights || "");
                    if (p.abm_category) {
                        $.each(p.abm_category, function (k, v: string) {
                            v = v.replace(new RegExp("\(\d+\)$", "gi"), "");
                            poi.categories.push(v);
                        });
                    }

                    poi.tags(p.dc_subject || "");
                    poi.institution(p.europeana_dataProvider || "");
                    poi.owner(p.abm_contentProvider || "");
                    poi.creator(p.dc_creator || "");
                    poi.linkMoreInfo(p.dcterms_references || "");
                    poi.originalVersion(p.europeana_isShownAt || "");

                    var mediaType: App.Providers.MediaTypeItem = null;
                    $.each(p.europeana_type, function (k, v: string) {
                        poi.mediaTypes.push(v);
                    });
                    poi.soundUri(p.abm_soundUri || null);

                    poi.videoUri(p.abm_videoUri || null);

                    // Add to return
                    retItems.push(poi);
                });


                var result = new App.Models.SearchResult();
                result.numFound(data.result.query.numfound);
                result.items(retItems);

                // Success callback
                successCallback(result);
            }).fail(function (jqXHR, textStatus, errorThrown) { errorCallback(errorThrown); });
        }

        //private sortAndFilterResult(maxLen, searchResult) {
        //    var myLocForSort = null;
        //    if (gpsProvider.lastPos != null)
        //        myLocForSort = new LatLon(gpsProvider.lastPos.lat, gpsProvider.lastPos.lon);
        //    // Sort result based on distance

        //    if (myLocForSort != null) {
        //        $.each(searchResult.items, function (id, item) {
        //            if (item && item.position && item.position.lat && item.position.lon) {
        //                var geoLat = new LatLon(item.position.lat, item.position.lon);
        //                item.lastKnownDistance = myLocForSort.distanceTo(geoLat) * 1000.0;
        //            }
        //            //geoLat.destroy();
        //        });
        //        //myLocForSort.destroy();
        //        searchResult.items.sort(this.distanceSortFunction);
        //    }

        //    // Chop result
        //    searchResult.items = searchResult.items.slice(0, maxLen);

        //    return searchResult;
        //}

        //private distanceSortFunction(a, b) {
        //    return a.lastKnownDistance - b.lastKnownDistance;
        //}

        ////private setPOI(id, poi) {
        ////    localTempCache.set("POI." + id, poi);
        ////}

        ////private getPOI(id) {
        ////    return localTempCache.get("POI." + id);
        ////}

        private searchCriteriaNorgevianaToUrl(searchCriteria: App.Models.SearchCriteria): string {

            // qf filter params
            var qfParams = '';
            if (searchCriteria.norvegiana_qf() && searchCriteria.norvegiana_qf().length > 0) {
                $.each(searchCriteria.norvegiana_qf(), function (objid, object) {
                    if (qfParams != '')
                        qfParams += ',';
                    qfParams += 'europeana_dataProvider_facet:' + object;
                });
                qfParams = '&qf%5B%5D=' + qfParams;
            }

            // Position
            var posStr = "";
            if (searchCriteria.radius() != null && searchCriteria.radius() != 0 && searchCriteria.pos() != null && searchCriteria.pos().lat() != null && searchCriteria.pos().lon() != null) {
                posStr = '&pt=' + searchCriteria.pos().lat() + ',' + searchCriteria.pos().lon()
                    + '&d=' + searchCriteria.radius();
            }

            // Query string
            var searchQuery = searchCriteria.query();
            if (!searchQuery || searchQuery == "")
                searchQuery = "*:*";
            // Replace % with * so we support both
            searchQuery = searchQuery.replace("%", "*");

            // Sorting
            var sorting: string = "";
            if (!searchCriteria.sort || searchCriteria.sort == App.Models.SearchCriteriaSortingEnum.Distance)
                sorting = null; // TODO WHEN WE GET INFO ABOUT THIS
            if (searchCriteria.sort == App.Models.SearchCriteriaSortingEnum.PublishingDate)
                sorting = "";
            if (searchCriteria.sort == App.Models.SearchCriteriaSortingEnum.Subject)
                sorting = "";

            if (sorting && sorting != "")
                sorting = "&sortby=" + sorting;
            if (!sorting)
                sorting = "";

            if (searchCriteria.category() && searchCriteria.category() != "*")
                qfParams += "&qf=abm_category_text:" + searchCriteria.category();
            if (searchCriteria.mediaType() && searchCriteria.mediaType() != "*")
                qfParams += "&qf=europeana_type_facet:" + searchCriteria.mediaType();

            // Power rangers - Assemble (teh url)!

            //return 'http://kn-reise.delving.org/organizations/kn-reise/api/search?query='
            return config.norvegianaURL
                + encodeURIComponent(searchQuery)
                + posStr
                + '&rows=' + searchCriteria.rows()
                + '&start=' + ((searchCriteria.rows() * (searchCriteria.pageNumber() - 1)) + 1)
                + '&format=json'
                + sorting
                + qfParams;
            //+ "&sort=geodist()%20asc"
            //+ "&fl=delving_hubId,dc_title,dc_description,dc_identifier,abm_geo,abm_latLong,delving_thumbnail,dcterms_created,delving_landingPage";

            /*
        
             return 'http://kulturnett2.delving.org/organizations/kulturnett/api/search?query={!boost%20f=recip%28geodist%28%29,2,200,20%29}'
             + encodeURIComponent(obj.query)
             + '&pt=' + obj.pos.lat + ',' + obj.pos.lon
             + '&d=' + obj.radius
             + '&rows=' + obj.rows
             + '&format=json&sort=score%20asc&fq={!geofilt}'
             + qfParams;
             */

        }


    }
}

