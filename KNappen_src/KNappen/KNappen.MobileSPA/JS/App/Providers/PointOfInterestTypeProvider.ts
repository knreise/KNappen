/// <reference path="../_References.ts" />

/**
    Model modules
    @namespace App.Providers
*/
module App.Providers {
    export class CategoryItem {

        /**
            CategoryItem
            @class App.Providers.CategoryItem
            @classdesc This class contains text, category name and icon url for a category
        */
        constructor() {
        }

        public text: string = null;
        public category: string = null;
        public icon: string = null;
    }

    export class GenreItem {

        /**
            GenreItem
            @class App.Providers.GenreItem
            @classdesc This class contains text, category name and icon url for a genre
        */
        constructor() {
        }

        public text: string = null;
        public type: string = null;
        public icon: string = null;
    }

    export class MediaTypeItem {

        /**
            CategoryItem
            @class App.Providers.MediaTypeItem
            @classdesc This class contains text, category name and icon url for a mediatype
        */
        constructor() {
        }

        public text: string = null;
        public type: string = null;
        public icon: string = null;
    }

    export class PointOfInterestTypes {

        /**
            PointOfInterestTypes
            @class App.Providers.PointOfInterestTypes
            @classdesc This class holds arrays of categories, genres and medias
        */
        constructor() {
        }

        public categories: { [category: string]: App.Providers.CategoryItem; } = {};
        public genres: { [genre: string]: App.Providers.GenreItem; } = {};
        public medias: { [mediaType: string]: App.Providers.MediaTypeItem; } = {};
    }

    export class PointOfInterestTypeProvider {

        private poiTypeData: App.Providers.PointOfInterestTypes = null;

        /**
            PointOfInterestTypeProvider
            @class App.Providers.PointOfInterestTypeProvider
            @classdesc This class downloads typeinfo from the server, and provides methods for mapping categories, genres and mediatypes
        */
        constructor() {
        }

        /**
            Init
            @method App.Providers.PointOfInterestTypeProvider#Init
            @public
        */
        public Init() {
            log.debug("PointOfInterestTypeProvider", "Init()");
            this.loadPoITypeData();
            this.startDownload();
        }

        private startDownload() {
            log.debug("PointOfInterestTypeProvider", "startDownload(): " + config.poiTypeDataUrl);
            var _this = this;
            var poiDlItem = new System.Providers.HttpDownloadItem("poiTypeData", config.poiTypeDataUrl,
                function (data: string) {
                    // Done downloading
                    log.debug("PointOfInterestTypeProvider", "startDownload(): Processing: " + config.poiTypeDataUrl);
                    _this.poiTypeData = new App.Providers.PointOfInterestTypes();
                    _this.poiTypeData = serializer.deserializeJSObject(data, this.poiTypeData);
                    _this.savePoITypeData();
                }, function (message: string) {
                    log.error("PointOfInterestTypeProvider", "Error downloading poiTypeData.");
                });
            httpDownloadProvider.enqueueItem("General", System.Providers.HttpDownloadQueuePriority.High, poiDlItem);
        }

        private loadPoITypeData() {
            try {
                log.debug("PointOfInterestTypeProvider", "loadPoITypeData()");
                this.poiTypeData = new App.Providers.PointOfInterestTypes();
                this.poiTypeData = serializer.deserializeJSObjectFromFile("poiTypeData", this.poiTypeData);
                //this.updateSettings();
            } catch (exception) {
                log.error("PointOfInterestTypeProvider", "Exception loading PoITypeData: " + exception);
            }
        }
        private savePoITypeData() {
            log.debug("PointOfInterestTypeProvider", "savePoITypeData()");
            serializer.serializeJSObjectToFile("poiTypeData", this.poiTypeData);
            //this.updateSettings();
        }

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
        public getMediaTypes(): { [index: string]: App.Providers.MediaTypeItem; }  {
            return this.poiTypeData.medias;
        }

        /**
            Get array of genres fetched from the server
            @method App.Providers.PointOfInterestTypeProvider#getGenres
            @public
        */
        public getGenres(): { [index: string]: App.Providers.GenreItem; } {
            return this.poiTypeData.genres;
        }

        /**
            Get array of categories fetched from the server
            @method App.Providers.PointOfInterestTypeProvider#getCategories
            @public
        */
        public getCategories(): { [index: string]: App.Providers.CategoryItem; } {
            return this.poiTypeData.categories;
        }

        /**
            Map mediatype of poi to correct mediatype from server
            @method App.Providers.PointOfInterestTypeProvider#getMediaType
            @param {App.Models.PointOfInterest} poi
            @public
        */
        public getMediaType(poi: App.Models.PointOfInterest): App.Providers.MediaTypeItem {

            var ret = null;
            var mediaType = "*";

            // If not or multiple media types, use general icon
            if (poi.mediaTypes().length == 1)
                mediaType = poi.mediaTypes()[0];

            // If not, return icon
            $.each(this.poiTypeData.medias, function (k, v: App.Providers.MediaTypeItem) {
                if (v.type.toUpperCase() == mediaType.toUpperCase())
                    ret = v;
            });

            if (!ret) {
                if (!ret)
                    log.info("SearchProvider", "No mediatype found for type: " + poi.mediaTypes().toString());
            }

            return ret;
        }

        /**
            Map genre of poi to correct genre from server
            @method App.Providers.PointOfInterestTypeProvider#getGenre
            @param {App.Models.PointOfInterest} poi
            @public
        */
        public getGenre(poi: App.Models.PointOfInterest): App.Providers.GenreItem {


            var ret = null;
            var genreType = "*";

            // If not or multiple media types, use general icon
            if (poi && poi.sourceType && poi.sourceType())
                genreType = poi.sourceType();

            // If not, return icon
            $.each(this.poiTypeData.genres, function (k, v: App.Providers.GenreItem) {
                if (v.type.toUpperCase() == genreType.toUpperCase())
                    ret = v;
            });

            if (!ret)
                log.info("SearchProvider", "No genre found for type: " + poi.sourceType());

            return ret;
        }
        
        /**
            Map category of poi to correct category from server
            @method App.Providers.PointOfInterestTypeProvider#getCategory
            @param {App.Models.PointOfInterest} poi
            @public
        */
        public getCategory(poi: App.Models.PointOfInterest): App.Providers.CategoryItem {
            
            var ret = null;
            var category = "*";

            var _this = this;
            
            //If not or multiple categories, use general icon
            //if (poi.category().length == 0 || poi.category().length > 1)
            //    return this.poiTypeData.categories["*"];
            
            
            $.each(poi.categories(), function (key1, v1: string) {
                if (ret == null) {
                    $.each(_this.poiTypeData.categories, function (key2, v2: App.Providers.CategoryItem) {
                        if (ret == null && v2.category.toUpperCase() == v1.toUpperCase())
                            ret = v2;
                    });
                }
            });

            //If not, return icon
            if (!ret)
                log.info("SearchProvider", "No category found for type: " + poi.categories().toString());

            return ret;

            //TODO
            //return this.poiTypeData.categories[poi.category()];
        }
    }
}
var pointOfInterestTypeProvider = new App.Providers.PointOfInterestTypeProvider();
var poiTypeProvider = pointOfInterestTypeProvider;
startup.addInit(function () { pointOfInterestTypeProvider.Init(); }, "PointOfInterestTypeProvider");