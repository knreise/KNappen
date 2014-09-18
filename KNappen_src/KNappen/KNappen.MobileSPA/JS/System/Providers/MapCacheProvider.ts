/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var config;
    declare var OpenLayers;

    export class MapCacheProvider {

        public enabledStandardCaching: boolean = false;

        /**
          * MapCacheProvider
          * @class System.Providers.MapCacheProvider
          * @classdesc Map caching provider for OpenLayers, implements custom CacheRead and CacheWrite controls
          */
        constructor() { }

        /**
          * Enable/disable caching of 'standard' map to database.
          * @method System.Providers.MapStorageProvider#setEnabled
          * @param {bool} enable Enable storage provider.
         */
        public setEnabled(enabled: boolean) {
            log.debug("MapStorageProvider", "Setting enabled state to: " + enabled);
            this.enabledStandardCaching = enabled;
        }

        /**
          * Initialize cache on map.
          * @method System.Providers.MapCacheProvider#addCacheToMap
          * @param {string} cachingType Caching type to use (name of this cache)
          * @param {any} map OpenLayers map
        */
        public addCacheToMap(cachingType: string, map: any) {

            var msp = (cachingType == "standard") ? mapStorageProvider : new MapStorageProvider();

            var cacheRead = new OpenLayers.Control.CacheReadCustom(
                {
                    currentStorageProvider: msp
                });
            cacheRead.cachingType = cachingType;
            map.addControl(cacheRead);

            var cacheWrite = new OpenLayers.Control.CacheWriteCustom({
                autoActivate: true,
                imageFormat: "image/jpeg",
                eventListeners: {
                    cachefull: function () {
                        log.error("MapProvider", "Cache full.");
                    }
                },
                currentStorageProvider: msp
            });
            cacheWrite.cachingType = cachingType;
            map.addControl(cacheWrite);
        }
    }

    /* ======================================================================
     Based on OpenLayers/Control/CacheRead.js
    ====================================================================== */

    /* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
     * full list of contributors). Published under the 2-clause BSD license.
     * See license.txt in the OpenLayers distribution or repository for the
     * full text of the license. */

    /**
     * @requires OpenLayers/Control.js
     */

    /**
     * Class: OpenLayers.Control.CacheReadCustom
     * A control for using image tiles cached with <OpenLayers.Control.CacheWriteCustom>
     * from the browser's local storage.
     *
     * Inherits from:
     *  - <OpenLayers.Control>
     */
    OpenLayers.Control.CacheReadCustom = OpenLayers.Class(OpenLayers.Control, {

        /**
         * APIProperty: fetchEvent
         * {String} The layer event to listen to for replacing remote resource tile
         *     URLs with cached data URIs. Supported values are "tileerror" (try
         *     remote first, fall back to cached) and "tileloadstart" (try cache
         *     first, fall back to remote). Default is "tileloadstart".
         *
         *     Note that "tileerror" will not work for CORS enabled images (see
         *     https://developer.mozilla.org/en/CORS_Enabled_Image), i.e. layers
         *     configured with a <OpenLayers.Tile.Image.crossOriginKeyword> in
         *     <OpenLayers.Layer.Grid.tileOptions>.
         */
        fetchEvent: "tileloadstart",
        cachingType: "standard",
        currentStorageProvider: null,

        /**
         * APIProperty: layers
         * {Array(<OpenLayers.Layer.Grid>)}. Optional. If provided, only these
         *     layers will receive tiles from the cache.
         */
        layers: null,

        /**
         * APIProperty: autoActivate
         * {Boolean} Activate the control when it is added to a map.  Default is
         *     true.
         */
        autoActivate: true,

        /**
         * Constructor: OpenLayers.Control.CacheReadCustom
         *
         * Parameters:
         * options - {Object} Object with API properties for this control
         */

        /** 
         * Method: setMap
         * Set the map property for the control. 
         * 
         * Parameters:
         * map - {<OpenLayers.Map>} 
         */
        setMap: function (map) {
            OpenLayers.Control.prototype.setMap.apply(this, arguments);
            var i, layers = this.layers || map.layers;
            for (i = layers.length - 1; i >= 0; --i) {
                this.addLayer({ layer: layers[i] });
            }
            if (!this.layers) {
                map.events.on({
                    addlayer: this.addLayer,
                    removeLayer: this.removeLayer,
                    scope: this
                });
            }
        },

        /**
         * Method: addLayer
         * Adds a layer to the control. Once added, tiles requested for this layer
         *     will be cached.
         *
         * Parameters:
         * evt - {Object} Object with a layer property referencing an
         *     <OpenLayers.Layer> instance
         */
        addLayer: function (evt) {
            evt.layer.events.register(this.fetchEvent, this, this.fetch);
        },

        /**
         * Method: removeLayer
         * Removes a layer from the control. Once removed, tiles requested for this
         *     layer will no longer be cached.
         *
         * Parameters:
         * evt - {Object} Object with a layer property referencing an
         *     <OpenLayers.Layer> instance
         */
        removeLayer: function (evt) {
            evt.layer.events.unregister(this.fetchEvent, this, this.fetch);
        },

        /**
         * Method: fetch
         * Listener to the <fetchEvent> event. Replaces a tile's url with a data
         * URI from the cache.
         *
         * Parameters:
         * evt - {Object} Event object with a tile property.
         */
        fetch: function (evt) {
            if (this.active && evt.tile instanceof OpenLayers.Tile.Image) {
                var tile = evt.tile, url = tile.url;
                
                // deal with modified tile urls when both CacheWrite and CacheRead
                // are active

                if (!tile.layer.crossOriginKeyword && OpenLayers.ProxyHost &&
                    url.indexOf(OpenLayers.ProxyHost) === 0) {
                    url = OpenLayers.Control.CacheWriteCustom.urlMap[url];
                }

                var dataURI =  this.currentStorageProvider.fetchTile(url);
                if (dataURI) {
                    tile.url = dataURI;
                    if (evt.type === "tileerror") {
                        log.error("MapCacheProvider", "Tile error: " + url);
                        tile.setImgSrc(dataURI);
                    }
                }
            }
        },

        /**
         * Method: destroy
         * The destroy method is used to perform any clean up before the control
         * is dereferenced.  Typically this is where event listeners are removed
         * to prevent memory leaks.
         */
        destroy: function () {
            if (this.layers || this.map) {
                var i, layers = this.layers || this.map.layers;
                for (i = layers.length - 1; i >= 0; --i) {
                    this.removeLayer({ layer: layers[i] });
                }
            }
            if (this.map) {
                this.map.events.un({
                    addlayer: this.addLayer,
                    removeLayer: this.removeLayer,
                    scope: this
                });
            }
            OpenLayers.Control.prototype.destroy.apply(this, arguments);
        },

        CLASS_NAME: "OpenLayers.Control.CacheReadCustom"
    });

    /* ======================================================================
    Based on OpenLayers/Control/CacheWrite.js
   ====================================================================== */

    /* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for 
     * full list of contributors). Published under the 2-clause BSD license.
     * See license.txt in the OpenLayers distribution or repository for the
     * full text of the license. */

    /**
     * @requires OpenLayers/Control.js
     * @requires OpenLayers/Request.js
     * @requires OpenLayers/Console.js
     */

    /**
     * Class: OpenLayers.Control.CacheWriteCustom
     * A control for caching image tiles in the browser's local storage. The
     * <OpenLayers.Control.CacheRead> control is used to fetch and use the cached
     * tile images.
     *
     * Note: Before using this control on any layer that is not your own, make sure
     * that the terms of service of the tile provider allow local storage of tiles.
     *
     * Inherits from:
     *  - <OpenLayers.Control>
     */
    OpenLayers.Control.CacheWriteCustom = OpenLayers.Class(OpenLayers.Control, {

        /** 
         * APIProperty: events
         * {<OpenLayers.Events>} Events instance for listeners and triggering
         *     control specific events.
         *
         * To register events in the constructor, configure <eventListeners>.
         *
         * Register a listener for a particular event with the following syntax:
         * (code)
         * control.events.register(type, obj, listener);
         * (end)
         *
         * Supported event types (in addition to those from <OpenLayers.Control.events>):
         * cachefull - Triggered when the cache is full. Listeners receive an
         *     object with a tile property as first argument. The tile references
         *     the tile that couldn't be cached.
         */

        /**
         * APIProperty: eventListeners
         * {Object} Object with event listeners, keyed by event name. An optional
         *     scope property defines the scope that listeners will be executed in.
         */

        /**
         * APIProperty: layers
         * {Array(<OpenLayers.Layer.Grid>)}. Optional. If provided, caching
         *     will be enabled for these layers only, otherwise for all cacheable
         *     layers.
         */
        layers: null,

        cachingType: "standard",

        currentStorageProvider: null,

        /**
         * APIProperty: imageFormat
         * {String} The image format used for caching. The default is "image/png".
         *     Supported formats depend on the user agent. If an unsupported
         *     <imageFormat> is provided, "image/png" will be used. For aerial
         *     imagery, "image/jpeg" is recommended.
         */
        imageFormat: "image/png",

        /**
         * Property: quotaRegEx
         * {RegExp}
         */
        quotaRegEx: (/quota/i),

        /**
         * Constructor: OpenLayers.Control.CacheWrite
         *
         * Parameters:
         * options - {Object} Object with API properties for this control.
         */

        /** 
         * Method: setMap
         * Set the map property for the control. 
         * 
         * Parameters:
         * map - {<OpenLayers.Map>} 
         */
        setMap: function (map) {
            OpenLayers.Control.prototype.setMap.apply(this, arguments);
            var i, layers = this.layers || map.layers;
            for (i = layers.length - 1; i >= 0; --i) {
                this.addLayer({ layer: layers[i] });
            }
            if (!this.layers) {
                map.events.on({
                    addlayer: this.addLayer,
                    removeLayer: this.removeLayer,
                    scope: this
                });
            }
        },

        /**
         * Method: addLayer
         * Adds a layer to the control. Once added, tiles requested for this layer
         *     will be cached.
         *
         * Parameters:
         * evt - {Object} Object with a layer property referencing an
         *     <OpenLayers.Layer> instance
         */
        addLayer: function (evt) {
            evt.layer.events.on({
                tileloadstart: this.makeSameOrigin,
                tileloaded: this.onTileloaded,
                loadend: this.onloadend,
                scope: this
            });
        },

        /**
         * Method: removeLayer
         * Removes a layer from the control. Once removed, tiles requested for this
         *     layer will no longer be cached.
         *
         * Parameters:
         * evt - {Object} Object with a layer property referencing an
         *     <OpenLayers.Layer> instance
         */
        removeLayer: function (evt) {
            evt.layer.events.un({
                tileloadstart: this.makeSameOrigin,
                tileloaded: this.onTileloaded,
                loadend: this.onloadend,
                scope: this
            });
        },

        /**
         * Method: makeSameOrigin
         * If the tile does not have CORS image loading enabled and is from a
         * different origin, use OpenLayers.ProxyHost to make it a same origin url.
         *
         * Parameters:
         * evt - {<OpenLayers.Event>}
         */
        makeSameOrigin: function (evt) {
            if (this.active) {
                var tile = evt.tile;
                if (tile instanceof OpenLayers.Tile.Image && !tile.crossOriginKeyword && tile.url.substr(0, 5) !== "data:") {
                    var sameOriginUrl = OpenLayers.Request.makeSameOrigin(tile.url, OpenLayers.ProxyHost);
                    OpenLayers.Control.CacheWriteCustom.urlMap[sameOriginUrl] = tile.url;
                    tile.url = sameOriginUrl;
                }
            }
        },


        /**
          * Method: onTileloaded
          * Decides whether a tile can be cached and calls the cache method.
          *
          * Parameters:
          * evt - {Event}
        */
        onTileloaded: function (evt) {
            if (this.active && !evt.aborted && evt.tile instanceof OpenLayers.Tile.Image && evt.tile.url.substr(0, 5) !== 'data:') {

                var urlMap = OpenLayers.Control.CacheWriteCustom.urlMap;
                var url = urlMap[evt.tile.url] || evt.tile.url;

                if (!this.currentStorageProvider.hasTile(url) || (mapCacheProvider.enabledStandardCaching || this.cachingType != "standard")) {

                    if (this.cachingType == "standard") {
                        if (this.cacheTileworkQueue == null) {
                            this.cacheTileworkQueue = new Array<System.Utils.WorkQueueItem<any>>();
                        }
                        this.cacheTileworkQueue.push(new System.Utils.WorkQueueItem<any>(evt.tile, (t) => this.cache(t)));
                    }
                    else {
                        this.cache(evt.tile);
                    }
                }
            }
        },

        onloadend: function (evt) {
            if (this.cacheTileworkQueue != null) {
                log.debug("MapCacheProvider", "Caching tiles: " + this.cacheTileworkQueue.length)
                var queue = this.cacheTileworkQueue;
                this.cacheTileworkQueue = null;

                System.Utils.WorkHelper.processWork(queue, new System.Utils.WorkQueueState(), (s) => eventProvider.mapCache.onCacheEnd.trigger(s));
            }
            else {
                eventProvider.mapCache.onCacheEnd.trigger(true);
            }
        },

        /**
         * Method: cache
         * Adds a tile to the cache. When the cache is full, the "cachefull" event
         * is triggered.
         *
         * Parameters:
         * obj - {Object} Object with a tile property, tile being the
         *     <OpenLayers.Tile.Image> with the data to add to the cache
         */
        cache: function (tile) {

            try {

                var urlMap = OpenLayers.Control.CacheWriteCustom.urlMap;
                var url = urlMap[tile.url] || tile.url;

                var canvasContext = tile.getCanvasContext();
                if (canvasContext) {

                    var dataUri = canvasContext.canvas.toDataURL(this.imageFormat);
                        
                    if (!this.currentStorageProvider.hasTile(url)) {
                        this.currentStorageProvider.cacheTile(url, dataUri);
                    }

                    if (mapCacheProvider.enabledStandardCaching || this.cachingType != "standard") {
                        this.currentStorageProvider.storeTile(url, dataUri);
                    }
                }

                delete urlMap[tile.url];

            } catch (e) {
                var reason = e.name || e.message;
                if (reason && this.quotaRegEx.test(reason)) {
                    this.events.triggerEvent("cachefull", { tile: tile });
                } else {
                    OpenLayers.Console.error(e.toString());
                }

                if (tile.layer.cacheFailed) {
                    tile.layer.cacheFailed();
                }
            }
        },

        /**
         * Method: destroy
         * The destroy method is used to perform any clean up before the control
         * is dereferenced.  Typically this is where event listeners are removed
         * to prevent memory leaks.
         */
        destroy: function () {
            if (this.layers || this.map) {
                var i, layers = this.layers || this.map.layers;
                for (i = layers.length - 1; i >= 0; --i) {
                    this.removeLayer({ layer: layers[i] });
                }
            }
            if (this.map) {
                this.map.events.un({
                    addlayer: this.addLayer,
                    removeLayer: this.removeLayer,
                    scope: this
                });
            }
            OpenLayers.Control.prototype.destroy.apply(this, arguments);
        },

        CLASS_NAME: "OpenLayers.Control.CacheWriteCustom"
    });

    /**
     * APIFunction: OpenLayers.Control.CacheWriteCustom.clearCache
     * Clears all tiles cached with <OpenLayers.Control.CacheWriteCustom> from the cache.
     */
    OpenLayers.Control.CacheWriteCustom.clearCache = function () {
        mapStorageProvider.clearCache();
    };

    /**
     * Property: OpenLayers.Control.CacheWriteCustom.urlMap
     * {Object} Mapping of same origin urls to cache url keys. Entries will be
     *     deleted as soon as a tile was cached.
     */
    OpenLayers.Control.CacheWriteCustom.urlMap = {};
}
var mapCacheProvider = new System.Providers.MapCacheProvider();
