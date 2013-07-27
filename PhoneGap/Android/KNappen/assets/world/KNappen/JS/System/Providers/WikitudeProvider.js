var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var WikitudeProvider = (function () {
            /**
            * WikitudeProvider
            * @class System.Utils.WikitudeProvider
            * @classdesc Provides Wikitude AR functionality
            */
            function WikitudeProvider() {
                this.arState = true;
                this.poiDivs = new Array();
                this.poiQueue = new Array();
                this.poiQueuehtmlDrawCallback = null;
                this._events = $(this);
            }
            WikitudeProvider.prototype.PreInit = function () {
                // We want to update distance every 10 sec
                log.info("WikitudeProvider", "PreInit()");
                var _this = this;

                try  {
                } catch (exception) {
                    // http://www.wikitude.com/external/doc/documentation/3.0/Reference/JavaScript%20Reference/context.html
                    AR.context.scene.maxScalingDistance = 1000;
                    AR.context.scene.maxScalingDistance = 20000;
                    AR.context.scene.scalingFactor = 0.5;
                }

                //window.setInterval(function () {
                //    try {
                //        updateDistancePoI();
                //    } catch (e) {
                //        log.error("SPA", "Error AR updateDistancePoI: " + e.name + " :: " + e.message);
                //    }
                //}, 10000);
                var _this = this;
                setInterval(function () {
                    _this.processQueueTick();
                }, config.wikitudeAddPoiDelayMs);
            };

            /**
            * Add click handler for POI
            * @method System.Providers.WikitudeProvider#addPoiClickHandler
            * @param {function} clickCallback Callback function with signature function (event: JQueryEventObject, poi: System.Models.PointOfInterestBase) {}
            */
            WikitudeProvider.prototype.addPoiClickHandler = function (clickCallback) {
                this._events.on('PoiClick', clickCallback);
            };

            //private onLocationChangedHandler(lat: number, lon: number, alt: number, acc: number) {
            //    log.debug("WikitudeProvider", "Location changed: lat: " + lat + "lon: " + lon);
            //    gpsProvider.setPos(lat, lon, alt, acc);
            //}
            /**
            * Reset (turn off) AR camera
            * @method System.Providers.WikitudeProvider#resetARState
            */
            WikitudeProvider.prototype.resetARState = function () {
                log.debug("WikitudeProvider", "Setting startup AR camera state.");
                try  {
                    this.enableAR(false);
                } catch (e) {
                    log.error("WikitudeProvider", "Error changing AR camera state: " + e);
                }
            };

            /**
            * Change state of AR camera
            * @method System.Providers.WikitudeProvider#enableAR
            * @param {bool} state True=enable AR camera, False=disable AR camera
            */
            WikitudeProvider.prototype.enableAR = function (state) {
                try  {
                    log.debug("WikitudeProvider", "Setting AR camera state to: " + state);
                    if (this.arState == state) {
                        this.arState = state;
                        AR.context.services.camera = state;
                        AR.context.services.sensors = state;
                    } else {
                        log.debug("WikitudeProvider", "AR camera state already: " + state);
                    }
                } catch (e) {
                    log.error("WikitudeProvider", "Error changing AR camera state: " + e);
                }
            };

            /**
            * Paint POI array onto Wikitude AR. Will set up a background timer to add them one by one.
            * @method System.Providers.WikitudeProvider#resultToWikitudePoI
            * @param {array} poi Array of System.Models.KnockoutObservablePointOfInterestBaseArray
            * @param {function} htmlDrawCallBack Function to call for HTML content of POI: function(poi: System.Models.PointOfInterestBase) { return "<h1>id: " + poi.id + "</h1>"; }
            */
            WikitudeProvider.prototype.resultToWikitudePoI = function (poi, htmlDrawCallback) {
                var count = 0;
                if (poi && poi())
                    count = poi().length;
                log.debug("WikitudeProvider", "Queueing " + count + " PoIs for draw. " + config.wikitudeAddPoiDelayMs + " ms delay between each.");

                try  {
                    AR.context.destroyAll();
                } catch (e) {
                    log.error("WikitudeProvider", "Error running AR.context.destroyAll(): " + e);
                }
                this.poiQueue = new Array();

                try  {
                    this.startRadar();
                } catch (e) {
                    log.error("WikitudeProvider", "Error running startRadar(): " + e);
                }

                // Shallow copy of items array
                this.poiQueuehtmlDrawCallback = htmlDrawCallback;
                this.poiQueue = poi().slice(0);
            };

            WikitudeProvider.prototype.processQueueTick = function () {
                if (this.poiQueue.length > 0) {
                    var poiItem = this.poiQueue.shift();
                    this.resultToWikitudePoIItem(poiItem, this.poiQueuehtmlDrawCallback);
                }
            };

            WikitudeProvider.prototype.resultToWikitudePoIItem = function (item, htmlDrawCallback) {
                try  {
                    this._resultToWikitudePoIItem(item, htmlDrawCallback);
                } catch (e) {
                    log.error("WikitudeProvider", "Error resultToWikitudePoIItem: " + e);
                }
            };

            WikitudeProvider.prototype._resultToWikitudePoIItem = function (item, htmlDrawCallback) {
                if (!item || !item.pos() || !item.pos().lat() || !item.pos().lon())
                    return;

                // updateRate:AR.HtmlDrawable.UPDATE_RATE.STATIC,
                var myDrawables = new Array();

                var htmlStr = htmlDrawCallback(item) || "<div style='background-color: white; color: black;'>No HTML data for POI</div>";

                try  {
                    // http://www.wikitude.com/external/doc/documentation/3.0/Reference/JavaScript%20Reference/context.html
                    var ev = this._events;
                    var poiGeoLocation = new AR.GeoLocation(parseFloat(item.pos().lat()), parseFloat(item.pos().lon()));
                    var htmlDrawable = new AR.HtmlDrawable({ html: htmlStr }, 1, {
                        updateRate: AR.HtmlDrawable.UPDATE_RATE.STATIC,
                        scale: 24,
                        offsetX: 1,
                        onClick: function () {
                            log.info("WikitudeProvider", "User clicked " + item.id());

                            ev.trigger('PoiClick', [item]);

                            //this.bringPoIToFront(divName);
                            //this.openPreviewView(item);
                            return true;
                        },
                        _verticalAnchor: AR.CONST.HORIZONTAL_ANCHOR.MIDDLE,
                        opacity: 1.0,
                        clickThroughEnabled: true
                    });

                    myDrawables.push(htmlDrawable);

                    //var label = new AR.Label("", 3, {
                    //    offsetY: 1,
                    //    onClick: function () {
                    //        //label.text += "CLICK "
                    //    },
                    //    verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,
                    //    opacity: 0.8
                    //});
                    //label.style.textColor = "#00AAAA";
                    //myDrawables.push(label);
                    var radarCircle = new AR.Circle(0.05, { style: { fillColor: '#3eaebe' } });
                    var geoObject = new AR.GeoObject(poiGeoLocation, {
                        drawables: { cam: myDrawables, radar: radarCircle }
                    });

                    // Hide this so we can access it later
                    var item2 = item;
                    item2.htmlDrawable = htmlDrawable;
                    item2.radarCircle = radarCircle;
                    item2.geoObject = geoObject;
                } catch (e) {
                    if (!stringUtils.startsWith(e.message, "AR"))
                        log.error("WikitudeProvider", "Exception adding PoI to AR: " + e);
                }
            };

            WikitudeProvider.prototype.startRadar = function () {
                // Set up the radar
                log.debug("WikitudeProvider", "Setting up radar");
                AR.radar.background = new AR.ImageResource("Images/radarImg.png");

                AR.radar.positionX = 0.1;
                AR.radar.positionY = 0.1;
                AR.radar.width = 0.2;

                AR.radar.centerX = 0.5;
                AR.radar.centerY = 0.5;
                AR.radar.radius = 0.2;

                AR.radar.northIndicator.image = new AR.ImageResource("Images/north_arrow.png");
                AR.radar.northIndicator.radius = 0.2;

                AR.radar.onClick = function () {
                    log.info("WikitudeProvider", 'Radar was clicked');
                };
                AR.radar.enabled = true;
            };
            return WikitudeProvider;
        })();
        Providers.WikitudeProvider = WikitudeProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
//@ sourceMappingURL=WikitudeProvider.js.map
