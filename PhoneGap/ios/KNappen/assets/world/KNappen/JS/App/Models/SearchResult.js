var App;
(function (App) {
    /// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
    /// <reference path="PointOfInterest.ts" />
    /// <reference path="../../System/Models/Position.ts" />
    /**
    Model modules
    @namespace App.Models
    */
    (function (Models) {
        var SearchResult = (function () {
            /**
            SearchResult
            @class App.Models.SearchResult
            @classdesc This class the contains an Observable array of Points of Interest as a result from a search
            */
            function SearchResult() {
                /**
                Number of rows found
                @member App.Models.SearchResult#numFound
                @public
                @type {KnocoutObservableNumber}
                */
                this.numFound = ko.observable(0);
                /**
                Max number of rows found in a single searchprovider
                @member App.Models.SearchResult#singleMaxNum
                @public
                @type {KnocoutObservableNumber}
                */
                this.singleMaxNum = ko.observable(0);
                /**
                Observable array of Points of Interest
                @member App.Models.SearchResult#items
                @public
                @type {KnocoutObservablePointOfInterestArray}
                */
                this.items = ko.observableArray();
            }
            return SearchResult;
        })();
        Models.SearchResult = SearchResult;
    })(App.Models || (App.Models = {}));
    var Models = App.Models;
})(App || (App = {}));
//@ sourceMappingURL=SearchResult.js.map
