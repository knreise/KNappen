var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Model modules
    @namespace App.Providers
    */
    (function (Providers) {
        var CategoryItem = (function () {
            /**
            CategoryItem
            @class App.Providers.CategoryItem
            @classdesc This class contains text, category name and icon url for a category
            */
            function CategoryItem() {
                this.text = null;
                this.category = null;
                this.icon = null;
            }
            return CategoryItem;
        })();
        Providers.CategoryItem = CategoryItem;

        var GenreItem = (function () {
            /**
            GenreItem
            @class App.Providers.GenreItem
            @classdesc This class contains text, category name and icon url for a genre
            */
            function GenreItem() {
                this.text = null;
                this.type = null;
                this.icon = null;
            }
            return GenreItem;
        })();
        Providers.GenreItem = GenreItem;

        var MediaTypeItem = (function () {
            /**
            CategoryItem
            @class App.Providers.MediaTypeItem
            @classdesc This class contains text, category name and icon url for a mediatype
            */
            function MediaTypeItem() {
                this.text = null;
                this.type = null;
                this.icon = null;
            }
            return MediaTypeItem;
        })();
        Providers.MediaTypeItem = MediaTypeItem;

        var PointOfInterestTypes = (function () {
            /**
            PointOfInterestTypes
            @class App.Providers.PointOfInterestTypes
            @classdesc This class holds arrays of categories, genres and medias
            */
            function PointOfInterestTypes() {
                this.categories = {};
                this.genres = {};
                this.medias = {};
            }
            return PointOfInterestTypes;
        })();
        Providers.PointOfInterestTypes = PointOfInterestTypes;

        var PointOfInterestTypeProvider = (function () {
            /**
            PointOfInterestTypeProvider
            @class App.Providers.PointOfInterestTypeProvider
            @classdesc This class downloads typeinfo from the server, and provides methods for mapping categories, genres and mediatypes
            */
            function PointOfInterestTypeProvider() {
                this.poiTypeData = null;
            }
            /**
            Init
            @method App.Providers.PointOfInterestTypeProvider#Init
            @public
            */
            PointOfInterestTypeProvider.prototype.Init = function () {
                log.debug("PointOfInterestTypeProvider", "Init()");
                this.loadPoITypeData();
                this.startDownload();
            };

            PointOfInterestTypeProvider.prototype.startDownload = function () {
                log.debug("PointOfInterestTypeProvider", "startDownload(): " + config.poiTypeDataUrl);
                var _this = this;
                var poiDlItem = new System.Providers.HttpDownloadItem("poiTypeData", config.poiTypeDataUrl, function (data) {
                    // Done downloading
                    log.debug("PointOfInterestTypeProvider", "startDownload(): Processing: " + config.poiTypeDataUrl);
                    _this.poiTypeData = new App.Providers.PointOfInterestTypes();
                    _this.poiTypeData = serializer.deserializeJSObject(data, this.poiTypeData);
                    _this.savePoITypeData();
                }, function (message) {
                    log.error("PointOfInterestTypeProvider", "Error downloading poiTypeData.");
                });
                httpDownloadProvider.enqueueItem("General", System.Providers.HttpDownloadQueuePriority.High, poiDlItem);
            };

            PointOfInterestTypeProvider.prototype.loadPoITypeData = function () {
                try  {
                    log.debug("PointOfInterestTypeProvider", "loadPoITypeData()");
                    this.poiTypeData = new App.Providers.PointOfInterestTypes();
                    this.poiTypeData = serializer.deserializeJSObjectFromFile("poiTypeData", this.poiTypeData);
                } catch (exception) {
                    log.error("PointOfInterestTypeProvider", "Exception loading PoITypeData: " + exception);
                }
            };
            PointOfInterestTypeProvider.prototype.savePoITypeData = function () {
                log.debug("PointOfInterestTypeProvider", "savePoITypeData()");
                serializer.serializeJSObjectToFile("poiTypeData", this.poiTypeData);
            };

            //private updateSettings() {
            //    log.debug("PointOfInterestTypeProvider", "Pushing type data to KO observables in Settings");
            //        try {
            //            settings.genres.removeAll();
            //            settings.genres.push(ko.mapping.fromJS(this.getGenres()));
            //            settings.categories.removeAll();
            //            settings.categories.push(ko.mapping.fromJS(this.getCategories()));
            //            settings.mediaTypes.removeAll();
            //            settings.mediaTypes.push(ko.mapping.fromJS(this.getMediaTypes()));
            //        } catch (exception) {
            //            log.error("PointOfInterestTypeProvider", "Exception saving type data to Settings: " + exception);
            //        }
            //}
            /**
            Get array of mediatypes fetched from the server
            @method App.Providers.PointOfInterestTypeProvider#getMediaTypes
            @public
            */
            PointOfInterestTypeProvider.prototype.getMediaTypes = function () {
                return this.poiTypeData.medias;
            };

            /**
            Get array of genres fetched from the server
            @method App.Providers.PointOfInterestTypeProvider#getGenres
            @public
            */
            PointOfInterestTypeProvider.prototype.getGenres = function () {
                return this.poiTypeData.genres;
            };

            /**
            Get array of categories fetched from the server
            @method App.Providers.PointOfInterestTypeProvider#getCategories
            @public
            */
            PointOfInterestTypeProvider.prototype.getCategories = function () {
                return this.poiTypeData.categories;
            };

            /**
            Map mediatype of poi to correct mediatype from server
            @method App.Providers.PointOfInterestTypeProvider#getMediaType
            @param {App.Models.PointOfInterest} poi
            @public
            */
            PointOfInterestTypeProvider.prototype.getMediaType = function (poi) {
                var ret = null;
                var mediaType = "*";

                if (poi.mediaTypes().length == 1)
                    mediaType = poi.mediaTypes()[0];

                // If not, return icon
                $.each(this.poiTypeData.medias, function (k, v) {
                    if (v.type.toUpperCase() == mediaType.toUpperCase())
                        ret = v;
                });

                if (!ret) {
                    if (!ret)
                        log.info("SearchProvider", "No mediatype found for type: " + poi.mediaTypes().toString());
                }

                return ret;
            };

            /**
            Map genre of poi to correct genre from server
            @method App.Providers.PointOfInterestTypeProvider#getGenre
            @param {App.Models.PointOfInterest} poi
            @public
            */
            PointOfInterestTypeProvider.prototype.getGenre = function (poi) {
                var ret = null;
                var genreType = "*";

                if (poi && poi.sourceType && poi.sourceType())
                    genreType = poi.sourceType();

                // If not, return icon
                $.each(this.poiTypeData.genres, function (k, v) {
                    if (v.type.toUpperCase() == genreType.toUpperCase())
                        ret = v;
                });

                if (!ret)
                    log.info("SearchProvider", "No genre found for type: " + poi.sourceType());

                return ret;
            };

            /**
            Map category of poi to correct category from server
            @method App.Providers.PointOfInterestTypeProvider#getCategory
            @param {App.Models.PointOfInterest} poi
            @public
            */
            PointOfInterestTypeProvider.prototype.getCategory = function (poi) {
                var ret = null;
                var category = "*";

                var _this = this;

                //If not or multiple categories, use general icon
                //if (poi.category().length == 0 || poi.category().length > 1)
                //    return this.poiTypeData.categories["*"];
                $.each(poi.categories(), function (key1, v1) {
                    if (ret == null) {
                        $.each(_this.poiTypeData.categories, function (key2, v2) {
                            if (ret == null && v2.category.toUpperCase() == v1.toUpperCase())
                                ret = v2;
                        });
                    }
                });

                if (!ret)
                    log.info("SearchProvider", "No category found for type: " + poi.categories().toString());

                return ret;
            };
            return PointOfInterestTypeProvider;
        })();
        Providers.PointOfInterestTypeProvider = PointOfInterestTypeProvider;
    })(App.Providers || (App.Providers = {}));
    var Providers = App.Providers;
})(App || (App = {}));
var pointOfInterestTypeProvider = new App.Providers.PointOfInterestTypeProvider();
var poiTypeProvider = pointOfInterestTypeProvider;
startup.addInit(function () {
    pointOfInterestTypeProvider.Init();
}, "PointOfInterestTypeProvider");
//@ sourceMappingURL=PointOfInterestTypeProvider.js.map
