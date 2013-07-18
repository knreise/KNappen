/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.Clickhold
 * A control for mouse clicks that can distinguish between simple clicks and 
 *     longer clicks (clickhold or taphold). Create a new instance with the 
 *     <OpenLayers.Control.Clickhold> constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Control> 
 */
OpenLayers.Control.Clickhold = OpenLayers.Class(OpenLayers.Control, {
    /**
     * Property: defaultHandlerOptions
     * 
     * An object representing defaults that are going to be passed over to this 
     * controls clickhold-handler. Per default this control will only handle
     * single clicks with a tolerance of 5px. No events are beeing stopped from
     * propagation.
     */
    defaultHandlerOptions: {
        hold: true,
        single: true,
        'double': true,
        pixelTolerance: 5,
        stopSingle: false,
        stopDouble: true
    },
    
    /**
     * Constructor: OpenLayers.Control.Clickhold
     * Create a new clickhold control.
     * 
     * Parameters:
     * options - {Object} Optional object whose properties will be set on the
     *     handler.
     */
    initialize: function(options){
        var opts = options || {};
        this.handlerOptions = OpenLayers.Util.applyDefaults(
            opts.handlerOptions || {}, 
            this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.handler = new OpenLayers.Handler.Click(this, {
            'click': this.onSimpleclick,
            'clickhold': this.onClickhold,
            'dblclick': this.onDblClick
        }, this.handlerOptions);
    },
    
    /**
     * Method: onSimpleclick
     * Method to be called when a simple click/tap (not held long enough) 
     * occurs? The method will be called with two arguments:
     * 
     * event - <OpenLayers.Event> The OpenLayers.Event object
     * ms    - {Number} The number of milliseconds that the click/tap lasted
     */
    onSimpleclick: function (evt, ms) {
        var xy = evt.xy;
        var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        var evtExtended = {
            ms: ms,
            evt: evt,
            lonlat: lonlat,
            xy: xy
        };
        this.events.triggerEvent(
            "click", evtExtended
        );
    },
    
    /**
     * Method: onClickhold
     * Method to be called when a held click/tap occurs? The method will be 
     * called with two arguments:
     * 
     * event - <OpenLayers.Event> The OpenLayers.Event object
     * ms    - {Number} The number of milliseconds that the click/tap lasted
     */
    onClickhold: function (evt, ms) {
        var xy = evt.xy;
        var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        var evtExtended = {
            ms: ms,
            evt: evt,
            lonlat: lonlat,
            xy: xy
        };
        this.events.triggerEvent(
            "clickhold", evtExtended
        );
    },
    
    onDblClick: function (evt, ms) {
        var xy = evt.xy;
        var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        var evtExtended = {
            ms: ms,
            evt: evt,
            lonlat: lonlat,
            xy: xy
        };
        this.events.triggerEvent(
            "dblclick", evtExtended
        );
    },
    
    /**
     * 
     *
    onAfterClickhold: function(evt, ms){
        var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
        var evtExtended = {
            ms: ms,
            evt: evt,
            lonlat: lonlat
        };
        this.events.triggerEvent(
            "afterclickhold", evtExtended
        );
    },
     */
    CLASS_NAME: "OpenLayers.Control.Clickhold"
});