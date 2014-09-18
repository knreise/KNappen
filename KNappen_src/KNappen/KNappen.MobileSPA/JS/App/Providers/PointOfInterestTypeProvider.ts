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
        constructor(text?: string, category?: string, icon?: string) {
            this.text = text;
            this.category = category;
            this.icon = icon;
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
        constructor(text?: string, type?: string, icon?: string) {
            this.text = text;
            this.type = type;
            this.icon = icon;
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
        constructor(text?: string, type?: string, icon?: string) {
            this.text = text;
            this.type = type;
            this.icon = icon;
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
            this.poiTypeData = new App.Providers.PointOfInterestTypes();
            this.poiTypeData.categories["Alle kategorier"] = new App.Providers.CategoryItem("Alle kategorier", "*", "./../Content/images/Categories/defaultCategory.png");
            this.poiTypeData.categories["Arkeologi"] = new App.Providers.CategoryItem("Arkeologi", "Arkeologi", "./../Content/images/Categories/arkeologi.png");
            this.poiTypeData.categories["Arkitektur"] = new App.Providers.CategoryItem("Arkitektur", "Arkitektur", "./../Content/images/Categories/arkitektur.png");
            this.poiTypeData.categories["Dyr"] = new App.Providers.CategoryItem("Dyr", "Dyr", "./../Content/images/Categories/dyr.png");
            this.poiTypeData.categories["Folketelling"] = new App.Providers.CategoryItem("Folketelling", "Folketelling", "./../Content/images/Categories/folketelling.png");
            this.poiTypeData.categories["Fugler"] = new App.Providers.CategoryItem("Fugler", "Fugler", "./../Content/images/Categories/fugler.png");
            this.poiTypeData.categories["Historie og samfunn"] = new App.Providers.CategoryItem("Historie og samfunn", "Historie og samfunn", "./../Content/images/Categories/historieogsamfunn.png");
            this.poiTypeData.categories["Kulturminner"] = new App.Providers.CategoryItem("Kulturminner", "Kulturminner", "./../Content/images/Categories/kulturminne.png");
            this.poiTypeData.categories["Kunst"] = new App.Providers.CategoryItem("Kunst", "Kunst", "./../Content/images/Categories/kunst.png");
            this.poiTypeData.categories["Planter"] = new App.Providers.CategoryItem("Planter", "Planter", "./../Content/images/Categories/planter.png");
            this.poiTypeData.categories["Stedsnavn"] = new App.Providers.CategoryItem("Stedsnavn", "Stedsnavn", "./../Content/images/Categories/stedsnavn.png");
            this.poiTypeData.categories["Verneområder"] = new App.Providers.CategoryItem("Verneområder", "Verneområder", "./../Content/images/Categories/verneomrader.png");
            this.poiTypeData.categories["Wikipedia"] = new App.Providers.CategoryItem("Wikipedia", "Wikipedia", "./../Content/images/Categories/wikipedia.png");
            this.poiTypeData.genres["Fagdata"] = new App.Providers.GenreItem("Fagdata", "fagdata", "./../Content/images/Genres/fagdata.png");
            this.poiTypeData.genres["Leksikonartikler"] = new App.Providers.GenreItem("Leksikonartikler", "wikipedia", "./../Content/images/Genres/leksikon.png");
            this.poiTypeData.genres["Fortellinger"] = new App.Providers.GenreItem("Fortellinger", "digitaltfortalt", "./../Content/images/Genres/fortelling.png");
            this.poiTypeData.medias["Tekst"] = new App.Providers.MediaTypeItem("Tekst", "TEXT", "./../Content/images/MediaTypes/text.png");
            this.poiTypeData.medias["Bilde"] = new App.Providers.MediaTypeItem("Bilde", "IMAGE", "./../Content/images/MediaTypes/image.png");
            this.poiTypeData.medias["Lyd"] = new App.Providers.MediaTypeItem("Lyd", "SOUND", "./../Content/images/MediaTypes/sound.png");
            this.poiTypeData.medias["Video"] = new App.Providers.MediaTypeItem("Video", "VIDEO", "./../Content/images/MediaTypes/video.png");
            this.poiTypeData.medias["Alle medietyper"] = new App.Providers.MediaTypeItem("Alle medietyper", "*", "./../Content/images/MediaTypes/text.png");
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
                    log.debug("PointOfInterestTypeProvider", "startDownload() success: Processing: " + config.poiTypeDataUrl);
                    _this.poiTypeData = new App.Providers.PointOfInterestTypes();
                    _this.poiTypeData = serializer.deserializeJSObject(data, this.poiTypeData);
                    _this.savePoITypeData();
                    _this.updateDependencies();
                }, function (message: string) {
                    log.error("PointOfInterestTypeProvider", "Error downloading poiTypeData.");
                });
            httpDownloadProvider.enqueueItem("General", System.Providers.HttpDownloadQueuePriority.High, poiDlItem);
        }

        private loadPoITypeData() {
            try {
                log.debug("PointOfInterestTypeProvider", "loadPoITypeData()");
                var data = new App.Providers.PointOfInterestTypes();
                data = serializer.deserializeJSObjectFromFile("poiTypeData", data);

                if (data != null && Object.keys(data.categories).length > 0) {
                    this.poiTypeData.categories = data.categories;
                }
                if (data != null && Object.keys(data.genres).length > 0) {
                    this.poiTypeData.genres = data.genres;
                }
                if (data != null && Object.keys(data.medias).length > 0) {
                    this.poiTypeData.medias = data.medias;
                }

                this.updateDependencies();
            } catch (exception) {
                log.error("PointOfInterestTypeProvider", "Exception loading PoITypeData: " + exception);
            }
        }

        private savePoITypeData() {
            log.debug("PointOfInterestTypeProvider", "savePoITypeData()");
            serializer.serializeJSObjectToFile("poiTypeData", this.poiTypeData);
        }

        private updateDependencies() {
            var categoryList = [];
            $.each(this.getCategories(), function (k: string, v: App.Providers.CategoryItem) {
                categoryList.push(v);
            });

            settings.searchCategories(categoryList);
        }

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
        public getMediaType(poi: App.Models.PointOfInterest): Array<App.Providers.MediaTypeItem> {

            var ret = new Array<App.Providers.MediaTypeItem>();

            var poiTypes = poi.mediaTypes();

            if (poiTypes.length > 1) {
                poiTypes = poiTypes;
            }

            for (var pi in poiTypes) {
                var poiType = poiTypes[pi];

                for (var mi in this.poiTypeData.medias) {
                    var mediaType = this.poiTypeData.medias[mi];

                    if (mediaType.type.toUpperCase() == poiType.toUpperCase()) {
                        ret.push(mediaType);
                        break;
                    }
                }
            }

            if (ret.length == 0) {
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
        }
    }
}
var pointOfInterestTypeProvider = new App.Providers.PointOfInterestTypeProvider();
startup.addInit(function () { pointOfInterestTypeProvider.Init(); }, "PointOfInterestTypeProvider");
