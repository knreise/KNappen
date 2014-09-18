/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../_References.ts" />

/**
    Model modules
    @namespace App.Models
*/
module App.Models {

    export interface KnockoutObservablePointOfInterestArray extends KnockoutObservableArray {
        (): App.Models.PointOfInterest[];
        (value: App.Models.PointOfInterest[]): void;

        subscribe(callback: (newValue: App.Models.PointOfInterest[]) => void , target?: any, topic?: string): KnockoutSubscription;
        notifySubscribers(valueToWrite: App.Models.PointOfInterest[], topic?: string);
    }

    export class PointOfInterest extends System.Models.PointOfInterestBase {

        constructor() {
            super();
            this.tryLicenseAsLink();
        }

        public name: KnockoutObservableString = ko.observable("");
        public description: KnockoutObservableString = ko.observable("");
        public link: KnockoutObservableString = ko.observable("");
        public thumbnail: KnockoutObservableString = ko.observable("");
        public year: KnockoutObservableString = ko.observable("");
        public landingPage: KnockoutObservableString = ko.observable("");
        public license: KnockoutObservableString = ko.observable("");
        public licenseLink: KnockoutObservableString = ko.observable("");
        public categories: KnockoutObservableArray = ko.observableArray([]);
        public topics: KnockoutObservableString = ko.observable("");
        public ingress: KnockoutObservableString = ko.observable("");
        public body: KnockoutObservableString = ko.observable("");
        public creator: KnockoutObservableString = ko.observable("");
        public institution: KnockoutObservableString = ko.observable("");
        public owner: KnockoutObservableString = ko.observable("");
        public tags: KnockoutObservableString = ko.observable("");
        public references: KnockoutObservableString = ko.observable("");
        public mediaTypes: KnockoutObservableArray = ko.observableArray([]);
        public soundUri: KnockoutObservableArray = ko.observableArray([]);
        public videoUri: KnockoutObservableArray = ko.observableArray([]);
        public originalVersion: KnockoutObservableString = ko.observable("");
        public lazyLoad: (poi: App.Models.PointOfInterest, data: string, lazyLoadHandle: App.Providers.LazyLoadHandle) => void;
        public lazyLoadData: string;
        private loaded: boolean = false;

        public updateIcons(): void {

            // Set icon to the genre if any, if not use default poi icon
            var iconGenreStr = this.iconGenreURL();
            var genre = pointOfInterestTypeProvider.getGenre(this);
            if (genre)
                iconGenreStr = genre.icon || this.iconGenreURL();

            this.iconGenreURL(iconGenreStr);

            // Set icon to the category if any
            var iconCategoryStr = this.iconCategoryURL();
            var category = pointOfInterestTypeProvider.getCategory(this);
            if (category)
                iconCategoryStr = category.icon || this.iconCategoryURL();

            // Set POI icons
            this.iconCategoryURL(iconCategoryStr);
            this.iconInactiveCategoryURL(iconCategoryStr);
            this.iconActiveCategoryURL(iconCategoryStr + ".active.png");

            // Set icon(s?) to the mediatypes if any
            var iconMediaTypeStr = this.iconMediaTypeURL();
            var mediaTypes = pointOfInterestTypeProvider.getMediaType(this);
            for (var i in mediaTypes) {
                this.iconMediaTypeURL().push(mediaTypes[i].icon);
            }
        }

        public toRouteFriendly(): PointOfInterest {
            var r = new App.Models.PointOfInterest();
            $.extend(r, this);
            r.distanceInKm = ko.observable("");
            r.iconCategoryURL = ko.observable(this.iconInactiveCategoryURL());

            return r;
        }

        public ensureLoaded(lazyLoadHandle: App.Providers.LazyLoadHandle) {
            if (!this.loaded && this.lazyLoad) {
                this.lazyLoad(this, this.lazyLoadData, lazyLoadHandle);
                this.loaded = true;
            }
        }

        public GetFormatedIngress(): string {

            var ingressText = this.ingress() != "" ? this.ingress() :
                this.description() ? (this.description().toString().length > 40 ? this.description().toString().substring(0, 39) + "..." : this.description()) : "Se detaljer";
            return ingressText;
        }

        private tryLicenseAsLink(): void {
            this.license.subscribe((license: any) => {
                if (license instanceof Array) // license might be an array or a string.
                    license = license[0];

                if (license && license.indexOf("http://") !== -1) {
                    this.licenseLink(license);
                    this.license(""); // Empty value to avoid rendering the field.
                }
            });
        }
    }
} 