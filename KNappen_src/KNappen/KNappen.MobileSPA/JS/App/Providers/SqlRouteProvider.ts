/// <reference path="../../../PhoneGap/InteropProviders/SqlProvider.ts" />
/// <reference path="../_References.ts" />

module App.Providers {

    export class SqlRouteProvider {

        /**
         * SqlRouteProvider
         * @class App.Providers.SqlRouteProvider
         * @classdesc Contains functions to read, insert and delete routes from disk.
         */
        constructor() {
        }

        /**
         * Get all routes. This will not load the POIs.
         * @param {function} finishedCallback Callback function for when POIs have been successfully read.
         */
        public readRoutes(finishedCallback: (routeItems: App.Providers.RouteItem[]) => void ) {
            var sql = "SELECT * FROM routes";

            if (!compatibilityInfo.isMobile) {
                log.error("SqlRouteProvider", "readRoutes: No database available");
                return;
            }

            sqlProvider.sqlDo("ReadRoutes", (tx: SQLTransaction, results: SQLResultSet) => {
                if (!results || !results.rows) {
                    log.debug("SqlRouteProvider", "sqlReadRoutes: Empty table: routes");
                    return;
                }

                var routeItems: App.Providers.RouteItem[] = [];

                try {
                    var length = results.rows.length;
                    log.debug("SqlRouteProvider", "ReadRoutes: routes table: " + length + " rows found.");
                    for (var i = 0; i < length; i++) {
                        var id = results.rows.item(i).id;
                        var type = results.rows.item(i).type;
                        var name = results.rows.item(i).name;
                        var version = parseInt(results.rows.item(i).version);
                        var isCached = (results.rows.item(i).mapCached === "true");

                        log.debug("SqlRouteProvider", "ReadRoutes: SQL Row: " + i + " key: " + name);

                        var routeItem = new App.Providers.RouteItem();
                        routeItem.id(id);
                        routeItem.type(type);
                        routeItem.name(name);
                        routeItem.version(version);
                        routeItem.isCached(isCached);

                        routeItems.push(routeItem);
                    }
                } catch (exception) {
                    log.error("SqlProvider", "sqlReadRoutes: exception was thorwn in callbackSuccess:" + exception);
                    throw exception;
                }

                finishedCallback(routeItems);
            }, (error: SQLError) => {
                    if (error)
                        log.error("SqlRouteProvider", "readRoutes: Reporting error to app: SQL: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                }, () => { log.debug("SqlRouteProvider", "readRoutes: Reporting success to app."); }, sql, []);
        }

        /**
         * Read POIs for the specified route.
         * @param {App.Providers.RouteItem} route The route to load POIs for.
         * @param {function} finishedCallback Callback function for when POIs have been successfully read.
         */
        public readPois(route: App.Providers.RouteItem, finishedCallback: (route: App.Providers.RouteItem) => void ) {
            var sql = "SELECT pois FROM routes WHERE id = '" + route.id() + "'";

            if (!compatibilityInfo.isMobile) {
                log.error("SqlRouteProvider", "readPois: No database available");
                return;
            }

            sqlProvider.sqlDo('ReadSpecificRoute', (tx: SQLTransaction, results: SQLResultSet) => {
                if (!results || !results.rows) {
                    log.debug("SqlRouteProvider", "readPois: No POIs found for id: " + route.id());
                    return;
                }

                try {
                    var pois = results.rows.item(0).pois;

                    var mappedPois: any;
                    try {
                        var parsedPois = JSON.parse(pois);
                        mappedPois = ko.mapping.fromJS(parsedPois);
                    } catch (error) { }

                    pois = mappedPois();
                    pois.forEach((mappedPoi) => {
                        var poi = new App.Models.PointOfInterest();

                        $.extend(poi, mappedPoi);
                        poi.pos = <System.Models.KnockoutObservablePosition>ko.observable(poi.pos);

                        route.pois().push(poi);
                    });
                } catch (exception) {
                    log.error("SqlRouteProvider", "readPois: exception was thorwn in callbackSuccess:" + exception);
                    throw exception;
                }

                route.poisLoaded(true);
                finishedCallback(route);
            }, (error: SQLError) => {
                    if (error)
                        log.error("SqlRouteProvider", "readPois: Reporting error to app: SQL: \"" + sql + "\": Error: " + error.code + ": " + error.message);
                },
                () => { log.debug("SqlRouteProvider", "readPois: Reporting success to app."); }, sql, []);
        }

        /**
         * Insert the specified route.
         * @param {App.Providers.RouteItem} route The route to insert.
         * @param {function} finishedCallback Callback function for when the route have been successfully inserted.
         */
        public insertRoute(route: App.Providers.RouteItem, finishedCallback: (route: App.Providers.RouteItem) => void = null) {

            if (!compatibilityInfo.isMobile) {
                log.error("SqlRouteProvider", "insertRoute: No database available");
                return;
            }

            var id = route.id();
            var type = route.type();
            var name = route.name();
            var pois = ko.mapping.toJSON(route.pois);
            var version = route.version();
            var mapCached = route.isCached();

            this.deleteRoute(route);
            sqlProvider.sqlDoSimple("InsertRoute", "INSERT OR IGNORE INTO routes (id, type, name, pois, version, mapCached) VALUES (?, ?, ?, ?, ?, ?)", [id, type, name, pois, version, mapCached]);
        }

        /**
         * Delete the specified route.
         * @param {App.Providers.RouteItem} route The route to delete.
         */
        public deleteRoute(route: App.Providers.RouteItem) {

            if (!compatibilityInfo.isMobile) {
                log.error("SqlRouteProvider", "deleteRoute: No database available");
                return;
            }

            var id = route.id();
            sqlProvider.sqlDoSimple("DeleteRoute", "DELETE FROM routes WHERE id=?", [id]);
        }
        
        /**
         * Updates the mapCached flag on a route.
         * @param {App.Providers.RouteItem} route The route to update.
        * @param {boolean} isCached The state of the flag.
         */
        public setRouteCached(routeId: string, isCached: boolean) {
            sqlProvider.sqlDoSimple("SetRouteCached", "UPDATE routes SET mapCached=? WHERE id=?", [isCached, routeId]);
        }
    }
}
var sqlRouteProvider = new App.Providers.SqlRouteProvider();