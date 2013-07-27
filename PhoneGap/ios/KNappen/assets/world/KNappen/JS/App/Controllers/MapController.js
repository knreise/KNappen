var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Controllers
    */
    (function (Controllers) {
        var MapController = (function () {
            /**
            MapController
            @class App.Controllers.MapController
            @classdesc This class controls map experience for user. For example centers map on new GPS pos.
            */
            function MapController() {
                this.mapProvider = null;
                this.panel = null;
            }
            /**
            Creates an instance of System.Providers.MapProvider
            @method App.Controllers.MapController#PreInit
            @public
            */
            MapController.prototype.PreInit = function () {
                log.debug("MapController", "PreInit()");
                this.mapProvider = new System.Providers.MapProvider();
            };

            /**
            Hooks up the searchresultcallback event to renderView, initiates
            the map and sets center position for the map
            @method App.Controllers.MapController#Init
            @public
            */
            MapController.prototype.Init = function () {
                log.debug("MapController", "Init()");

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

                if (config.mapUseCache)
                    mapCacheProvider.addCacheToMap("standard", this.mapProvider.map);

                // Set map center
                m.setCenter(config.mapStartPos, settings.startMapZoomLevel());

                //gpsProvider.addPositionChangedHandler(
                //    function (event: JQueryEventObject, pos: System.Models.Position) {
                //            // Set center to new position
                //            m.setCenter(pos, 15);
                //    }
                //);
                var rv = this.renderView;
                var _this = this;

                $("body").append('<div id="mapSearchDialog" title="' + tr.translate("Search for place") + '" class="bigDialog"></div>');
                $("body").append('<div id="mapResultToRouteDialog" title="' + tr.translate("Create route from search") + '" class="bigDialog"></div>');

                searchController.addSearchResultCallback(function (event, searchResult) {
                    rv(_this, searchResult);
                });

                //this.mapProvider.addMapClickEvent(function mapClick(e) {
                //    var lonlat = _this.mapProvider.getPosFromPx(e.xy);
                //    searchController.searchCriteria.pos(new System.Models.Position(lonlat.lat, lonlat.lon));
                //    searchController.doSearch();
                //    log.debug("MapController", "Map clicked on: " + lonlat.lon + ", " + lonlat.lat);
                //});
                var zb = new OpenLayers.Control.Button({
                    title: tr.translate("My position"),
                    text: "<span class='typcn typcn-radar mapTypIconButton'></span>",
                    trigger: function () {
                        var pos = gpsProvider.lastPos;
                        if (!pos)
                            pos = config.mapStartPos;
                        _this.mapProvider.setCenter(pos, settings.startMapZoomLevel());
                    }
                });
                this.panel = new OpenLayers.Control.Panel({
                    defaultControl: zb,
                    createControlMarkup: function (control) {
                        var button = document.createElement('button'), iconSpan = document.createElement('span'), textSpan = document.createElement('span');
                        iconSpan.innerHTML = '&nbsp;';
                        button.appendChild(iconSpan);
                        if (control.text) {
                            textSpan.innerHTML = control.text;
                        }
                        button.appendChild(textSpan);
                        return button;
                    }
                });
                this.panel.addControls([
                    zb,
                    new OpenLayers.Control.ZoomIn({
                        title: tr.translate("Zoom in"),
                        text: "<span class='typcn typcn-plus mapTypIconButton'></span>"
                    }),
                    new OpenLayers.Control.ZoomOut({
                        title: tr.translate("Zoom out"),
                        text: "<span class='typcn typcn-minus mapTypIconButton'></span>"
                    }),
                    new OpenLayers.Control.Button({
                        title: tr.translate("Search"),
                        text: "<span class='typcn typcn-sort-alphabetically mapTypIconButton'></span>",
                        trigger: function () {
                            var pos = gpsProvider.lastPos;
                            if (!pos)
                                pos = config.mapStartPos;
                            _this.openPlaceSearch();
                        }
                    }),
                    new OpenLayers.Control.Button({
                        title: tr.translate("Change map layer"),
                        text: "<span class='typcn typcn-image mapTypIconButton'></span>",
                        trigger: function () {
                            _this.nextMapLayer();
                        }
                    }),
                    new OpenLayers.Control.Button({
                        title: tr.translate("Cache result"),
                        text: "<span class='typcn typcn-attachment mapTypIconButton'></span>",
                        trigger: function () {
                            _this.addResultToCache();
                        }
                    })
                ]);
                this.mapProvider.map.addControl(this.panel);

                var clickholdCtrl = new OpenLayers.Control.Clickhold({
                    autoActivate: true
                });

                clickholdCtrl.events.register('click', {}, function (evt) {
                    var lonlat = _this.mapProvider.getPosFromPx(evt.xy);
                    searchController.searchCriteria.pos(new System.Models.Position(lonlat.lat, lonlat.lon));
                    searchController.doSearch();
                });

                clickholdCtrl.events.register('clickhold', {}, function (evt, ms) {
                    //log.debug("MapController", "Map clickhold");
                    var lonlat = _this.mapProvider.getPosFromPx(evt.xy);
                    searchController.searchCriteria.pos(new System.Models.Position(lonlat.lat, lonlat.lon));
                    searchController.doSearch();
                });

                this.mapProvider.map.addControl(clickholdCtrl);
            };

            MapController.prototype.addResultToCache = function () {
                var mapResultToRouteDialog = $("#mapResultToRouteDialog");
                var mapResultToRouteDialogD = mapResultToRouteDialog;
                var content = $("<div><b>" + tr.translate("Name of new route") + ":</b><br/>" + "<div class='nobr'><input type='input' id='mapResultToRouteName' /></div></div>");
                var btn = $("<input type='button' value='" + tr.translate("Create") + "' />");

                btn.mousedown(function () {
                    var routeName = $("#mapResultToRouteName").val();
                    if (routeName) {
                        routeController.addSearchRoute(routeName, searchController.latestSearchResult.items());
                        userPopupController.sendSuccess(tr.translate("Route created"), tr.translate("The route '{0}' was created.", [routeName]));
                        mapResultToRouteDialogD.dialog("close");
                    }
                });

                content.append(btn);
                mapResultToRouteDialog.html('');
                mapResultToRouteDialog.append(content);

                mapResultToRouteDialogD.dialog({
                    autoOpen: true,
                    maxWidth: '90%',
                    maxHeight: '90%',
                    //                width: '70%',
                    //                height: '50%',
                    modal: true
                });
            };

            MapController.prototype.nextMapLayer = function () {
                var curMap = this.mapProvider.mapType;
                var firstMap = null;
                var setNext = false;
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
            };

            /**
            Displays SSR search popup dialog
            @method App.Controllers.MapController#openPlaceSearch
            @public
            */
            MapController.prototype.openPlaceSearch = function () {
                var _this = this;
                var mapSearchDialogD = $("#mapSearchDialog");
                var mapSearchDialog = $("#mapSearchDialog");

                var html = "<input id='mapSearchInputBox' type='text' /><input id='mapSearchCommit' type='button' value='" + tr.translate("Search") + "' /><br/><div id='mapSearchResult'></div>";
                mapSearchDialog.html(html);
                var mapSearchCommit = $("#mapSearchCommit");
                var mapSearchInputBox = $("#mapSearchInputBox");

                mapSearchCommit.mousedown(this.searchClick);
                mapSearchInputBox.keypress(function (e) {
                    if (e.which == 13) {
                        _this.searchClick(null);
                    }
                });

                mapSearchDialogD.dialog({
                    autoOpen: true,
                    maxWidth: $(window).width() - 50,
                    maxHeight: $(window).height() - 50,
                    width: $(window).width() - 50,
                    height: $(window).height() - 50,
                    modal: true
                });
            };

            MapController.prototype.searchClick = function (eventObject) {
                var mapSearchDialogD = $("#mapSearchDialog");
                var mapSearchResult = $("#mapSearchResult");
                var mapSearchInputBox = $("#mapSearchInputBox");
                mapSearchResult.html('');
                var searchStr = mapSearchInputBox.val();

                var ssrSearch = new App.SearchProviders.SSRSearch();
                mapSearchResult.html('');
                ssrSearch.search(searchStr, function (searchResult) {
                    $.each(searchResult.items, function (k, v) {
                        var newDiv = $("<div>").append("<h2>" + v.stedsnavn() + "</h2>[" + v.navnetype() + "] " + v.fylkesnavn() + " / " + v.kommunenavn()).mousedown(function () {
                            mapController.mapProvider.setCenter(v.pos, settings.startMapZoomLevel());

                            searchController.searchCriteria.pos(v.pos);
                            searchController.doSearch();

                            mapSearchDialogD.dialog("close");
                        });
                        mapSearchResult.append(newDiv);
                    });
                }, function (errorMessage) {
                    log.error("MapController", "Error searching SSR: " + errorMessage);
                    log.userPopup("SSR feil", "Feil ved søk i stedsnavnregisteret.");
                });
            };

            /**
            Renders the mapview, adding and positioning markers from searchresult to the map
            @method App.Controllers.MapController#renderView
            @private
            */
            MapController.prototype.renderView = function (_this, searchResult) {
                log.debug("MapController", "renderView()");
                _this.mapProvider.clearMarkers();
                var first = true;
                $.each(searchResult.items(), function (k, v) {
                    try  {
                        if (first) {
                            _this.mapProvider.setCenter(v.pos());
                            first = false;
                        }
                        _this.mapProvider.addMarker(v, function () {
                            log.debug("Map", "Clicked " + v.id());
                            poiController.OpenPreview(v, true);
                        });
                    } catch (exception) {
                        log.debug("MapController", "Error on addMarker: " + v.name() + ": " + exception);
                    }
                });
            };
            return MapController;
        })();
        Controllers.MapController = MapController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));

var mapController = new App.Controllers.MapController();

startup.addPreInit(function () {
    mapController.PreInit();
}, "MapController");
startup.addInit(function () {
    mapController.Init();
}, "MapController");
//@ sourceMappingURL=MapController.js.map
