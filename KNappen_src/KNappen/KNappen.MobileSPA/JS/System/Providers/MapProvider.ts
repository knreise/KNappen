/// <reference path="../_References.ts" />
/// <reference path="../Models/PointOfInterestBase.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var OpenLayers;
    declare var config: System.ConfigBase;
    declare var google;

    // TODO: Fix for black tiles: https://github.com/ahocevar/openlayers/commit/6607bcc0bbc2032bc6196e5b4090a16cdfeb8837
    // Async fetch for CacheRead: http://osgeo-org.1560.x6.nabble.com/CacheRead-and-CacheWrite-with-Web-SQL-Storage-td4679807.html

    /**
      * 
      * @class Map provider.
      */
    export class MapProvider {
        public map: any = null;
        /** @ignore */ private cacheRead: any = null;
        /** @ignore */ private cacheWrite: any = null;
        /** @ignore */ private cacheReadHits: any = 0;
        /** @ignore */ private cacheWrites: number = 0;
        /** @ignore */ private cacheFull: bool = false;
        /** @ignore */ private layerMarkers: any = null;
        /** @ignore */ private layerWMS: any = null;
        public mapType: string;

        /**
          * MapProvider
          * @class System.Providers.MapProvider
          * @classdesc Map provider using OpenLayers.
          */
        constructor() { }


        /**
          * Initialize the map.
          * @method System.Providers.MapProvider#Init
          * @param {string} targetSurface
          * @param {string} mapType Layer name for initial map
          */
        public Init(isPrecacheMap: bool, targetSurface: string, mapType: string) {

            log.debug("MapProvider", "Init");
            // initialize map when page ready

            OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
            var _this = this;

            if (!isPrecacheMap) {
                // Get rid of address bar on iphone/ipod
                var fixSize = function () {
                    window.scrollTo(0, 0);
                    document.body.style.height = '100%';
                    if (!(/(iphone|ipod)/.test(navigator.userAgent.toLowerCase()))) {
                        if (document.body.parentNode) {
                            var n: any = document.body.parentNode;
                            n.style.height = '100%';
                        }
                    }
                };
                setTimeout(fixSize, 700);
                setTimeout(fixSize, 1500);
            }
            // allow testing of specific renderers via "?renderer=Canvas", etc
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

            // displayProjection: new OpenLayers.Projection("EPSG:4326"), found in sample at http://trac.osgeo.org/openlayers/ticket/3050

            this.map = new OpenLayers.Map({
                units: "m",
                numZoomLevels: config.mapMaxZoomLevel,
                projection: new OpenLayers.Projection('EPSG:900913'),
                mapExtent: new OpenLayers.Bounds(-2500000.0, 3500000.0, 3045984.0, 9045984.0),
                div: targetSurface,
                theme: null,
                controls: [
                    new OpenLayers.Control.Attribution(),
                    new OpenLayers.Control.TouchNavigation({
                        dragPanOptions: {
                            enableKinetic: true
                        }
                    })
                    //,                    new OpenLayers.Control.Zoom()
                ]
            });

            this.map.getNumZoomLevels = function () {
                return (config.mapMaxZoomLevel - config.mapMinZoomLevel + 1);
            };

            this.map.isValidZoomLevel = function (zoomLevel) {
                var valid = ((zoomLevel != null) &&
                    (zoomLevel >= config.mapMinZoomLevel) &&
                    (zoomLevel <= config.mapMaxZoomLevel));
                if (!valid && _this.map.getZoom() == 0) {
                    _this.map.zoomTo(config.mapMaxZoomLevel - (config.mapMaxZoomLevel - config.mapMinZoomLevel) / 2);
                }
                return valid;
            }


            if (!isPrecacheMap) {
                this.changeLayer(mapType);

                this.layerMarkers = new OpenLayers.Layer.Markers("Markers");
                this.map.addLayer(this.layerMarkers);
                this.map.setLayerIndex(this.layerMarkers, 100);


                //this.map.addLayers([this.layerWMS, this.layerMarkers]);
                var _this = this;
                //window.onresize = function () {
                setTimeout(function () { _this.map.updateSize(); }, 300);
                //}

            }

            //    // update the number of cached tiles and detect local storage support
            //    this.map.layers[0].events.on({ 'tileloaded': this.updateStatus });

        }

        /**
          * Change map layer type.
          * @method System.Providers.MapProvider#changeLayer
          * @param {string} mapType Layer type.
          */
        public changeLayer(mapType: string) {
            this.mapType = mapType;
            if (this.layerWMS) {
                this.map.removeLayer(this.layerWMS);
                this.layerWMS.destroy();
            }

            this.layerWMS = this.createLayer(mapType);
            this.map.addLayer(this.layerWMS);
            this.map.setLayerIndex(this.layerWMS, 1000);
        }

        public updateSize() {
            if (this.layerWMS) {
                this.map.removeLayer(this.layerWMS);
                this.map.addLayer(this.layerWMS);
                this.map.setLayerIndex(this.layerWMS, 1000);
            }
            if (this.layerMarkers)
                this.map.setLayerIndex(this.layerMarkers, 100);
            this.map.updateSize();
        }

        /** @ignore */
        public createLayer(mapTypeStr: string, strategies: any = null, buffer: number = 1): any {
            if (!strategies)
                strategies = [new OpenLayers.Strategy.Fixed()];
            var data = mapTypeStr.split(":");
            var mapType = data[0];
            var mapUrlType = data[1];
            var mapLayer = data[2];




            if (mapType == "GoogleStreets")
                return new OpenLayers.Layer.Google("Google Streets");
            if (mapType == "GooglePhysical")
                return new OpenLayers.Layer.Google("Google Physical", { type: google.maps.MapTypeId.TERRAIN });
            if (mapType == "GoogleHybrid")
                return new OpenLayers.Layer.Google("Google Hybrid", { type: google.maps.MapTypeId.HYBRID });
            if (mapType == "GoogleSatellite")
                return new OpenLayers.Layer.Google("Google Satellite", { type: google.maps.MapTypeId.SATELLITE });
            if (mapType == "BingRoad")
                return new OpenLayers.Layer.Bing({ name: "Bing Road", key: config.mapBingAPIKey, type: "Road" });
            if (mapType == "BingHybrid")
                return new OpenLayers.Layer.Bing({ name: "Bing Hybrid", key: config.mapBingAPIKey, type: "AerialWithLabels" });
            if (mapType == "BingAerial")
                return new OpenLayers.Layer.Bing({ name: "Bing Aerial", key: config.mapBingAPIKey, type: "Aerial" });

            if (mapType == "WMS") {
                return new OpenLayers.Layer.WMS("OpenLayers WMS",
                    config.openLayersMapUrl[mapUrlType],
                    {
                        layers: mapLayer,
                        format: "image/jpeg"
                    },
                    {
                        buffer: buffer,
                        isBaseLayer: true,
                        transitionEffect: 'resize',
                        eventListeners: { tileloaded: this.updateHits }
                    },
                    { strategies: strategies }
                    );
            }
            if (mapType == "WMTS") {
                return new OpenLayers.Layer.WMS("OpenLayers WMTS",
                    config.openLayersMapUrl[mapUrlType],
                    {
                        layers: mapLayer,
                        format: "image/jpeg"
                    },
                    {
                        buffer: buffer,
                        isBaseLayer: true,
                        transitionEffect: 'resize',
                        eventListeners: { tileloaded: this.updateHits }
                    }
                    );
            }

            log.error("MapProvider", "Unknown map type: " + mapType);
        }

        /** @ignore */
        private updateStatus(event: JQueryEventObject) {
            //this.cacheWrites = localStorage.length
            //var statusWrite = document.getElementById("mapCacheWriteStatus");
            //if (window.localStorage) {
            //    statusWrite.innerHTML = localStorage.length + " entries written to cache.";
            //} else {
            //    statusWrite.innerHTML = "Local storage not supported. Try a different browser.";
            //}
        }


        // update the number of cached tiles and detect local storage support

        /** @ignore */
        private updateHits(evt) {
            //this.cacheReadHits += evt.tile.url.substr(0, 5) === "data:";

            //var statusRead = document.getElementById("mapCacheReadStatus");
            //if (window.localStorage) {
            //    statusRead.innerHTML = this.readHits + " cache read hits.";
            //} else {
            //    statusRead.innerHTML = "Local storage not supported. Try a different browser.";
            //}
        }

        /** 
          * Add a marker to the map. Returns a marker reference.
          * @method System.Providers.MapProvider#addMarker
          * @param {System.Models.PointOfInterestBase} poi Point of interest to draw on map.
          * @param clickCallback A parameterless callback function for onclick event on marker.
          * @type Marker Marker reference
          */
        public addMarker(poi: System.Models.PointOfInterestBase, clickCallback: { (): void; }): any {
            log.verboseDebug("MapProvider", "PoI: " + poi.id() + " at " + poi.pos().toString());
            var size = new OpenLayers.Size(poi.iconWidth(), poi.iconHeight());
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            var icon = new OpenLayers.Icon(poi.iconCategoryURL(), size, offset);
            var oLonLat = (new OpenLayers.LonLat(poi.pos().lon(), poi.pos().lat())).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
            var marker = new OpenLayers.Marker(oLonLat, icon);
            marker.events.register("click", marker, clickCallback);
            marker.events.register("touchstart", marker, clickCallback);
            this.layerMarkers.addMarker(marker);
            return marker;
        }

        ///** 
        // * Convert coordinates
        // * @method System.Providers.MapProvider#convertCoordinatesToPos
        // * @param {string} projection Old format
        // * @param {number} lon
        // * @param {number} lat
        // */
        //public convertCoordinatesToPos(projection: string, lon: number, lat: number): System.Models.Position {
        //    var newPos = (new OpenLayers.LonLat(lon, lat)).transform(new OpenLayers.Projection(projection), new OpenLayers.Projection("EPSG:4326"));
        //    return new System.Models.Position(newPos.lat, newPos.lon);
        //}

        /**
            *
            *
        */
        //TODO: accept a function to bind to the event

        public addMapClickEvent(clickCallback: { (e): void; }) {
            log.debug("MapProvider", "addClickEvent");
            //this.map.events.register('click', this.map, clickCallback);
            //this.map.events.register('touchstart', this.map, clickCallback);
            //this.clickControl.events.register('clickhold', this.map, clickCallback);
        }


        /** 
          * Get GPS pos from xy coordinates on map.
          * @method System.Providers.MapProvider#getPosFromPx
          * @param {any} yx Pixel coodinates
          * @returns {any} GPS position
          */
        public getPosFromPx(xy) {
            return this.map.getLonLatFromPixel(xy).transform(this.map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"));
        }

        /**
          * Remove a marker.
          * @method System.Providers.MapProvider#removeMarker
          * @param {Marker} marker A marker reference received from {addMarker}
          */
        public removeMarker(marker: any) {
            marker.erase();
            marker.destroy();
        }

        /**
          * Clear all markers from map.
           * @method System.Providers.MapProvider#clearMarkers
          */
        public clearMarkers() {
            this.layerMarkers.clearMarkers();
        }

        /**
          * Set map center and zoom level.
          * @method System.Providers.MapProvider#setCenter
          * @param {System.Models.Position} pos Position to center map on.
          * @param {number} zoomLevel Zoom level is between 1 and 15. (TODO: Verify zoomlevel.)
          */
        public setCenter(pos: System.Models.Position, zoomLevel?: number) {
            log.debug("MapProvider", "setCenter: Zoomlevel: " + zoomLevel);
            var oLonLat = (new OpenLayers.LonLat(pos.lon(), pos.lat())).transform(new OpenLayers.Projection("EPSG:4326"), this.map.getProjectionObject());
            if (zoomLevel)
                this.map.setCenter(oLonLat, zoomLevel);
            else
                this.map.setCenter(oLonLat);
        }
    }


}