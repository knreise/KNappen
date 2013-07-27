/// <reference path="../_References.ts" />
/**
    Providers
    @namespace App.Providers
*/
module App.Providers
{
    declare var $;
    export class MultiViewBindingProvider
    {
        public searchCriteria: KnockoutObservableAny = ko.observable();
        public searchResult: KnockoutObservableAny = ko.observable();
        public settings = ko.observable();

        /**
            MultiViewBindingProvider
            @class App.Providers.MultiViewBindingProvider
            @classdesc Binds the settings values with knockout, autobinds search result
        */
        constructor() {
        }

        /**
            PostInit
            @method App.Providers.MultiViewBindingProvider#PostInit
            @public
        */
        public PostInit() {
            log.debug("MultiViewBindingProvider", "PostInit()");

            // Grab some objects that are ready already
            this.searchCriteria(searchController.searchCriteria);
            this.settings(settings);

            // Databind settings object         
            ko.applyBindings(multiViewBindingProvider);
           // this.refresh();

            // Sign up to autobind search result
            var _this = this;
            searchController.addSearchResultCallback(
                function (event: JQueryEventObject, searchResult: App.Models.SearchResult) {
                _this.searchResult(searchResult);
            });

        }

        //public refresh() {
        //    // Refresh all <select /> because of jQuery Mobile madness (no problem, googling this for 2 hours was fun)
        //    $("select.refreshSelectAfterDataBind").each(function (index: any, element: Element) {
        //        $(element).selectmenu('refresh', true);
        //    });
        //}
    }
}
var multiViewBindingProvider = new App.Providers.MultiViewBindingProvider();
startup.addPostInit(function () { multiViewBindingProvider.PostInit(); }, "MultiViewBindingProvider");