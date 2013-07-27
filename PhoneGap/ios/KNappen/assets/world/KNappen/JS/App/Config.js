var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="_References.ts" />
/// <reference path="../System/ConfigBase.ts" />
/**
App
@namespace App
*/
var App;
(function (App) {
    var Config = (function (_super) {
        __extends(Config, _super);
        function Config() {
            _super.apply(this, arguments);
            //if user does not have gps pos, start here by default (oslo sentrum)
            this.mapStartPos = new System.Models.Position(59.9122, 10.7517);
            this.norvegianaAutoRetryDelaySeconds = 10;
            this.norvegianaAutoRetryCount = 3;
            this.norvegianaSearchTimeoutSeconds = 30;
            this.searchTimeoutSeconds = 30;
            this.norvegianaURL = 'http://kn-reise.delving.org/organizations/kn-reise/api/search?query=';
            this.ssrURL = 'https://ws.geonorge.no/SKWS3Index/ssr/sok';
            this.templatePOIDetailsView = "Views/POIDetails.html";
            this.templateAboutView = "Views/About.html";
            this.templatePOIPreview = "POIPreview.html";
            this.templatePOIAR = "POIAR.html";
            // For "prod"
            this.routeAdminIndexUrl = "http://knappen.konge.net/KNappenService.Prod/api/RouteIndex";
            this.routeAdminDownloadUrl = "http://knappen.konge.net/KNappenService.Prod/api/Route";
            this.poiTypeDataUrl = "http://knappen.konge.net/KNappenService.Prod/FileService.aspx?file=TypeInfo.json";
            this.feedbackUrl = "http://knappen.konge.net/KNappenService.Prod/api/Feedback";
            this.adminRouteUrl = "http://knappen.konge.net/KNappenService.Prod/api/Route";
            this.webProxy = "http://knappen.konge.net/KNappenService.Prod/WebProxy.aspx?url=";
            this.numSearchProviders = 3;
            this.digitakArkivetPropertyCategory = "Historie og samfunn";
        }
        return Config;
    })(System.ConfigBase);
    App.Config = Config;
})(App || (App = {}));
var config = new App.Config();
//@ sourceMappingURL=Config.js.map
