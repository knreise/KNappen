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
        public type: KnockoutObservableString = ko.observable('');
        public version: KnockoutObservableNumber = ko.observable(1);
        public pois: App.Models.KnockoutObservablePointOfInterestArray = <App.Models.KnockoutObservablePointOfInterestArray>ko.observableArray();
        public isCached: KnockoutObservableBool = ko.observable(false);
        public poisLoaded: KnockoutObservableBool = ko.observable(false);

        /**
            RouteItem
            @class App.Providers.RouteItem
            @classdesc This class contains the fields needed for a route.
        */
        constructor() {
            this.id(stringUtils.mkGUID());
        }

        /**
         * Increment the version number.
         */
        public incrementVersion() {
            var newVersion = this.version() + 1;
            this.version(newVersion);
        }
        
        /**
         * Remove all POIs from memory.
         */
        public resetPois() {
            this.pois.removeAll();
            this.poisLoaded(false);
        }
    }

    export class RouteProvider {

        /**
         * RouteProvider
         * @class App.Providers.RouteProvider
         * @classdesc This class contains routes and functions for loading, saving and deleting routes.
         */
        constructor() {
        }

        public adminRoutes = new App.Providers.RouteProviderHelper(RouteType.Admin);
        public userRoutes = new App.Providers.RouteProviderHelper(RouteType.User);

        /**
         * Load all routes to memory, without POIs.
         */
        public loadRoutes() {
            log.debug("RouteProvider", "Loading routes from sqlDatabase.");

            sqlRouteProvider.readRoutes((routeItems: RouteItem[]) => {
                routeItems.forEach((route: RouteItem) => {
                    if (route.type() === RouteType[RouteType.Admin])
                        this.adminRoutes.addRoute(route);
                    else
                        this.userRoutes.addRoute(route);
                });
            });
        }

        /**
         * Load POIs for the specified route.
         * @param {App.Providers.RouteItem} route The route to load POIs.
         * @param {function} finished Callback function for when POIs have been loaded.
         */
        public loadPois(route: RouteItem, finished: () => void ) {
            this.removeAllPoisFromMemory();

            sqlRouteProvider.readPois(route, () => {
                finished();
            });
        }

        /**
         * Save the specified route to disk.
         * @param {App.Providers.RouteItem} route The route to save.
         */
        public saveRoute(route: RouteItem) {
            sqlRouteProvider.insertRoute(route);
        }

        /**
         * Set the route as cached and save the changes to disk.
         * @param {App.Providers.RouteItem} route The route to update.
         */
        public setRouteIsCached(route: RouteItem) {
            log.info("RouteProvider", "Indicating that the route with id " + route.id() + " has downloaded/cached the map tiles for this route");
            route.isCached(true);
            sqlRouteProvider.setRouteCached(route.id(), true);
        }

        /**
         * Set the route as not cached and save the changes to disk.
         * @param {App.Providers.RouteItem} route The route to save.
         */
        public resetRouteIsCached(route: RouteItem) {
            log.info("RouteProvider", "Indicating that the route with id " + route.id() + " no longer has downloaded/cached the map tiles for this route");
            route.isCached(false);
            sqlRouteProvider.setRouteCached(route.id(), false);
        }

        /**
         * Delete the specified route.
         * @param {App.Providers.RouteItem} route The route to delete.
         */
        public deleteRoute(route: RouteItem) {
            sqlRouteProvider.deleteRoute(route);
        }

        /**
         * Remove all POIs from memory. This will not alter stored POIs.
         */
        public removeAllPoisFromMemory() {
            this.adminRoutes.removeAllPoisFromMemory();
            this.userRoutes.removeAllPoisFromMemory();
        }
    }


    export class RouteProviderHelper {

        private routes: App.Providers.KnockoutObservableRouteItemArray = <App.Providers.KnockoutObservableRouteItemArray>ko.observableArray();
        
        /**
         * RouteProviderHelper
         * @class App.Providers.RouteProviderHelper
         * @classdesc This class is an in-memory route contianer.
         * @param {App.Providers.RouteType} type Type of the routes.
         */
        constructor(public type: RouteType) {
        }

        /**
         * Adds a route to memory. This will not save it to disk.
         * @param {App.Providers.RouteItem} route The route to add.
         */
        public addRoute(route: App.Providers.RouteItem) {
            this.routes.push(route);
        }

        /**
         * Get all routes.
         * @return {App.Providers.RouteItem[]} All routes.
         */
        public getRoutes(): App.Providers.RouteItem[] {
            return this.routes();
        }

        /**
         * Find a route by the specified name.
         * @param {string} name Name of the route.
         * @return {App.Providers.RouteItem} The found route.
         */
        public findRouteByName(name: string): App.Providers.RouteItem {
            return this.findRoute((route: App.Providers.RouteItem): boolean => {
                return (route.name() === name);
            });
        }

        /**
         * Find a route by the specified id.
         * @param {string} id Id of the route.
         * @return {App.Providers.RouteItem} The found route.
         */
        public findRouteById(id: string): App.Providers.RouteItem {
            return this.findRoute((route: App.Providers.RouteItem): boolean => {
                return (route.id() === id);
            });
        }

        /**
         * Find a route based on the specified callback.
         * @param {function} predicate A callback that return true for a matching item.
         * @return {App.Providers.RouteItem} The found route.
         */
        private findRoute(predicate: (route) => boolean): App.Providers.RouteItem {
            var foundRoute: App.Providers.RouteItem;

            this.routes().some((_route: App.Providers.RouteItem): boolean => {
                if (predicate(_route)) {
                    foundRoute = _route;
                    return true;
                }
                return false;
            });

            var statusMessage = "Not found";
            if (!foundRoute)
                statusMessage = "Found";
            log.debug("RouteProvider", "FindRoute: status: " + statusMessage);

            return foundRoute;
        }

        /**
         * Remove the specified route from memory.
         * @param {App.Providers.RouteItem} route The route to be removed.
         */
        public removeRoute(route: App.Providers.RouteItem) {
            log.debug("RouteProvider", "Removing route: " + route.name());

            var newRoutes = this.routes().filter((_route: App.Providers.RouteItem) => (_route.name() !== route.name()));

            this.routes(newRoutes);
            log.debug("RouteProvider", "Removing route: " + route.name());
        }

        /**
         * Remove all POIs from memory. This will not alter stored POIs.
         */
        public removeAllPoisFromMemory() {
            return this.routes().forEach((route) => {
                if (route.poisLoaded())
                    route.resetPois();
            });
        }
    }

    /**
     * Describes the type of route.
     */
    export enum RouteType {
        Admin,
        User
    }
}