/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.SearchProviders
*/
module App.SearchProviders {

    export class DataSourceDigitalarkivetProperty extends DataSource{

        private searchPosition: System.Models.Position;
        private searchRadius: number;
        private searchString: string;

        private searchNextPage: number;
        private searchLimit: number;

        /**
            DataSourceDigitalarkivetProperty
            @class App.SearchProviders.DataSourceDigitalarkivetProperty
            @classdesc This class handles the specific search url and field mapping for the datasource "Digitalarkivet"
        */
        constructor(searchCriteria: App.Models.SearchCriteria, successCallback: App.Providers.SearchSuccessCallback, errorCallback: App.Providers.SearchErrorCallback) {

            super(searchCriteria.rows(), successCallback, errorCallback);

            this.searchPosition = searchCriteria.pos();
            this.searchRadius = searchCriteria.radius();
            this.searchString = DataSourceDigitalarkivetProperty.getSearchString(searchCriteria.query());
            
            this.searchNextPage = 1;
            this.searchLimit = searchCriteria.rows() * config.searchCountMultiplier;
        }
    
        /**
            search
            @method App.SearchProviders.DataSourceDigitalarkivetProperty#search
            @public
        */
        public search(searchHandle: App.Providers.SearchHandle): boolean {

            if (this.searchNotNeeded((this.searchNextPage - 1) * this.searchLimit)) {
                return false;
            }

            var self = this;

            log.debug("DataSourceDigitalarkivetProperty", "Searching");
            var searchUrl = DataSourceDigitalarkivetProperty.searchCriteriaToDigitalArkivetUrl(this.searchPosition, this.searchRadius, this.searchNextPage, this.searchLimit, this.searchString);

            log.info("DataSourceDigitalarkivetProperty", "Search URL: " + searchUrl);
            $.getJSON(searchUrl, function (data) {

                log.info("DataSourceDigitalarkivetProperty", "Processing result from: " + searchUrl);

                var items = data.results;
                
                for (var i in items) {
                    var item = items[i];

                    var poi = new App.Models.PointOfInterest();
                    poi.source("digitalarkivet");
                    poi.sourceType("fagdata");
                    poi.categories.push(config.digitalArkivetPropertyCategory);
                    poi.mediaTypes.push("TEXT");
                    poi.id(item.autoid);
                    poi.name(item.gaardsnavn_gateadr);
                    poi.year(item.startaar || "");
                    poi.institution(item.kildenavn || "");
                    poi.owner("Digitalarkivet");
                    poi.creator("");
                    poi.landingPage(item.kildeside || "");
                    poi.tags(item.kildetype || "");
                    poi.ingress(item.gaardsnavn_gateadr || "");
                    poi.body("");
                    poi.license(item.lisenstype || "");
                    poi.thumbnail("");

                    var position = new System.Models.Position(item.latitude, item.longitude);
                    var distance = distanceTool.GetDistanceFromLatLon(position, self.searchPosition);

                    poi.pos(position);
                    poi.distance(distance);
                    poi.distanceInKm(distance.toFixed(2) + "km");

                    var descriptionString = "";
                    descriptionString += stringUtils.toFieldBold(null, item.gaardsnavn_gateadr);
                    descriptionString += stringUtils.toFieldBold("Bruksnavn", (item.gaardsnavn_gateadr != null && item.bruksnavn != null && item.gaardsnavn_gateadr != item.bruksnavn) ? item.bruksnavn : null);
                    descriptionString += stringUtils.toFieldBold("Fylke", item.fylke);
                    descriptionString += stringUtils.toFieldBold("Kommune", item.kommune_sokn);
                    poi.description(descriptionString);

                    if (item.apartments != null) {
                        poi.description(poi.description() + DataSourceDigitalarkivetProperty.dataToApartments(item.apartments, item.persons));
                    }
                    else {
                        poi.description(poi.description() + DataSourceDigitalarkivetProperty.dataToResidents(item.persons));
                    }

                    poi.updateIcons();

                    self.addPoi(poi);
                }

                self.searchNextPage++;
                self.setResultCount(parseInt(data.total_found));
                self.raiseSuccess(searchHandle);

            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                self.raiseError(errorThrown, searchHandle);
            });

            return true;
        }

        private static searchCriteriaToDigitalArkivetExtendedUrl(bfId: string) {
            return "http://api.digitalarkivet.arkivverket.no/v1/census/1910/property/" + bfId;
        }

        private static searchCriteriaToDigitalArkivetUrl(position: System.Models.Position, radius: number, nextPage: number, limit: number, searchString: string)
        {
            return "http://api.digitalarkivet.arkivverket.no/v1/census/1910/search_property_geo?"
                + "latitude=" + position.lat()
                + "&longitude=" + position.lon()
                + "&precision=" + (radius * 1000)
                + "&limit=" + limit
                + "&page=" + nextPage
                + "&include_apartments=1"
                + "&include_persons=1"
                + searchString;
        }

        private static getSearchString(searchQuery: string): string {
            var result = "";

            if (searchQuery != null && searchQuery != "" && searchQuery != "*" && searchQuery != "%") {
                searchQuery = $.trim(searchQuery);
                searchQuery = searchQuery.replace("%", "*");

                searchQuery = encodeURI(searchQuery);

                result = "&s=" + searchQuery;
            }

            return result;
        }

        private static compareApartments(a: any, b: any): number {
            if (a.leilighetsnummer > b.leilighetsnummer)
                return 1;
            if (a.leilighetsnummer < b.leilighetsnummer)
                return -1;
            return 0;
        }

        private static filterResidentsForApartment(resident: any, index: any, array: any): boolean {
            return resident.overid == this;
        }

        private static dataToApartments(apartments: any, persons: any): string {
            var apartmentString = "";

            if (!apartments) {
                return "";
            }

            apartments.sort(DataSourceDigitalarkivetProperty.compareApartments);

            for (var apartmentIndex in apartments) {
                var apartment = apartments[apartmentIndex];

                apartmentString += "</br>";
                apartmentString += stringUtils.toFieldBold(null, "Nummer", apartment.leilighetsnummer, "i", apartment.etasje, "etasje");
                apartmentString += stringUtils.toFieldBold("Husleie", apartment.husleie);

                var residents = persons.filter(DataSourceDigitalarkivetProperty.filterResidentsForApartment, apartment.id);
                apartmentString += DataSourceDigitalarkivetProperty.dataToResidents(residents);
                apartmentString += "</br>";
            }

            return apartmentString;
        }

        private static dataToResidents(residents: any): string {
            var residentsString = "";

            if (!residents) {
                return "";
            }

            for (var i in residents) {
                var resident = residents[i];

                residentsString += "</br>";
                residentsString += stringUtils.toFieldBold(null, resident.fornavn, resident.patronymikon, resident.slektsnavn);
                residentsString += stringUtils.toField("Fødselsdato", resident.fodselsaar);
                residentsString += stringUtils.toField("Yrke", resident.yrke);
                residentsString += stringUtils.toFieldFromCode("Familiestilling", resident.familiestilling);
                residentsString += stringUtils.toFieldFromCode("Sivilstatus", resident.sivilstand);
                residentsString += stringUtils.toField("Fødested", resident.fodested);
                residentsString += stringUtils.toFieldFromCode("Bostatus", resident.bostatus);
                residentsString += stringUtils.toFieldFromCode("Statsborgerskap", resident.statsborgerskap);
                residentsString += stringUtils.toFieldFromCode("Trossamfunn", resident.trossamfunn);
            };

            return residentsString;
        }
    }
}