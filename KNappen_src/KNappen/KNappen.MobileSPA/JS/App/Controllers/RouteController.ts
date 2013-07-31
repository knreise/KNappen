/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {

    export class RouteControllerRequest {

        /**
            RouteControllerRequest
            @class App.Controllers.RouteControllerRequest
            @classdesc This class contains the fields sent to the server when publishing a route
        */
        constructor() {
        }

        public name: string = null;
        public id: string = null;
        public data = null;
        public adminPwd: string = null;
    }

    export class RouteIndex {

        /**
            RouteIndex
            @class App.Controllers.RouteIndex
            @classdesc Routes from server
        */
        constructor() {
        }

        public routes: string[] = [];
    }


    export class RouteController {
        public routeProvider: App.Providers.RouteProvider = new App.Providers.RouteProvider();

        /**
            RouteController
            @class App.Controllers.RouteController
            @classdesc This class controls how routes are made, viewed and published
        */
        constructor() {
        }

        /**
            PostInit
            @method App.Controllers.RouteController#PostInit
        */
        public PostInit() {
            log.debug("RouteController", "PostInit()");
        }

        /**
            Load routes
            @method App.Controllers.RouteController#Init
        */
        public Init() {
            log.debug("RouteController", "Init()");
            var _this = this;
            viewController.addSelectEvent(function (event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) {
                if (newView.name == "routeView")
                    _this.renderRouteView();
            });

            this.routeProvider.adminRoutes.loadRoutes();
            this.routeProvider.userRoutes.loadRoutes();
            this.routeProvider.searchRoutes.loadRoutes();

            this.startAdminRouteDownload();

            $("#btnCache").mousedown(function () {
                _this.cacheRoute(_this.routeProvider.searchRoutes);
                _this.cacheRoute(_this.routeProvider.userRoutes);
                _this.cacheRoute(_this.routeProvider.adminRoutes);
            });

        }

        /**
            Add route to queue for precaching
            @method App.Controllers.RouteController#cacheRoute
            @param {App.Providers.RouteProviderHelper} route Route to precache
        */
        public cacheRoute(route: App.Providers.RouteProviderHelper) {
            var _this = this;
            $.each(route.getRoutes(), function (k, v: App.Providers.RouteItem) {
                $.each(v.pois(), function (k2, poi: App.Models.PointOfInterest) {
                    mapPreCacheProvider.cachePos(poi.pos());
                });
            });
        }

        /**
            Create route from array of PointOfInterest
            @method App.Controllers.RouteController#addSearchRoute
            @param {string} routeName name of route to create
            @param {App.Models.PointOfInterest[]} pois Array of pois to add to route
        */
        public addSearchRoute(routeName: string, pois: App.Models.PointOfInterest[]) {
            log.debug("RouteController", "Adding search result to new route: " + routeName);

            var routeItem: App.Providers.RouteItem = new App.Providers.RouteItem();
            routeItem.name(routeName);
            routeItem.version(routeItem.version() + 1);
            $.each(pois, function (k, v: App.Models.PointOfInterest) {
                routeItem.pois.push(v);
            });

            this.routeProvider.userRoutes.addRoute(routeItem);
            this.routeProvider.userRoutes.saveRoutes();
        }

        /**
            Creates a new route
            @method App.Controllers.RouteController#Init
            @param {string} name
            @param {App.Models.PointOfInterest} poi
        */
        public createRoute(name: string) {
            var routeItem: App.Providers.RouteItem = new App.Providers.RouteItem();
            routeItem.name(name);
            routeItem.version(routeItem.version() + 1);

            this.routeProvider.userRoutes.addRoute(routeItem);
            this.routeProvider.userRoutes.saveRoutes();
            userPopupController.sendSuccess(tr.translate("Route created"), tr.translate("The route '{0}' was created.", [name]));

            this.renderRouteView();
        }


        /**
            Renders the routeview
            @method App.Controllers.RouteController#renderRouteView
            @public
        */
        public renderRouteView() {
            var $editorialRoutes = $("#editorialRoutes");
            var $userRoutes = $("#userRoutes");

            $editorialRoutes.empty();
            $userRoutes.empty();


            var _this = this;

            routeController.routeProvider.adminRoutes.getRoutes().forEach(function (v: App.Providers.RouteItem, k) {
                var routeIdSelect = "routeSelect_" + v.id();
                var routeIdEdit = "routeEdit_" + v.id();
                var routeIdUnpublish = "routeUnpublish_" + v.id();

                $editorialRoutes.append('<li class="routeListItem" id="routeListItem_' + v.id() + '"><h2>' + v.name() + '</h2>'
                    + '<input type="button" value="' + tr.translate("Follow route") + '" id="' + routeIdSelect + '"/>'
                    + '<input type="button" value="' + tr.translate("Edit") + '" id="' + routeIdEdit + '"/>'
                //+ '<input type="button" value="Avpubliser" id="' + routeIdUnpublish + '"/>'
                    + '</li>');

                $("#" + routeIdSelect).mousedown(function () {
                    _this.selectRoute(v);
                });

                $("#" + routeIdEdit).mousedown(function () {
                    resultListController.renderView(resultListController, v.pois(), v.id());
                    viewController.selectView("listView");
                });

                $("#" + routeIdUnpublish).mousedown(function () {

                });
            });

            routeController.routeProvider.userRoutes.getRoutes().forEach(function (v: App.Providers.RouteItem, k) {
                var routeIdSelect = "routeSelect_" + v.id();
                var routeIdEdit = "routeEdit_" + v.id();
                var routeIdPublish = "routePublish_" + v.id();
                var routeIdPublishPwdBox = "Pwd_" + routeIdPublish;
                var routeIdPublishBtn = "Btn_" + routeIdPublish;
                var routeIdPwd = "Pwd_" + v.id();

                var publishButton: string = "";
                if (settings.adminPassword())
                    publishButton = '<input type="button" value="Publiser" id="' + routeIdPublishBtn + '"/>';

                $userRoutes.append('<li class="routeListItem" id="routeListItem_' + v.id() + '">' + v.name()
                    + '<br/><input type="button" value="' + tr.translate("Follow route") + '" id="' + routeIdSelect + '"/>'
                    + '<input type="button" value="' + tr.translate("Edit") + '" id="' + routeIdEdit + '"/>'
                //+ '<input type="button" value="Publiser" id="' + routeIdPublish + '"/>'
                //+ '<div id="' + routeIdPublishPwdBox + '" class="hidden"></br><input type="text" id="' + routeIdPwd + '"/>'
                    + publishButton
                    + '</li>');

                $("#" + routeIdSelect).mousedown(function () {
                    _this.selectRoute(v);
                });

                $("#" + routeIdEdit).mousedown(function () {
                    viewController.selectView("listView");
                    resultListController.renderView(resultListController, v.pois(), v.id());
                });

                //$("#" + routeIdPublish).mousedown(function () {
                //    $("#" + routeIdPublishPwdBox).toggle();
                //});

                $("#" + routeIdPublishBtn).mousedown(function () {
                    //var pwd = $("#" + routeIdPwd).val();
                    _this.uploadAdminRoute(v, settings.adminPassword())
                });
            });
        }

        /**
            Selects a route by filling the searchresult with poi from the chosen route.
            @method App.Controllers.RouteController#selectRoute
            @param {App.Providers.RouteItem} route
            @public
        */
        public selectRoute(route: App.Providers.RouteItem) {
            var searchResult: App.Models.SearchResult = new App.Models.SearchResult();
            searchResult.items(route.pois());
            searchResult.numFound(route.pois().length);

            searchController.searchResultCallback(searchController, searchResult);
            viewController.selectView(settings.startView());
        }

        /**
            Updates a route after editing
            @method App.Controllers.RouteController#updateRoute
            @param {string} routeName
            @param {App.Models.PointOfInterest[]} pois
            @public
        */
        public updateRoute(routeName: string, pois: App.Models.PointOfInterest[]) {
            var route: App.Providers.RouteItem = this.routeProvider.userRoutes.findRouteById(routeName);
            if (pois.length > 0) {
                route.pois(pois);
            }
            else {
                route.pois = ko.observableArray();
                route.version(route.version() + 1);
            }

            this.routeProvider.userRoutes.saveRoutes();
        }

        private startAdminRouteDownload() {
            // Schedule download of administrative routes from server
            var _this = this;
            var indexItem = new System.Providers.HttpDownloadItem("AdminRouteIndex", config.routeAdminIndexUrl + "?format=json",
                function (data: string) {
                    var routeIndex = new App.Controllers.RouteIndex();
                    try {
                        routeIndex = serializer.deserializeJSObject(data, routeIndex);
                        routeController.routeProvider.adminRoutes.clearRoutes();
                        $.each(routeIndex.routes, function (k, routeId: string) {
                            try {
                                // We found a new route
                                var routeItem = new System.Providers.HttpDownloadItem("AdminRoute:" + routeId, config.routeAdminDownloadUrl + "/" + routeId + "?format=json",
                                    function (d: string) {
                                        _this.processNewAdminRoute(d);
                                    }, null, null, "json");
                                httpDownloadProvider.enqueueItem("Route", System.Providers.HttpDownloadQueuePriority.Low, routeItem);
                            } catch (exception) {
                                log.error("RouteController", "Exception route \"" + routeId + "\" index: " + exception);
                            }

                        });
                    } catch (exception) {
                        log.error("RouteController", "Exception deserializing route index: " + exception);
                    }
                });
            httpDownloadProvider.enqueueItem("Route", System.Providers.HttpDownloadQueuePriority.Low, indexItem);
        }

        private processNewAdminRoute(d: any) {
            // We got a new route
            var r = new App.Providers.RouteItem();
            r = serializer.deserializeKnockoutObject(d.data, r);
            var newPois: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();

            $.each(r.pois(), function (k, v2: App.Models.PointOfInterest) {
                var poi = new App.Models.PointOfInterest();
                $.extend(poi, v2);
                poi.pos = <System.Models.KnockoutObservablePosition>ko.observable(poi.pos);
                newPois.push(poi);
            });
            r.pois = newPois;
            routeController.routeProvider.adminRoutes.addRoute(r);
            routeController.routeProvider.adminRoutes.saveRoutes();
        }

        /**
            Upload a route to the server
            @method App.Controllers.RouteController#uploadAdminRoute
            @param {App.Providers.RouteItem} route
            @param {string} pwd
            @public
        */
        public uploadAdminRoute(route: App.Providers.RouteItem, pwd: string) {

            var req = new App.Controllers.RouteControllerRequest();
            req.adminPwd = pwd;
            req.data = serializer.serializeKnockoutObject(route);
            req.id = route.id();
            req.name = route.name();

            //
            var data = serializer.serializeJSObject(req);

            $.ajax({

                url: config.adminRouteUrl,
                type: "POST",
                data: data,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                processdata: true,
                success: function (msg) {
                    userPopupController.sendSuccess(tr.translate("Published"), tr.translate("The route has been published."));
                },
                error: function (msg) {
                    userPopupController.sendError(tr.translate("Not published"), tr.translate("The route has not been published."));
                }

            });
        }
    }
}

var routeController = new App.Controllers.RouteController();
startup.addInit(function () { routeController.Init(); }, "RouteController");
startup.addPostInit(function () { routeController.PostInit(); }, "RouteController");