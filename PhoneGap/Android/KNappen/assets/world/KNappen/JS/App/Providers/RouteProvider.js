var App;
(function (App) {
    /// <reference path="../_References.ts" />
    /**
    Controller modules
    @namespace App.Providers
    */
    (function (Providers) {
        var RouteItem = (function () {
            /**
            RouteItem
            @class App.Providers.RouteItem
            @classdesc This class contains the fields needed for a route.
            */
            function RouteItem() {
                this.id = ko.observable('');
                this.name = ko.observable('');
                this.version = ko.observable(1);
                this.pois = ko.observableArray();
                this.id(stringUtils.mkGUID());
            }
            return RouteItem;
        })();
        Providers.RouteItem = RouteItem;

        var RouteArray = (function () {
            function RouteArray() {
                this.routes = ko.observableArray();
            }
            return RouteArray;
        })();
        Providers.RouteArray = RouteArray;

        var RouteProvider = (function () {
            /**
            RouteProvider
            @class App.Providers.RouteProvider
            @classdesc This contains RouteProviderHelpers for admin and user defined routes
            */
            function RouteProvider() {
                this.adminRoutes = new App.Providers.RouteProviderHelper("Admin");
                this.userRoutes = new App.Providers.RouteProviderHelper("User");
                this.searchRoutes = new App.Providers.RouteProviderHelper("Search");
            }
            return RouteProvider;
        })();
        Providers.RouteProvider = RouteProvider;

        var RouteProviderHelper = (function () {
            /**
            RouteProviderHelper
            @class App.Providers.RouteProviderHelper
            @classdesc This class provides methods for loading routes from server or disk, aswell as create, read and update methods for a route
            */
            function RouteProviderHelper(prefix) {
                this.prefix = prefix;
                this.routeArray = new App.Providers.RouteArray();
                this.fileName = null;
                // Read routes from disk
                this.fileName = "Route." + this.prefix + ".json";
            }
            /**
            Return routes
            @method App.Providers.RouteProviderHelper#getRoutes
            @public
            */
            RouteProviderHelper.prototype.getRoutes = function () {
                log.debug("RouteProvider", "Returning " + this.routeArray.routes().length + " routes");
                return this.routeArray.routes();
            };

            /**
            Returns a RouteItem based on the name of the route
            @method App.Providers.RouteProviderHelper#findRouteByName
            @param {string} name
            @public
            */
            RouteProviderHelper.prototype.findRouteByName = function (name) {
                var ret = null;
                this.routeArray.routes().forEach(function (value, index, array) {
                    if (value.name() == name)
                        ret = value;
                });
                var rn = "Not found";
                if (!ret)
                    rn = "Found";
                log.debug("RouteProvider", "FindRoute: name: " + name + ", status: " + rn);
                return ret;
            };

            /**
            Returns a RouteItem based on the id of the route
            @method App.Providers.RouteProviderHelper#findRouteById
            @param {string} id
            @public
            */
            RouteProviderHelper.prototype.findRouteById = function (id) {
                var ret = null;
                this.routeArray.routes().forEach(function (value, index, array) {
                    if (value.id() == id)
                        ret = value;
                });
                var rn = "Not found";
                if (!ret)
                    rn = "Found";
                log.debug("RouteProvider", "FindRoute: id: " + id + ", status: " + rn);
                return ret;
            };

            /**
            Adds a route to the RouteArray
            @method App.Providers.RouteProviderHelper#addRoute
            @param {App.Providers.RouteItem} route
            @public
            */
            RouteProviderHelper.prototype.addRoute = function (route) {
                this.removeRoute(route);
                log.debug("RouteProvider", "Adding route: " + route.name());
                this.routeArray.routes.push(route);
            };

            /**
            Removes a route to the RouteArray
            @method App.Providers.RouteProviderHelper#removeRoute
            @param {App.Providers.RouteItem} route
            @public
            */
            RouteProviderHelper.prototype.removeRoute = function (route) {
                log.debug("RouteProvider", "Removing route: " + route.name());
                var newRoutes = this.routeArray.routes().filter(function (r, index, array) {
                    return r.name().toString() !== route.name().toString();
                });
                this.routeArray.routes(newRoutes);
            };

            /**
            Clears the RouteArray
            @method App.Providers.RouteProviderHelper#clearRoutes
            @public
            */
            RouteProviderHelper.prototype.clearRoutes = function () {
                log.debug("RouteProvider", "clearRoutes()");
                this.routeArray.routes = ko.observableArray();
            };

            /**
            Load Routes
            @method App.Providers.RouteProviderHelper#loadRoutes
            @public
            */
            RouteProviderHelper.prototype.loadRoutes = function () {
                log.debug("RouteProvider", "Loading routes from filename \"" + this.fileName + "\"");
                this.clearRoutes();
                try  {
                    serializer.deserializeKnockoutObjectFromFile(this.fileName, this.routeArray);
                } catch (exception) {
                    log.error("RouteProvider", "Exception loading routes from filename \"" + this.fileName + "\": " + exception);
                }

                // Create PointOfInterest instance of it
                //var newRoutes: App.Providers.KnockoutObservableRouteItemArray = <App.Providers.KnockoutObservableRouteItemArray>ko.observableArray();
                $.each(this.routeArray.routes(), function (k, v) {
                    var newPois = ko.observableArray();

                    $.each(v.pois(), function (k, v2) {
                        var r = new App.Models.PointOfInterest();

                        //var v3: any = v2;
                        //var p = new System.Models.Position(<number>v3.pos.lat(), <number>v3.pos.lon());
                        $.extend(r, v2);
                        r.pos = ko.observable(r.pos);

                        newPois.push(r);
                    });
                    v.pois = newPois;
                });
            };

            /**
            Save Routes
            @method App.Providers.RouteProviderHelper#saveRoutes
            @public
            */
            RouteProviderHelper.prototype.saveRoutes = function () {
                log.debug("RouteProvider", "Saving routes to filename \"" + this.fileName + "\"");
                try  {
                    serializer.serializeKnockoutObjectToFile(this.fileName, this.routeArray);
                } catch (exception) {
                    log.error("RouteProvider", "Exception saving routes to filename \"" + this.fileName + "\": " + exception);
                }
            };
            return RouteProviderHelper;
        })();
        Providers.RouteProviderHelper = RouteProviderHelper;
    })(App.Providers || (App.Providers = {}));
    var Providers = App.Providers;
})(App || (App = {}));
//@ sourceMappingURL=RouteProvider.js.map
