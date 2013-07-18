/// <reference path="SearchCriteriaEnums.ts" />
/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../../System/Models/Position.ts" />

/**
    Model modules
    @namespace App.Models
*/
module App.Models
{

    export class SearchCriteria
    {
        /**
            SearchCriteria
            @class App.Models.SearchCriteria
            @classdesc This class contains items used to assemble the search query for Norvegiana. For example free text search and what fields to sort by.
        */
        constructor() {
        }

        /**
            Query
            @member App.Models.SearchCriteria#query
            @public
            @type {KnockoutObservableString}
        */
        public query: KnockoutObservableString = ko.observable(null);
        /**
            The user's position
            @member App.Models.SearchCriteria#pos
            @public
            @type {System.Models.KnockoutObservablePosition}
        */
        public pos: System.Models.KnockoutObservablePosition = <System.Models.KnockoutObservablePosition>ko.observable();
        /**
            Radius for the search around the user's position, 1 kilometer by default
            @member App.Models.SearchCriteria#radius
            @public
            @type {KnockoutObservableNumber}
        */
        public radius: KnockoutObservableNumber = ko.observable(10);
        /**
            Amount of rows fetched during search
            @member App.Models.SearchCriteria#rows
            @public
            @type {KnockoutObservableNumber}
        */
        public rows: KnockoutObservableNumber = ko.observable(20);
        /**
            Page number for this search
            @member App.Models.SearchCriteria#pageNumber
            @public
            @type {KnockoutObservableNumber}
        */
        public pageNumber: KnockoutObservableNumber = ko.observable(1);
        /**
            Category
            @member App.Models.SearchCriteria#category
            @public
            @type {KnockoutObservableString}
        */
        public category: KnockoutObservableString = ko.observable("*");

        /**
            Genre
            @member App.Models.SearchCriteria#category
            @public
            @type {KnockoutObservableString}
        */
        public genre: KnockoutObservableString = ko.observable("*");

        /**
            MediaType
            @member App.Models.SearchCriteria#MediaType
            @public
            @type {KnockoutObservableString}
        */
        public mediaType: KnockoutObservableString = ko.observable("*");

        /**
            TODO
            @member App.Models.SearchCriteria#sort
            @public
            @type {App.Models.SearchCriteriaSortingEnum}
        */
        public sort: App.Models.SearchCriteriaSortingEnum = App.Models.SearchCriteriaSortingEnum.Distance;
        /**
            Norvegiana Query Fields
            @member App.Models.SearchCriteria#norvegiana_qf
            @public
            @type {KnockoutObservableArray}
        */
        public norvegiana_qf: KnockoutObservableArray = ko.observableArray();
    }

}