var App;
(function (App) {
    /// <reference path="../GUI/PoiDialog.ts" />
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var ResultListController = (function () {
            /**
            ResultListController
            @class App.Controllers.ResultListController
            @classdesc This class controls how the the ListView should be displayed. For example uses the accordion widget to make expandable listitems, and attaches click events to them
            */
            function ResultListController() {
                this.self = null;
                this.self = this;
            }
            /**
            Hooks up the searchresultcallback event to renderView
            @method App.Controllers.ResultListController#Init
            @public
            */
            ResultListController.prototype.Init = function () {
                log.debug("ResultListController", "Init()");
                var rv = this.self.renderView;
                var _this = this;
                searchController.addSearchResultCallback(function (event, searchResult) {
                    rv(_this, searchResult.items(), null, searchResult.numFound(), searchResult.singleMaxNum());
                });
            };

            /**
            Renders the listview in a JQuery Accordion control and adds click events to PoiController.OpenDetail
            @method App.Controllers.ResultListController#renderView
            @param {App.Controllers.ResultListController} _this
            @param {App.Models.SearchResult} searchResult
            */
            ResultListController.prototype.renderView = function (_this, pois, routeName, numFound, singleMaxNum) {
                if (typeof numFound === "undefined") { numFound = -1; }
                if (typeof singleMaxNum === "undefined") { singleMaxNum = 0; }
                //var pois: App.Models.PointOfInterest[] = searchResult.items();
                log.debug("ResultListController", "Render List View, Searchresult count: " + pois.length);

                var uniqueCounter = 0;

                var routeEditing = false;
                if (routeName) {
                    routeEditing = true;
                    $("#routeName").html(routeName).show();
                }

                var listDiv = $("#listView #listAccordion");
                listDiv.html("");

                $.each(pois, function (k, v) {
                    //log.debug("ResultListController", "Adding PoI: " + v.name + " at: " + v.pos.toString());
                    uniqueCounter++;
                    var uniqueIdSelect = "listItem" + uniqueCounter.toString();
                    var uniqueIdDelete = "deleteItem" + uniqueCounter.toString();
                    var deleteBtn = "";
                    if (routeEditing) {
                        deleteBtn = '<input type="button" id="' + uniqueIdDelete + '" value="' + tr.translate("Delete") + '"/>';
                    }

                    var name = stringUtils.highlightWord(v.name(), searchController.searchCriteria.query(), "yellow");
                    var ingress = stringUtils.highlightWord(v.ingress(), searchController.searchCriteria.query(), "yellow");

                    var listItem = '<h3 class="listItemHeader">' + '<img src="' + v.iconCategoryURL() + '" class="listItemCat"/>' + '<img src="' + v.iconMediaTypeURL() + '" class="listItemCat"/>' + name + deleteBtn + '</h3>' + '<div class="listItemPreview" id="' + uniqueIdSelect + '">' + (ingress || v.sourceType()) + '</div>';

                    listDiv.append(listItem);
                    $("#" + uniqueIdSelect).mousedown(function () {
                        poiController.OpenPreview(v, false);
                        poiController.OpenDetail(v);
                        return false;
                    });
                    $("#" + uniqueIdDelete).mousedown(function () {
                        pois = pois.filter(function (element, index, array) {
                            return element.id().toString() != v.id().toString();
                        });
                        routeController.updateRoute(routeName, pois);
                        resultListController.renderView(resultListController, pois, routeName);
                    });
                });

                if (listDiv.hasClass("ui-accordion")) {
                    listDiv.accordion("refresh");
                } else {
                    listDiv.accordion({ active: false, collapsible: true });
                }

                if (numFound > 0) {
                    var listCount = $("#listCount");
                    listCount.html(tr.translate("{0} hits found", [numFound]));
                    var pageCount = parseInt((Math.ceil((numFound / (searchController.searchCriteria.rows() * config.numSearchProviders)) * 100) / 100));

                    var pager1 = $("<span class ='typcn typcn-arrow-left-thick typiconButton'></span>").mousedown(function () {
                        searchController.searchCriteria.pageNumber(searchController.searchCriteria.pageNumber() - 1);

                        if (searchController.searchCriteria.pageNumber() < 1)
                            searchController.searchCriteria.pageNumber(1);

                        searchController.doSearch();
                    });
                    if (searchController.searchCriteria.pageNumber() == 1) {
                        pager1.attr('disabled', 'disabled').css("color", "#cccccc");
                    }

                    var pagerText = searchController.searchCriteria.pageNumber() + " av " + pageCount;

                    var pager2 = $("<span class='typcn typcn-arrow-right-thick typiconButton'></span>").mousedown(function () {
                        searchController.searchCriteria.pageNumber(searchController.searchCriteria.pageNumber() + 1);

                        if (searchController.searchCriteria.pageNumber() > pageCount)
                            searchController.searchCriteria.pageNumber(pageCount);

                        searchController.doSearch();
                    });
                    if (searchController.searchCriteria.pageNumber() == pageCount) {
                        pager2.attr('disabled', 'disabled').css("color", "#cccccc");
                    }

                    var listPager = $("#listPager");
                    listPager.html("");
                    listPager.append(pager1);
                    listPager.append(pagerText);
                    listPager.append(pager2);
                }
            };
            return ResultListController;
        })();
        Controllers.ResultListController = ResultListController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

var resultListController = new App.Controllers.ResultListController();

startup.addInit(function () {
    resultListController.Init();
}, "ResultListController");
//@ sourceMappingURL=ResultListController.js.map
