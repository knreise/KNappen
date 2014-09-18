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
            Load routes
            @method App.Controllers.RouteController#Init
        */
        public Init() {
            log.debug("RouteController", "Init()");
            viewController.addSelectEvent((event: JQueryEventObject, oldView: System.GUI.ViewControllerItem, newView: System.GUI.ViewControllerItem) => {
                if (newView.name == "routeView")
                    this.renderRouteView();
            });

            this.routeProvider.loadRoutes();
            this.startAdminRouteDownload();
        }

        /**
            Add a single route to queue for precaching
            @method App.Controllers.RouteController#cacheRoute
            @param {App.Providers.RouteItem} route Route to precache
        */
        public cacheMapForRoute(route: App.Providers.RouteItem) {
            loadingScreenController.showLoadingScreen("Laster ned...");
            this.loadRoutePois(route, (r) => this.startMapPreCache(r), false);
        }

        private loadRoutePois(route: App.Providers.RouteItem, callback: (routeWithPois: App.Providers.RouteItem) => void, showLoadingScreen: boolean = true) {
            if (route.poisLoaded()) {
                callback(route);
            } else {
                if (showLoadingScreen)
                    loadingScreenController.showLoadingScreen("Laster inn rute");

                // Load POIs from SQL.
                this.routeProvider.loadPois(route, () => {
                    callback(route);
                    if (showLoadingScreen)
                        loadingScreenController.hideLoadingScreen();
                });
            }
        }

        private startMapPreCache(route: App.Providers.RouteItem) {
            var pois = route.pois();

            if (pois && pois.length > 0) {

                log.debug("RouteController", "Started caching map tiles for route " + route.name());
                
                mapPreCacheProvider.cachePois(pois, (success: boolean) => {
                    if (success) {
                        this.routeProvider.setRouteIsCached(route);

                        // Tell user caching is a success
                        userPopupController.sendSuccess(tr.translate("ROUTE_DOWNLOAD_SUCCESS"), tr.translate("ROUTE_DOWNLOAD_SUCCESS_MSG", [route.name()]));
                    }
                    else {
                        // Storage quota reached or CORS violation (see MapStorageProvider#set)
                        userPopupController.sendError(tr.translate("ROUTE_DOWNLOAD_FAILURE"), tr.translate("ROUTE_DOWNLOAD_FAILURE_MSG", [route.name()]));
                    }

                    // Clear loadingscreen
                    log.debug("RouteController", "Finished caching map tiles for route " + route.name() + ", success = " + success);
                    loadingScreenController.hideLoadingScreen();

                    // Refresh view
                    viewController.selectViewWithoutHistory("routeView", true);
                });
            }
        }

        public clearCache(): void {
            mapStorageProvider.clearCache();

            var adminRoutes = this.routeProvider.adminRoutes.getRoutes();
            adminRoutes.forEach((route: App.Providers.RouteItem) => {
                this.routeProvider.resetRouteIsCached(route);
            });

            var userRoutes = this.routeProvider.userRoutes.getRoutes();
            userRoutes.forEach((route: App.Providers.RouteItem) => {
                this.routeProvider.resetRouteIsCached(route);
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

            var route: App.Providers.RouteItem = new App.Providers.RouteItem();
            route.name(routeName);

            pois.forEach((poi: App.Models.PointOfInterest) => {
                route.pois.push(poi.toRouteFriendly());
            });

            this.routeProvider.userRoutes.addRoute(route);
            this.routeProvider.saveRoute(route);
        }

        /**
            Creates a new route
            @method App.Controllers.RouteController#Init
            @param {string} name
            @param {App.Models.PointOfInterest} poi
        */
        public createRoute(name: string): App.Providers.RouteItem {
            var route = new App.Providers.RouteItem();

            route.name(name);
            route.type(App.Providers.RouteType[App.Providers.RouteType.User]);
            route.poisLoaded(true);

            this.routeProvider.userRoutes.addRoute(route);
            this.routeProvider.saveRoute(route);

            userPopupController.sendSuccess(tr.translate("Route created"), tr.translate("The route '{0}' was created.", [name]));

            this.renderRouteView();
            return route;
        }

        public deleteRoute(id: string) {
            log.debug("RouteController", "Deleting route: " + id);

            var route = routeController.routeProvider.userRoutes.findRouteById(id);

            if (route != null) {
                this.routeProvider.userRoutes.removeRoute(route);
                this.routeProvider.deleteRoute(route);
            }
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
            routeController.routeProvider.adminRoutes.getRoutes().forEach((route: App.Providers.RouteItem) => {
                var routeIdSelect = "routeSelect_" + route.id();
                var routeIdEdit = "routeEdit_" + route.id();
                var routeIdSave = "saveRoute_" + route.id();

                if (route.name() == '')
                    route.name('<span class="grey">Mangler navn</span>');

                $editorialRoutes.append('<li class="routeListItem" id="routeListItem_' + route.id() + '"><h3>' + route.name() + '</h3>'
                    + '<input type="button" value="' + tr.translate("Follow route") + '" id="' + routeIdSelect + '"/>'
                    + '<input type="button" value="Last ned" id="' + routeIdSave + '"/>'
                    + '</li>');

                $("#" + routeIdSelect).mousedown(() => {
                    this.selectRoute(route);
                });

                $("#" + routeIdSave).mousedown(() => {
                    this.cacheMapForRoute(route);
                });

                if (route.isCached && route.isCached()) {
                    $("#" + routeIdSave).attr({ disabled: "", value: "Nedlastet" });
                }
            });

            routeController.routeProvider.userRoutes.getRoutes().forEach((route: App.Providers.RouteItem) => {
                var routeIdSelect = "routeSelect_" + route.id();
                var routeIdEdit = "routeEdit_" + route.id();
                var routeIdPublish = "routePublish_" + route.id();
                var routeIdPublishPwdBox = "Pwd_" + routeIdPublish;
                var routeIdPublishBtn = "Btn_" + routeIdPublish;
                var routeIdPwd = "Pwd_" + route.id();
                var routeIdSave = "saveRoute_" + route.id();

                var publishButton: string = "";
                if (settings.adminPassword())
                    publishButton = '<input type="button" value="Publiser" id="' + routeIdPublishBtn + '"/>';

                if (route.name() == '')
                    route.name('<span class="grey">Mangler navn</span>');
                $userRoutes.append('<li class="routeListItem" id="routeListItem_' + route.id() + '"><h3>' + route.name()
                    + '</h3><input type="button" value="' + tr.translate("Follow route") + '" id="' + routeIdSelect + '"/>'
                    + '<input type="button" value="' + tr.translate("Edit") + '" id="' + routeIdEdit + '"/>'
                    + '<input type="button" value="Last ned" id="' + routeIdSave + '"/>'
                    + publishButton
                    + '</li>');

                $("#" + routeIdSelect).mousedown(() => {
                    this.selectRoute(route);
                });

                $("#" + routeIdEdit).mousedown(() => {
                    viewController.selectView("listView");
                    this.loadRoutePois(route, (routeWithPois) => {
                        resultListController.renderView(routeWithPois.pois(), routeWithPois.pois().length, null, routeWithPois.id(), true);
                    });
                });

                $("#" + routeIdSave).mousedown(() => {
                    this.cacheMapForRoute(route);
                });

                $("#" + routeIdPublishBtn).mousedown(() => {
                    this.loadRoutePois(route, () => {
                        this.uploadAdminRoute(route, settings.adminPassword());
                    });
                });

                if (route.isCached && route.isCached()) {
                    $("#" + routeIdSave).attr({ disabled: "", value: "Nedlastet" });
                }
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

            this.loadRoutePois(route, (routeWithPois) => {
                searchResult.items(routeWithPois.pois());
                searchResult.numFound(routeWithPois.pois().length);
                searchResult.numPages(1);

                searchController.searchCriteria.pageNumber(1);
                searchController.searchResultCallback(searchController, searchResult, true);
                viewController.selectView(settings.startView());
            });
        }

        /**
            Updates a route after editing
            @method App.Controllers.RouteController#updateRoute
            @param {string} routeId
            @param {App.Models.PointOfInterest[]} pois
            @public
        */
        public updateRoute(routeId: string, pois: App.Models.PointOfInterest[]) {
            var route: App.Providers.RouteItem = this.routeProvider.userRoutes.findRouteById(routeId);

            if (pois.length > 0) {
                route.pois(pois);
            }
            else {
                route.pois = ko.observableArray();
            }

            route.incrementVersion();
            route.isCached(false);
            this.routeProvider.saveRoute(route);
        }

        private startAdminRouteDownload() {
            var indexItem = new System.Providers.HttpDownloadItem("AdminRouteIndex", config.routeAdminIndexUrl + "?format=json", (data: string) => this.processAdminRouteIndex(data));
            httpDownloadProvider.enqueueItem("Route", System.Providers.HttpDownloadQueuePriority.Low, indexItem);
        }

        private processAdminRouteIndex(data: string) {
            try {
                var routeIndex = new App.Controllers.RouteIndex();
                routeIndex = serializer.deserializeJSObject(data, routeIndex);

                var adminRoutes = this.routeProvider.adminRoutes.getRoutes();
                var routesToDelete = adminRoutes.filter((route: App.Providers.RouteItem) => routeIndex.routes.indexOf(route.id()) == -1);

                if (routesToDelete.length > 0) {
                    routesToDelete.forEach((route: App.Providers.RouteItem) => {
                        this.routeProvider.adminRoutes.removeRoute(route);
                        this.routeProvider.deleteRoute(route);
                    });
                }

                var routesToAdd = routeIndex.routes.filter((value: string) => this.routeProvider.adminRoutes.findRouteById(value) == null);

                if (routesToAdd.length > 0) {
                    for (var i in routesToAdd) {
                        var routeId = routesToAdd[i];
                        var routeItem = new System.Providers.HttpDownloadItem("AdminRoute:" + routeId, config.routeAdminDownloadUrl + "/" + routeId + "?format=json", this.processNewAdminRoute, null, null, "json", routeId);
                        httpDownloadProvider.enqueueItem("Route", System.Providers.HttpDownloadQueuePriority.Low, routeItem);
                    }
                }
            } catch (exception) {
                log.error("RouteController", "Exception deserializing route index: " + exception);
            }
        }

        private processNewAdminRoute(data: any, routeId: string) {
            try {
                var route = new App.Providers.RouteItem();
                route = serializer.deserializeKnockoutObject(data.data, route);
                var newPois: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();

                route.pois().forEach((poi: App.Models.PointOfInterest) => {
                    var pointOfInterest = new App.Models.PointOfInterest();
                    $.extend(pointOfInterest, poi);
                    pointOfInterest.pos = <System.Models.KnockoutObservablePosition>ko.observable(pointOfInterest.pos);
                    newPois.push(pointOfInterest);
                });

                route.id(routeId);
                route.pois = newPois;
                route.isCached(false);
                route.poisLoaded(true);
                route.type(App.Providers.RouteType[App.Providers.RouteType.Admin]);

                routeController.routeProvider.adminRoutes.addRoute(route);
                routeController.routeProvider.saveRoute(route);
                routeController.routeProvider.removeAllPoisFromMemory();
            } catch (exception) {
                log.error("RouteController", "Exception deserializing route: " + exception);
            }
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
                success: msg => {
                    userPopupController.sendSuccess(tr.translate("Published"), tr.translate("The route has been published."));
                },
                error: msg => {
                    userPopupController.sendError(tr.translate("Not published"), tr.translate("The route has not been published."));
                }

            });
        }
    }
}

var routeController = new App.Controllers.RouteController();
startup.addInit(() => { routeController.Init(); }, "RouteController");