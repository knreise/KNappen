var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var App;
(function (App) {
    /// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
    /// <reference path="../_References.ts" />
    /**
    Model modules
    @namespace App.Models
    */
    (function (Models) {
        var PointOfInterest = (function (_super) {
            __extends(PointOfInterest, _super);
            function PointOfInterest() {
                _super.apply(this, arguments);
                this.name = ko.observable("");
                this.description = ko.observable("");
                this.link = ko.observable("");
                this.thumbnail = ko.observable("");
                this.year = ko.observable("");
                this.landingPage = ko.observable("");
                this.license = ko.observable("");
                this.categories = ko.observableArray([]);
                this.ingress = ko.observable("");
                this.body = ko.observable("");
                this.creator = ko.observable("");
                this.institution = ko.observable("");
                this.owner = ko.observable("");
                this.tags = ko.observable("");
                this.linkMoreInfo = ko.observable("");
                this.mediaTypes = ko.observableArray([]);
                this.soundUri = ko.observable("");
                this.videoUri = ko.observable("");
                this.originalVersion = ko.observable("");
            }
            return PointOfInterest;
        })(System.Models.PointOfInterestBase);
        Models.PointOfInterest = PointOfInterest;
    })(App.Models || (App.Models = {}));
    var Models = App.Models;
})(App || (App = {}));
//@ sourceMappingURL=PointOfInterest.js.map
