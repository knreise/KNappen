/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="PointOfInterest.ts" />
/// <reference path="../../System/Models/Position.ts" />

/**
    Model modules
    @namespace App.Models
*/
module App.Models
{

    export class SearchResult
    {
        /**
            SearchResult
            @class App.Models.SearchResult
            @classdesc This class the contains an Observable array of Points of Interest as a result from a search
        */
        constructor() {
        }

        /**
            Number of rows found
            @member App.Models.SearchResult#numFound
            @public
            @type {KnocoutObservableNumber}
        */
        public numFound: KnockoutObservableNumber = ko.observable(0);
        /**
            Max number of rows found in a single searchprovider
            @member App.Models.SearchResult#singleMaxNum
            @public
            @type {KnocoutObservableNumber}
        */
        public singleMaxNum: KnockoutObservableNumber = ko.observable(0);
        /**
            Observable array of Points of Interest
            @member App.Models.SearchResult#items
            @public
            @type {KnocoutObservablePointOfInterestArray}
        */
        public items: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();
    }


}