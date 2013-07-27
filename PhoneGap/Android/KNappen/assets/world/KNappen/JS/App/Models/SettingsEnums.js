var App;
(function (App) {
    /**
    Model modules
    @namespace App.Models
    */
    (function (Models) {
        var MapType;
        (function (MapType) {
            MapType[MapType["Norges_Grunnkart"] = 1] = "Norges_Grunnkart";

            MapType[MapType["Matrikkel_Bakgrunn"] = 2] = "Matrikkel_Bakgrunn";
        })(MapType || (MapType = {}));

        var ZoomLevel;
        (function (ZoomLevel) {
            ZoomLevel[ZoomLevel["Close"] = 1] = "Close";
            ZoomLevel[ZoomLevel["Medium"] = 2] = "Medium";

            ZoomLevel[ZoomLevel["Far"] = 3] = "Far";
        })(ZoomLevel || (ZoomLevel = {}));
    })(App.Models || (App.Models = {}));
    var Models = App.Models;
})(App || (App = {}));
//@ sourceMappingURL=SettingsEnums.js.map
