var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Providers
    @namespace App.Providers
    */
    (function (Providers) {
        var MultiViewBindingProvider = (function () {
            /**
            MultiViewBindingProvider
            @class App.Providers.MultiViewBindingProvider
            @classdesc Binds the settings values with knockout, autobinds search result
            */
            function MultiViewBindingProvider() {
                this.searchCriteria = ko.observable();
                this.searchResult = ko.observable();
                this.settings = ko.observable();
            }
            /**
            PostInit
            @method App.Providers.MultiViewBindingProvider#PostInit
            @public
            */
            MultiViewBindingProvider.prototype.PostInit = function () {
                log.debug("MultiViewBindingProvider", "PostInit()");

                // Grab some objects that are ready already
                this.searchCriteria(searchController.searchCriteria);
                this.settings(settings);

                // Databind settings object
                ko.applyBindings(multiViewBindingProvider);

                // this.refresh();
                // Sign up to autobind search result
                var _this = this;
                searchController.addSearchResultCallback(function (event, searchResult) {
                    _this.searchResult(searchResult);
                });
            };
            return MultiViewBindingProvider;
        })();
        Providers.MultiViewBindingProvider = MultiViewBindingProvider;
    })(App.Providers || (App.Providers = {}));
    var Providers = App.Providers;
})(App || (App = {}));
var multiViewBindingProvider = new App.Providers.MultiViewBindingProvider();
startup.addPostInit(function () {
    multiViewBindingProvider.PostInit();
}, "MultiViewBindingProvider");
//@ sourceMappingURL=MultiViewBindingProvider.js.map
