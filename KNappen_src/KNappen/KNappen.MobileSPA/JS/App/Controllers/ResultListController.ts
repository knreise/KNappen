/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    export class ResultListController {

        private updateDistanceFromGps: boolean = false;
        private poisInList: App.Models.PointOfInterest[];

        /**
            ResultListController
            @class App.Controllers.ResultListController
            @classdesc This class controls how the the ListView should be displayed. For example uses the accordion widget to make expandable listitems, and attaches click events to them
        */
        constructor() { }

        /**
            Hooks up the searchresultcallback event to renderView
            @method App.Controllers.ResultListController#Init
            @public
        */
        public Init() {
            log.debug("ResultListController", "Init()");

            searchController.addSearchResultCallback((event: JQueryEventObject, searchResult: App.Models.SearchResult, inRoute: boolean) => this.renderView(searchResult.items(), searchResult.numFound(), searchResult.numPages(), null, inRoute));
            gpsProvider.addPositionChangedHandler((ev, pos) => this.updateDistance(pos));

            var self = this;

            $("#saveListAsRoute").mousedown(function () {
                mapController.addResultToCache();
            });

            $("#deleteRoute").mousedown(function (event) {
                var routeId = $("#deleteRoute").attr('routeId');
                if (routeId) {
                    routeController.deleteRoute(routeId);
                    userPopupController.sendSuccess(tr.translate("ROUTE_DELETED"), tr.translate("ROUTE_DELETED_MSG"));
                    self.renderView([], 0);
                    viewController.goBack();
                }
            });
        }

        private updateDistance(pos: System.Models.Position) {
            if (this.updateDistanceFromGps && pos != null) {

                var listDiv = $("#listView #listAccordion");

                var pois = this.poisInList;
                for (var i in pois) {
                    var poi = pois[i];
                    var distance = distanceTool.GetDistanceFromLatLon(poi.pos(), pos);
                    poi.distance(distance);
                    poi.distanceInKm(distance.toFixed(2) + "km");

                    var poiId: any = poi.id();
                    if (poiId instanceof Array) {
                        if (poiId.length == 0) {
                            continue;
                        }
                        poiId = poiId[0];
                    }

                    poiId = poiId.replace(/([ #;?%&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
                    listDiv.find("span#dist_poi_" + poiId).first().html(poi.distanceInKm());
                }
            }
        }

        /**
            Renders the listview in a JQuery Accordion control and adds click events to PoiController.OpenDetail
            @method App.Controllers.ResultListController#renderView
            @param {App.Controllers.ResultListController} _this
            @param {App.Models.SearchResult} searchResult
            @param {number} numFound
            @param {number} pageCount
            @param {string} routeId
        */
        public renderView(pois: App.Models.PointOfInterest[], numFound: number, pageCount?: number, routeId?: string, inRute: boolean = false) {
            log.debug("ResultListController", "Render List View, Searchresult count: " + pois.length);

            this.updateDistanceFromGps = inRute;
            this.poisInList = pois;

            var uniqueCounter: number = 0;

            var routeEditing = false;
            if (routeId)
                routeEditing = true;

            if (routeEditing) {
                $("#saveListAsRoute").hide();
                $("#deleteRoute").show();
            }
            else {
                $("#saveListAsRoute").show();
                $("#deleteRoute").hide();
            }

            var listDiv: any = $("#listView #listAccordion");
            listDiv.empty();

            pois.forEach((poi: App.Models.PointOfInterest) => {
                uniqueCounter++;
                var uniqueIdSelect = "listItem" + uniqueCounter.toString();
                var uniqueIdDelete = "deleteItem" + uniqueCounter.toString();
                var deleteBtn = "";

                if (routeEditing)
                    deleteBtn = '<input type="button" id="' + uniqueIdDelete + '" value="' + tr.translate("Delete") + '"/>';

                var ingressText = poi.GetFormatedIngress();

                var color = "yellow";
                var onlyFromBeginning = false;

                if (poi.source() === "norvegiana")
                    onlyFromBeginning = true;

                var name = stringUtils.highlightWord(poi.name(), searchController.searchCriteria.query(), color, onlyFromBeginning);
                var ingress = stringUtils.highlightWord(ingressText, searchController.searchCriteria.query(), color, onlyFromBeginning);

                var listItem = '<h3 class="listItemHeader clearfix">'
                    + '<div class="blockelement clearfix">' + name + '<span class="right">' + deleteBtn + '</span></div>'
                    + '<div>'
                    + '<img src="' + poi.iconCategoryURL() + '" class="listItemCat"/ > '
                    + '<img src="' + poi.iconGenreURL() + '" class="listItemCat"/>';

                for (var i in poi.iconMediaTypeURL()) {
                    listItem += '<img src="' + poi.iconMediaTypeURL()[i] + '" class="listItemCat"/>';
                }

                listItem += '<span id="dist_poi_' + poi.id() + '" class="right">' + poi.distanceInKm() + '</span></h3>'
                + '<div class="listItemPreview" id="' + uniqueIdSelect + '">' + ingress + '</div>';

                listDiv.append(listItem);
                $("#" + uniqueIdSelect).mousedown(() => {
                    poiController.OpenPreview(poi, false);
                    poiController.OpenDetail(poi);
                    return false;
                });

                $("#" + uniqueIdDelete).mousedown(() => {
                    pois = pois.filter((element: App.Models.PointOfInterest) => (element.id() != poi.id()));
                    routeController.updateRoute(routeId, pois);
                    resultListController.renderView(pois, pois.length, null, routeId);
                });
            });

            $("#deleteRoute").attr('routeId', routeId);

            try { // Destory the accordion, otherwise the accordion items will always be in memory.
                listDiv.accordion("destroy");
            } catch (e) { }

            // Initialize the accordion.
            listDiv.accordion({ collapsible: true, active: false, animate: false });

            // Hits found
            var listCount = $("#listCount");
            listCount.html(tr.translate("NumberOfSearchResultHits", [pois.length, numFound]));

            // Paging
            var listPager = $("#listPager");
            listPager.html("");

            if (numFound > 0 && pageCount) {
                var pager1 = $("<span class ='typcn typiconButton'><svg><path fill='white' d='M18 11h-7.244l1.586-1.586c.781-.781.781-2.049 0-2.828-.781-.781-2.047-.781-2.828 0l-6.414 6.414 6.414 6.414c.39.391.902.586 1.414.586s1.023-.195 1.414-.586c.781-.781.781-2.049 0-2.828l-1.586-1.586h7.244c1.104 0 2-.896 2-2 0-1.105-.896-2-2-2z'/></svg></span>");

                if (searchController.searchCriteria.pageNumber() == 1) {
                    pager1.attr('disabled', 'disabled').css("color", "#cccccc");
                } else {
                    pager1.mousedown(function () {
                        searchController.searchCriteria.pageNumber(searchController.searchCriteria.pageNumber() - 1);

                        if (searchController.searchCriteria.pageNumber() < 1)
                            searchController.searchCriteria.pageNumber(1);

                        searchController.doSearch();
                    });
                }

                var pager2 = $("<span class='typcn typiconButton'><svg><path fill='white' d='M10.586 6.586c-.781.779-.781 2.047 0 2.828l1.586 1.586h-7.244c-1.104 0-2 .895-2 2 0 1.104.896 2 2 2h7.244l-1.586 1.586c-.781.779-.781 2.047 0 2.828.391.391.902.586 1.414.586s1.023-.195 1.414-.586l6.414-6.414-6.414-6.414c-.781-.781-2.047-.781-2.828 0z'/></svg></span>");

                if (searchController.searchCriteria.pageNumber() == pageCount) {
                    pager2.attr('disabled', 'disabled').css("color", "#cccccc");
                } else {
                    pager2.mousedown(function () {
                        searchController.searchCriteria.pageNumber(searchController.searchCriteria.pageNumber() + 1);

                        if (searchController.searchCriteria.pageNumber() > pageCount)
                            searchController.searchCriteria.pageNumber(pageCount);

                        searchController.doSearch();
                    });
                }

                listPager.append(pager1);
                listPager.append(tr.translate("PagesInSearchResult", [searchController.searchCriteria.pageNumber(), pageCount]));
                listPager.append(pager2);
            }

            this.updateDistance(gpsProvider.lastPos);
        }
    }
}

var resultListController = new App.Controllers.ResultListController();

startup.addInit(function () { resultListController.Init(); }, "ResultListController");
