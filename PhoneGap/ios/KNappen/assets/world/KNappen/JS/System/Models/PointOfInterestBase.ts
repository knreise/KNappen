/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Models/Position.ts" />
/**
    Models
    @namespace System.Models
*/
module System.Models {

    export interface KnockoutObservablePointOfInterestBaseArray extends KnockoutObservableArray {
        (): System.Models.PointOfInterestBase[];
        (value: System.Models.PointOfInterestBase[]): void;

        subscribe(callback: (newValue: System.Models.PointOfInterestBase[]) => void , target?: any, topic?: string): KnockoutSubscription;
        notifySubscribers(valueToWrite: System.Models.PointOfInterestBase[], topic?: string);
    }

    /**
      * The base object for PointOfInterest, contain basic properties
      * @class
      */
    export class PointOfInterestBase {

        /**
            PointOfInterestBase
            @class System.Models.PointOfInterestBase
            @classdesc The base object for PointOfInterest, contains basic properties like default icon urls and other default values
        */
        constructor() {
        }
        /**
            id
            @member System.Models.PointOfInterestBase#id
            @public
            @type {KnockoutObservableString}
        */
        public id: KnockoutObservableString = ko.observable();
        /**
            pos
            @member System.Models.PointOfInterestBase#pos
            @public
            @type {System.Models.KnockoutObservablePosition}
        */
        public pos: System.Models.KnockoutObservablePosition = <System.Models.KnockoutObservablePosition>ko.observable();
        
        /**
            iconURL
            @member System.Models.PointOfInterestBase#iconURL
            @public
            @type {KnockoutObservableString}
        */
        public iconURL: KnockoutObservableString = ko.observable("Content/images/AppIcons/defaultPoiIcon.png");

        /**
            iconMediaTypeURL
            @member System.Models.PointOfInterestBase#iconMediaTypeURL
            @public
            @type {KnockoutObservableString}
        */
        public iconMediaTypeURL: KnockoutObservableString = ko.observable("Content/images/MediaTypes/text.png");

        /**
            iconCategoryURL
            @member System.Models.PointOfInterestBase#iconCategoryURL
            @public
            @type {KnockoutObservableString}
        */
        public iconCategoryURL: KnockoutObservableString = ko.observable("Content/images/Categories/defaultCategory.png");
        
        /**
            iconGenreURL
            @member System.Models.PointOfInterestBase#iconGenreURL
            @public
            @type {KnockoutObservableString}
        */
        public iconGenreURL: KnockoutObservableString = ko.observable("Content/images/AppIcons/defaultPoiIcon.png");
        /**
            iconWidth
            @member System.Models.PointOfInterestBase#iconWidth
            @public
            @type {KnockoutObservableNumber}
        */
        public iconWidth: KnockoutObservableNumber = ko.observable(40);
        /**
            iconHeight
            @member System.Models.PointOfInterestBase#iconHeight
            @public
            @type {KnockoutObservableNumber}
        */
        public iconHeight: KnockoutObservableNumber = ko.observable(40);
        /**
            lastKnockDistanceMeter
            @member System.Models.PointOfInterestBase#lastKnownDistanceMeter
            @public
            @type {KnockoutObservableNumber}
        */
        public lastKnownDistanceMeter: KnockoutObservableNumber = ko.observable(0);        
        /**
            source
            @member System.Models.PointOfInterestBase#source
            @public
            @type {KnockoutObservableString}
        */
        public source: KnockoutObservableString = ko.observable('');
        /**
            sourceType
            @member System.Models.PointOfInterestBase#sourceType
            @public
            @type {KnockoutObservableString}
        */
        public sourceType: KnockoutObservableString = ko.observable('');
    }
}