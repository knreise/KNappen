var System;
(function (System) {
    /// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
    /// <reference path="../Models/Position.ts" />
    /**
    Models
    @namespace System.Models
    */
    (function (Models) {
        /**
        * The base object for PointOfInterest, contain basic properties
        * @class
        */
        var PointOfInterestBase = (function () {
            /**
            PointOfInterestBase
            @class System.Models.PointOfInterestBase
            @classdesc The base object for PointOfInterest, contains basic properties like default icon urls and other default values
            */
            function PointOfInterestBase() {
                /**
                id
                @member System.Models.PointOfInterestBase#id
                @public
                @type {KnockoutObservableString}
                */
                this.id = ko.observable();
                /**
                pos
                @member System.Models.PointOfInterestBase#pos
                @public
                @type {System.Models.KnockoutObservablePosition}
                */
                this.pos = ko.observable();
                /**
                iconURL
                @member System.Models.PointOfInterestBase#iconURL
                @public
                @type {KnockoutObservableString}
                */
                this.iconURL = ko.observable("Content/images/AppIcons/defaultPoiIcon.png");
                /**
                iconMediaTypeURL
                @member System.Models.PointOfInterestBase#iconMediaTypeURL
                @public
                @type {KnockoutObservableString}
                */
                this.iconMediaTypeURL = ko.observable("Content/images/MediaTypes/text.png");
                /**
                iconCategoryURL
                @member System.Models.PointOfInterestBase#iconCategoryURL
                @public
                @type {KnockoutObservableString}
                */
                this.iconCategoryURL = ko.observable("Content/images/Categories/defaultCategory.png");
                /**
                iconGenreURL
                @member System.Models.PointOfInterestBase#iconGenreURL
                @public
                @type {KnockoutObservableString}
                */
                this.iconGenreURL = ko.observable("Content/images/AppIcons/defaultPoiIcon.png");
                /**
                iconWidth
                @member System.Models.PointOfInterestBase#iconWidth
                @public
                @type {KnockoutObservableNumber}
                */
                this.iconWidth = ko.observable(40);
                /**
                iconHeight
                @member System.Models.PointOfInterestBase#iconHeight
                @public
                @type {KnockoutObservableNumber}
                */
                this.iconHeight = ko.observable(40);
                /**
                lastKnockDistanceMeter
                @member System.Models.PointOfInterestBase#lastKnownDistanceMeter
                @public
                @type {KnockoutObservableNumber}
                */
                this.lastKnownDistanceMeter = ko.observable(0);
                /**
                source
                @member System.Models.PointOfInterestBase#source
                @public
                @type {KnockoutObservableString}
                */
                this.source = ko.observable('');
                /**
                sourceType
                @member System.Models.PointOfInterestBase#sourceType
                @public
                @type {KnockoutObservableString}
                */
                this.sourceType = ko.observable('');
            }
            return PointOfInterestBase;
        })();
        Models.PointOfInterestBase = PointOfInterestBase;
    })(System.Models || (System.Models = {}));
    var Models = System.Models;
})(System || (System = {}));
//@ sourceMappingURL=PointOfInterestBase.js.map
