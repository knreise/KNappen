var App;
(function (App) {
    /// <reference path="SearchCriteriaEnums.ts" />
    /// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
    /// <reference path="../../System/Models/Position.ts" />
    /**
    Model modules
    @namespace App.Models
    */
    (function (Models) {
        var SearchCriteria = (function () {
            /**
            SearchCriteria
            @class App.Models.SearchCriteria
            @classdesc This class contains items used to assemble the search query for Norvegiana. For example free text search and what fields to sort by.
            */
            function SearchCriteria() {
                /**
                Query
                @member App.Models.SearchCriteria#query
                @public
                @type {KnockoutObservableString}
                */
                this.query = ko.observable(null);
                /**
                The user's position
                @member App.Models.SearchCriteria#pos
                @public
                @type {System.Models.KnockoutObservablePosition}
                */
                this.pos = ko.observable();
                /**
                Radius for the search around the user's position, 1 kilometer by default
                @member App.Models.SearchCriteria#radius
                @public
                @type {KnockoutObservableNumber}
                */
                this.radius = ko.observable(10);
                /**
                Amount of rows fetched during search
                @member App.Models.SearchCriteria#rows
                @public
                @type {KnockoutObservableNumber}
                */
                this.rows = ko.observable(20);
                /**
                Page number for this search
                @member App.Models.SearchCriteria#pageNumber
                @public
                @type {KnockoutObservableNumber}
                */
                this.pageNumber = ko.observable(1);
                /**
                Category
                @member App.Models.SearchCriteria#category
                @public
                @type {KnockoutObservableString}
                */
                this.category = ko.observable("*");
                /**
                Genre
                @member App.Models.SearchCriteria#category
                @public
                @type {KnockoutObservableString}
                */
                this.genre = ko.observable("*");
                /**
                MediaType
                @member App.Models.SearchCriteria#MediaType
                @public
                @type {KnockoutObservableString}
                */
                this.mediaType = ko.observable("*");
                /**
                TODO
                @member App.Models.SearchCriteria#sort
                @public
                @type {App.Models.SearchCriteriaSortingEnum}
                */
                this.sort = App.Models.SearchCriteriaSortingEnum.Distance;
                /**
                Norvegiana Query Fields
                @member App.Models.SearchCriteria#norvegiana_qf
                @public
                @type {KnockoutObservableArray}
                */
                this.norvegiana_qf = ko.observableArray();
            }
            return SearchCriteria;
        })();
        Models.SearchCriteria = SearchCriteria;
    })(App.Models || (App.Models = {}));
    var Models = App.Models;
})(App || (App = {}));
//@ sourceMappingURL=SearchCriteria.js.map
