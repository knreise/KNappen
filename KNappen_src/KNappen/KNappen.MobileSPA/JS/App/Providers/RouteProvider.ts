/// <reference path="../_References.ts" />

/**
    Controller modules
    @namespace App.Providers
*/
module App.Providers {

    export interface KnockoutObservableRouteItemArray extends KnockoutObservableArray {
        (): App.Providers.RouteItem[];
        (value: App.Providers.RouteItem[]): void;

        subscribe(callback: (newValue: App.Providers.RouteItem[]) => void , target?: any, topic?: string): KnockoutSubscription;
        notifySubscribers(valueToWrite: App.Providers.RouteItem[], topic?: string);
    }
    export class RouteItem {
        public id: KnockoutObservableString = ko.observable('');
        public name: KnockoutObservableString = ko.observable('');
        public version: KnockoutObservableNumber = ko.observable(1);
        public pois: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();

        /**
            RouteItem
            @class App.Providers.RouteItem
            @classdesc This class contains the fields needed for a route.
        */
        constructor() {
            this.id(stringUtils.mkGUID());
        }
    }

    export class RouteArray {
        public routes: App.Providers.KnockoutObservableRouteItemArray = <App.Providers.KnockoutObservableRouteItemArray>ko.observableArray();
    }

    export class RouteProvider {

        /**
            RouteProvider
            @class App.Providers.RouteProvider
            @classdesc This contains RouteProviderHelpers for admin and user defined routes
        */
        constructor() {
        }

        public adminRoutes = new App.Providers.RouteProviderHelper("Admin");
        public userRoutes = new App.Providers.RouteProviderHelper("User");
        public searchRoutes = new App.Providers.RouteProviderHelper("Search");
    }

    export class RouteProviderHelper {

        private routeArray: App.Providers.RouteArray = new App.Providers.RouteArray();
        private fileName: string = null;

        /**
            RouteProviderHelper
            @class App.Providers.RouteProviderHelper
            @classdesc This class provides methods for loading routes from server or disk, aswell as create, read and update methods for a route
        */
        constructor(public prefix: string) {
            // Read routes from disk
            this.fileName = "Route." + this.prefix + ".json";
            //this.loadRoutes();
        }

        /**
            Return routes 
            @method App.Providers.RouteProviderHelper#getRoutes
            @public
        */
        public getRoutes(): App.Providers.RouteItem[] {
            log.debug("RouteProvider", "Returning " + this.routeArray.routes().length + " routes");
            return this.routeArray.routes();
        }

        /**
            Returns a RouteItem based on the name of the route
            @method App.Providers.RouteProviderHelper#findRouteByName
            @param {string} name
            @public
        */
        public findRouteByName(name: string): App.Providers.RouteItem {
            var ret: App.Providers.RouteItem = null;
            this.routeArray.routes().forEach(function (value: App.Providers.RouteItem, index: number, array: App.Providers.RouteItem[]) {
                if (value.name() == name)
                    ret = value;
            });
            var rn = "Not found";
            if (!ret)
                rn = "Found";
            log.debug("RouteProvider", "FindRoute: name: " + name + ", status: " + rn);
            return ret;
        }

        /**
            Returns a RouteItem based on the id of the route
            @method App.Providers.RouteProviderHelper#findRouteById
            @param {string} id
            @public
        */
        public findRouteById(id: string): App.Providers.RouteItem {
            var ret: App.Providers.RouteItem = null;
            this.routeArray.routes().forEach(function (value: App.Providers.RouteItem, index: number, array: App.Providers.RouteItem[]) {
                if (value.id() == id)
                    ret = value;
            });
            var rn = "Not found";
            if (!ret)
                rn = "Found";
            log.debug("RouteProvider", "FindRoute: id: " + id + ", status: " + rn);
            return ret;
        }

        /**
            Adds a route to the RouteArray
            @method App.Providers.RouteProviderHelper#addRoute
            @param {App.Providers.RouteItem} route
            @public
        */
        public addRoute(route: App.Providers.RouteItem) {
            this.removeRoute(route);
            log.debug("RouteProvider", "Adding route: " + route.name());
            this.routeArray.routes.push(route);
        }

        /**
            Removes a route to the RouteArray
            @method App.Providers.RouteProviderHelper#removeRoute
            @param {App.Providers.RouteItem} route
            @public
        */
        public removeRoute(route: App.Providers.RouteItem) {
            log.debug("RouteProvider", "Removing route: " + route.name());
            var newRoutes = this.routeArray.routes().filter(function (r: App.Providers.RouteItem, index, array) {
                return r.name().toString() !== route.name().toString();
            });
            this.routeArray.routes(newRoutes);
        }

        /**
            Clears the RouteArray
            @method App.Providers.RouteProviderHelper#clearRoutes
            @public
        */
        public clearRoutes() {
            log.debug("RouteProvider", "clearRoutes()");
            this.routeArray.routes = ko.observableArray();
        }

        /**
            Load Routes
            @method App.Providers.RouteProviderHelper#loadRoutes
            @public
        */
        public loadRoutes() {
            log.debug("RouteProvider", "Loading routes from filename \"" + this.fileName + "\"");
            this.clearRoutes();
            try {
                serializer.deserializeKnockoutObjectFromFile(this.fileName, this.routeArray);
            } catch (exception) {
                log.error("RouteProvider", "Exception loading routes from filename \"" + this.fileName + "\": " + exception);
            }
            // Create PointOfInterest instance of it
            //var newRoutes: App.Providers.KnockoutObservableRouteItemArray = <App.Providers.KnockoutObservableRouteItemArray>ko.observableArray();
            $.each(this.routeArray.routes(), function (k, v: App.Providers.RouteItem) {
                var newPois: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();

                $.each(v.pois(), function (k, v2: App.Models.PointOfInterest) {
                    var r = new App.Models.PointOfInterest();
                    //var v3: any = v2;
                    //var p = new System.Models.Position(<number>v3.pos.lat(), <number>v3.pos.lon());
                    $.extend(r, v2);
                    r.pos = <System.Models.KnockoutObservablePosition>ko.observable(r.pos);

                    newPois.push(r);
                });
                v.pois = newPois;
            });
            //this.routeArray.routes = newRoutes;
        }

        /**
            Save Routes
            @method App.Providers.RouteProviderHelper#saveRoutes
            @public
        */
        public saveRoutes() {
            log.debug("RouteProvider", "Saving routes to filename \"" + this.fileName + "\"");
            try {
                serializer.serializeKnockoutObjectToFile(this.fileName, this.routeArray);
            } catch (exception) {
                log.error("RouteProvider", "Exception saving routes to filename \"" + this.fileName + "\": " + exception);
            }
        }
    }
}