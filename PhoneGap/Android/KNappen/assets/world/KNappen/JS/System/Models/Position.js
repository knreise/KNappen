var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    Models
    @namespace System.Models
    */
    (function (Models) {
        var Position = (function () {
            /**
            Position
            @class System.Models.Position
            @classdesc Creates an instance of a position object
            @property {number} Latitude.
            @property {number} Longditude.
            @property {number} Altitude.
            @property {number} Accelleration.
            */
            function Position(lat, lon, alt, acc, altitudeAccuracy, heading, speed, timestamp) {
                this.lat = ko.observable(lat);
                this.lon = ko.observable(lon);
                this.alt = ko.observable(alt);
                this.acc = ko.observable(acc);

                this.altitudeAccuracy = ko.observable();
                this.heading = ko.observable();
                this.speed = ko.observable();
                this.timestamp = ko.observable();
            }
            Position.prototype.toString = function () {
                return "lat: " + (this.lat() || "NA") + ", lon: " + (this.lon() || "NA") + ", alt: " + (this.alt() || "NA") + ", acc: " + (this.acc() || "NA");
            };
            return Position;
        })();
        Models.Position = Position;
    })(System.Models || (System.Models = {}));
    var Models = System.Models;
})(System || (System = {}));
//@ sourceMappingURL=Position.js.map
