/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    declare var OpenLayers: any;

    export class MapController {
        public mapProvider: System.Providers.MapProvider = null;
        public panel: any = null;
        private currentMarkerSelected: any;
        private currentMarkerOriginalIcon: string;
        private firstPosition: boolean = true;

        /**
            MapController
            @class App.Controllers.MapController
            @classdesc This class controls map experience for user. For example centers map on new GPS pos.
        */
        constructor() {
        }

        /**
            Creates an instance of System.Providers.MapProvider
            @method App.Controllers.MapController#PreInit
            @public
        */
        public PreInit() {
            log.debug("MapController", "PreInit()");
            this.mapProvider = new System.Providers.MapProvider();
            startup.finishedPreInit("MapController");
        }

        /**
            Hooks up the searchresultcallback event to renderView, initiates 
            the map and sets center position for the map
            @method App.Controllers.MapController#Init
            @public
        */
        public postInit() {
            log.debug("MapController", "postInit()");

            //showing map so that it can calculate center
            $("#mapView").show();

            var targetSurface = "map";

            // Set CSS for map
            //var mapSurface: JQuery = $("#" + targetSurface);
            //mapSurface.css('width', '100%');
            //mapSurface.css('position', 'relative');
            //mapSurface.css('height', '300px');

            var m = this.mapProvider;
            m.Init(false, targetSurface, settings.startMapType());

            // Add standard caching
            //TODO: Patching in openlayers.mobile and comment this in again
            if (config.mapUseCache) {
                mapCacheProvider.addCacheToMap("standard", this.mapProvider.map);
            }

            // Set map center
            m.setCenter(config.mapStartPos, settings.startMapZoomLevel());

            var rv = this.renderView;
            
            //$("body").append('<div id="mapSearchDialog" title="' + tr.translate("Search for place") + '" class="bigDialog"></div>');
            //$("body").append('<div id="mapResultToRouteDialog" title="' + tr.translate("Create route from search") + '" class="bigDialog"></div>');

            searchController.addSearchResultCallback((event: JQueryEventObject, searchResult: App.Models.SearchResult, inRoute: boolean) => {
                rv(this, searchResult, inRoute);
            });

            //this.mapProvider.addMapClickEvent(function mapClick(e) {
            //    var lonlat = _this.mapProvider.getPosFromPx(e.xy);
            //    searchController.searchCriteria.pos(new System.Models.Position(lonlat.lat, lonlat.lon));
            //    searchController.doSearch();
            //    log.debug("MapController", "Map clicked on: " + lonlat.lon + ", " + lonlat.lat);
            //});

            var _this = this;
            gpsProvider.addPositionChangedHandler((event: JQueryEventObject, pos: System.Models.Position) => {
                mapController.mapProvider.updateCenterMarker(config.mapCenterMarker, pos);

                if (_this.firstPosition) {
                    _this.firstPosition = false;
                    _this.mapProvider.setCenter(pos);
                }
            });


            var zb = new OpenLayers.Control.Button({
                title: tr.translate("My position"),
                text: "<span class='typcn mapTypIconButton'><svg><path fill='white' d='M12 20c3.86 0 7-3.141 7-7s-3.14-7-7.003-7c-3.858 0-6.997 3.141-6.997 7s3.14 7 7 7zm-1-11.898v1.898c0 .553.448 1 1 1s1-.447 1-1v-1.898c1.956.398 3.5 1.942 3.899 3.898h-1.899c-.552 0-1 .447-1 1s.448 1 1 1h1.899c-.399 1.956-1.943 3.5-3.899 3.898v-1.898c0-.553-.448-1-1-1s-1 .447-1 1v1.898c-1.956-.398-3.5-1.942-3.899-3.898h1.899c.552 0 1-.447 1-1s-.448-1-1-1h-1.899c.399-1.956 1.942-3.5 3.899-3.898z'/></svg></span>",
                trigger: () => {
                    var pos = gpsProvider.lastPos;
                    if (!pos)
                        pos = config.mapStartPos;
                    this.mapProvider.setCenter(pos, settings.startMapZoomLevel());
                }
            });
            this.panel = new OpenLayers.Control.Panel({
                vertical: true,
                defaultControl: zb,
                createControlMarkup: function (control) {
                    var text = $(control.text);
                    return text[0];
                }
            });
            this.panel.addControls([
                zb,
                new OpenLayers.Control.ZoomIn({
                    title: tr.translate("Zoom in"),
                    text: "<span class='typcn mapTypIconButton'><svg><path fill='white' d='M18 10h-4v-4c0-1.104-.896-2-2-2s-2 .896-2 2l.071 4h-4.071c-1.104 0-2 .896-2 2s.896 2 2 2l4.071-.071-.071 4.071c0 1.104.896 2 2 2s2-.896 2-2v-4.071l4 .071c1.104 0 2-.896 2-2s-.896-2-2-2z'/></svg></span>",
                }),
                new OpenLayers.Control.ZoomOut({
                    title: tr.translate("Zoom out"),
                    text: "<span class='typcn mapTypIconButton'><svg><path fill='white' d='M18 11h-12c-1.104 0-2 .896-2 2s.896 2 2 2h12c1.104 0 2-.896 2-2s-.896-2-2-2z'/></svg></span>",
                }),
                new OpenLayers.Control.Button({
                    title: tr.translate("Search"),
                    text: "<span class='typcn mapTypIconButton'><img style='margin:10%; height:80%; width:80%;' src='./../img/skilt-icon.png'></img></span>",
                    trigger: () => {
                        clickHelper.suppress(() => viewController.selectView("placeSearch"), 500);
                    }
                }),
                new OpenLayers.Control.Button({
                    title: tr.translate("Change map layer"),
                    text: "<span class='typcn mapTypIconButton'><svg><circle fill='white' cx='8.5' cy='8.501' r='2.5'/><path fill='white' d='M16 10c-2 0-3 3-4.5 3s-1.499-1-3.5-1c-2 0-3.001 4-3.001 4h14.001s-1-6-3-6zM20 3h-16c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-12c0-1.103-.897-2-2-2zm0 14h-16v-12h16v12z'/></svg></span>",
                    trigger: () => {
                        clickHelper.suppress(this.nextMapLayer.bind(this), 500);
                    }
                }),
                new OpenLayers.Control.Button({
                    title: tr.translate("Cache result"),
                    text: "<span class='typcn mapTypIconButton'><svg><path fill='white' d='M18.364 6.635c-1.561-1.559-4.1-1.559-5.658 0l-4.534 4.535c-.473.473-.733 1.1-.733 1.77 0 .668.261 1.295.732 1.768.487.486 1.128.73 1.769.73.64 0 1.279-.242 1.767-.73l2.122-2.121c.391-.395.586-.904.586-1.414 0-.512-.195-1.023-.586-1.414l-3.536 3.535c-.193.195-.511.195-.708-.002-.127-.127-.146-.275-.146-.352 0-.078.019-.227.146-.354l4.535-4.537c.778-.779 2.048-.779 2.83 0 .779.779.779 2.049 0 2.828l-4.537 4.537-2.535 2.535c-.779.779-2.049.779-2.828 0-.78-.779-.78-2.049 0-2.828l.095-.096c-.451-.6-.702-1.359-.702-2.125l-.807.807c-1.56 1.559-1.56 4.098 0 5.656.779.779 1.804 1.17 2.828 1.17s2.049-.391 2.828-1.17l7.072-7.072c1.56-1.559 1.56-4.096 0-5.656z'/></svg></span>",
                    trigger: () => {
                        this.addResultToCache();
                    }
                })
            ]);
            this.mapProvider.map.addControl(this.panel);

            var clickholdCtrl = new OpenLayers.Control.Clickhold({
                autoActivate: true
            });

            clickholdCtrl.events.register('click', {}, evt => {
                if (this.isControlPanel(evt.evt))
                    return;

                // Hide potential poiPreview since it is a new search
                poiController.hidePoiPreviewOnly();

                this.initiateSearch(evt);
            });

            clickholdCtrl.events.register('clickhold', {}, (evt) => {
                if (this.isControlPanel(evt.evt))
                    return;

                this.initiateSearch(evt);
            });

            this.mapProvider.map.addControl(clickholdCtrl);
        }

        private isControlPanel(event: Event): boolean {
            var target = <HTMLElement> event.target;
            return (target.className.indexOf("olControlPanel") != -1);
        }

        private initiateSearch(e: any): void {
            var lonlat = this.mapProvider.getPosFromPx(e.xy);

            searchController.searchCriteria.pos(new System.Models.Position(lonlat.lat, lonlat.lon));
            searchController.doNewSearch();
        }

        /**
            Creates a route based on the current search result
            Caches the route
            @method App.Controllers.MapController#addResultToCache
            @public
        */
        public addResultToCache() {
            var mapResultToRoute = $("#addResultToCache");
            var content = $("<div class='center marginBig padding'><b>" + tr.translate("Name of new route") + ":</b><br/>"
                + "<div class='nobr'><input type='text' id='mapResultToRouteName' /></div></div>");
            var btnCreate = $("<input type='button' value='" + tr.translate("Create") + "' />");
            var btnCancel = $("<input type = 'button' value ='" + tr.translate("Cancel") + "' / >");

            btnCreate.mousedown(function () {
                var routeName = $("#mapResultToRouteName").val();
                if (routeName) {

                    var route = routeController.routeProvider.userRoutes.findRouteByName(routeName);
                    if (route == null) {
                        routeController.addSearchRoute(routeName, searchController.latestSearchResult.items());
                        userPopupController.sendSuccess(tr.translate("Route created"), tr.translate("The route '{0}' was created.", [routeName]));
                        viewController.goBack();
                    }
                    else {
                        userPopupController.sendInfo(tr.translate("ROUTE_NOT_ADDED"), tr.translate("ROUTE_NOT_ADDED_MSG"));
                    }
                }
            });

            btnCancel.mousedown(function () {
                viewController.goBack();
            });

            content.append(btnCreate);
            content.append(btnCancel);
            mapResultToRoute.html('');
            mapResultToRoute.append(content);

            viewController.selectView("addResultToCache");
        }

        private nextMapLayer() {
            var curMap = this.mapProvider.mapType;
            var firstMap: string = null;
            var setNext: boolean = false;
            var _this = this;
            $.each(settings.mapTypes(), function (k, v) {
                if (!firstMap)
                    firstMap = v.id;

                if (setNext) {
                    setNext = false;
                    _this.mapProvider.changeLayer(v.id);
                }

                if (v.id == curMap)
                    setNext = true;
            });

            if (setNext) {
                setNext = false;
                _this.mapProvider.changeLayer(firstMap);
            }
        }

        private searchClick(eventObject: JQueryMouseEventObject): void {
            var mapSearchDialogD: any = $("#mapSearchDialog");
            var mapSearchResult = $("#mapSearchResult");
            var mapSearchInputBox = $("#mapSearchInputBox");
            mapSearchResult.html('');

            var searchStr: string = mapSearchInputBox.val();
            searchStr = searchStr.trim();
            if (searchStr == "" || searchStr == null) {
                return;
            }

            loadingScreenController.showLoadingScreen("");
            var ssrSearch = new App.SearchProviders.SSRSearch();
            mapSearchResult.html('');
            ssrSearch.search(searchStr,
                function (searchResult: App.SearchProviders.SSRSearchResult) {
                    $.each(searchResult.items, function (k, v: App.SearchProviders.SSRSearchItem) {
                        var newDiv = $("<div>").append("<h3>" + v.stedsnavn() + "</h3>[" + v.navnetype() + "] " + v.fylkesnavn() + " / " + v.kommunenavn())
                            .mousedown(function () {
                                searchController.searchCriteria.pos(v.pos);
                                searchController.doNewSearch();

                                viewController.goBack();
                            });
                        mapSearchResult.append(newDiv);
                    });
                    if (searchResult.items.length < 1) {
                        mapSearchResult.append("Ingen treff");
                    }
                    loadingScreenController.hideLoadingScreen();
                },
                function (errorMessage: string) {
                    log.error("MapController", "Error searching SSR: " + errorMessage);
                    userPopupController.sendError("SSR feil", "Feil ved søk i stedsnavnregisteret.");
                });

        }

        /**
            Renders the mapview, adding and positioning markers from searchresult to the map
            @method App.Controllers.MapController#renderView
            @private
            @param {MapController} _this
            @param {App.Models.SearchResult} searchResult
            @param {boolean} inRoute A route is being shown
        */
        private renderView(_this: MapController, searchResult: App.Models.SearchResult, inRoute: boolean) {
            log.debug("MapController", "renderView()");

            _this.mapProvider.clearMarkers();

            // Set senter of map to search location (not when showing a route)
            // Also place marker in search position after drawing pois
            if (!inRoute) {
                _this.mapProvider.setCenter(searchController.searchCriteria.pos());
                _this.mapProvider.addLocationMarker(config.mapSearchLocationMarker, searchController.searchCriteria.pos());
            }

            // Place center marker (user location) if position is known
            if (gpsProvider.lastPos) {
                _this.mapProvider.addCenterMarker(config.mapCenterMarker, gpsProvider.lastPos);
            }

            var first: boolean = true;
            $.each(searchResult.items(), function (k, v: App.Models.PointOfInterest) {
                try {
                    if (inRoute && first) {
                        _this.mapProvider.setCenter(v.pos(), config.mapCacheValidZoomLevels[0]);
                        first = false;
                    }

                    return _this.mapProvider.addMarker(v, function () {
                        _this.poiClicked(v, this);
                    }, "activeMarker");
                } catch (exception) {
                    log.debug("MapController", "Error on addMarker: " + v.name() + ": " + exception);
                }
            });
        }

        public resetClickedPois() {
            //set tilbake til originalicon
            if (!this.currentMarkerSelected)
                return;
            else
            {
                this.currentMarkerSelected.icon.setUrl(this.currentMarkerOriginalIcon);
                this.currentMarkerSelected = null;
                this.currentMarkerOriginalIcon = "";
            }
        }

        private poiClicked(poi: App.Models.PointOfInterest, marker: any) {
            log.debug("Map", "Clicked " + poi.id());

            this.resetClickedPois();

            this.currentMarkerSelected = marker;
            this.currentMarkerOriginalIcon = poi.iconInactiveCategoryURL();
            this.currentMarkerSelected.icon.setUrl(poi.iconActiveCategoryURL());

            poiController.OpenPreview(poi, true);
        }

    }
}

var mapController = new App.Controllers.MapController();

startup.addPreInit(function () { mapController.PreInit(); }, "MapController");
startup.addPostInit(function () { mapController.postInit(); }, "MapController");
//startup.addPreInit(errorTool.delayedExecuteTryCatchUserMessage("Feil", "Feil ved klargjøring av kart (PreInit). Se logg for detaljer.", function () { mapController.PreInit(); }, null, "MapController", "PreInit"), "MapController");
//startup.addInit(errorTool.delayedExecuteTryCatchUserMessage("Feil", "Feil ved klargjøring av kart (Init). Se logg for detaljer.", function () { mapController.Init(); }, null, "MapController", "Init"), "MapController");
