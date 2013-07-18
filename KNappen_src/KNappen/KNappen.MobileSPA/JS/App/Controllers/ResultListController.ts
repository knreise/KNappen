/// <reference path="../GUI/PoiDialog.ts" />
/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {


    export class ResultListController {
        private self: ResultListController = null;

        /**
            ResultListController
            @class App.Controllers.ResultListController
            @classdesc This class controls how the the ListView should be displayed. For example uses the accordion widget to make expandable listitems, and attaches click events to them
        */
        constructor() {
            this.self = this;
        }

        /**
            Hooks up the searchresultcallback event to renderView
            @method App.Controllers.ResultListController#Init
            @public
        */
        public Init() {
            log.debug("ResultListController", "Init()");
            var rv = this.self.renderView;
            var _this = this;
            searchController.addSearchResultCallback(
                function (event: JQueryEventObject, searchResult: App.Models.SearchResult) {
                    rv(_this, searchResult.items(), null, searchResult.numFound(), searchResult.singleMaxNum());
                });

        }

        /**
            Renders the listview in a JQuery Accordion control and adds click events to PoiController.OpenDetail
            @method App.Controllers.ResultListController#renderView
            @param {App.Controllers.ResultListController} _this
            @param {App.Models.SearchResult} searchResult 
        */
        public renderView(_this: ResultListController, pois: App.Models.PointOfInterest[], routeName?: string, numFound: number = -1, singleMaxNum: number = 0) {
            //var pois: App.Models.PointOfInterest[] = searchResult.items();
            log.debug("ResultListController", "Render List View, Searchresult count: " + pois.length);

            var uniqueCounter: number = 0;

            var routeEditing = false;
            if (routeName) {
                routeEditing = true;
                $("#routeName").html(routeName).show();
            }

            var listDiv: any = $("#listView #listAccordion");
            listDiv.html("");

            $.each(pois, function (k, v: App.Models.PointOfInterest) {
                //log.debug("ResultListController", "Adding PoI: " + v.name + " at: " + v.pos.toString());

                uniqueCounter++;
                var uniqueIdSelect = "listItem" + uniqueCounter.toString();
                var uniqueIdDelete = "deleteItem" + uniqueCounter.toString();
                var deleteBtn = "";
                if (routeEditing) {
                    deleteBtn = '<input type="button" id="' + uniqueIdDelete + '" value="slett"/>';
                }

                var name = stringUtils.highlightWord(v.name(), searchController.searchCriteria.query(), "yellow");
                var ingress = stringUtils.highlightWord(v.ingress(), searchController.searchCriteria.query(), "yellow");


                var listItem = '<h3 class="listItemHeader">'
                    + '<img src="' + v.iconCategoryURL() + '" class="listItemCat"/>'
                    + '<img src="' + v.iconMediaTypeURL() + '" class="listItemCat"/>' + name + deleteBtn + '</h3>'
                    + '<div class="listItemPreview" id="' + uniqueIdSelect + '">' + (ingress || v.sourceType()) + '</div>';

                listDiv.append(listItem);
                $("#" + uniqueIdSelect)
                    .mousedown(function () {
                        poiController.OpenPreview(v, false);
                        poiController.OpenDetail(v);
                        return false;
                    });
                $("#" + uniqueIdDelete)
                    .mousedown(function () {
                        pois = pois.filter(function (element: App.Models.PointOfInterest, index, array) {
                            return element.id().toString() != v.id().toString();
                        });
                        routeController.updateRoute(routeName, pois);
                        resultListController.renderView(resultListController, pois, routeName);
                    });
            });


            if (listDiv.hasClass("ui-accordion")) {
                listDiv.accordion("refresh");
            }
                //if (routeEditing) {
                //    listDiv.accordion({
                //        header: "> div > h3",
                //        autoHeight: false
                //    }).sortable({
                //        axis: "y",
                //        handle: "h3",
                //        stop: function (event, ui) {
                //            // IE doesn't register the blur when sorting
                //            // so trigger focusout handlers to remove .ui-state-focus
                //            ui.item.children('h3').triggerHandler('focusout');
                //        }

                //    });
                //} 
            else {
                listDiv.accordion({ active: false, collapsible: true });
            }

            if (numFound > 0) {
                var listCount = $("#listCount");
                listCount.html(numFound + " treff funnet");
                var pageCount = parseInt(<any>(Math.ceil((numFound / (searchController.searchCriteria.rows() * config.numSearchProviders)) * 100) / 100));


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
            //make accordion sortable for editing route
            //if (routeEditing) {
            //    var stop = false;
            //    $("#listView #listAccordion h3").click(function (event) {
            //        if (stop) {
            //            event.stopImmediatePropagation();
            //            event.preventDefault();
            //            stop = false;
            //        }
            //    });
            //    listDiv.accordion({
            //        header: "> div > h3"
            //    })
            //        .sortable({
            //            axis: "y",
            //            handle: "h3",
            //            stop: function () {
            //                stop = true;
            //            }
            //        });
            //}
        }

    }
}

var resultListController = new App.Controllers.ResultListController();

startup.addInit(function () { resultListController.Init(); }, "ResultListController");
