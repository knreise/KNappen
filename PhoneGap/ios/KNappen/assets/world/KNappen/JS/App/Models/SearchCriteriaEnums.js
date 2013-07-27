var App;
(function (App) {
    /**
    Model modules
    @namespace App.Models
    */
    (function (Models) {
        (function (SearchCriteriaSortingEnum) {
            SearchCriteriaSortingEnum[SearchCriteriaSortingEnum["Distance"] = 0] = "Distance";
            SearchCriteriaSortingEnum[SearchCriteriaSortingEnum["Subject"] = 1] = "Subject";

            SearchCriteriaSortingEnum[SearchCriteriaSortingEnum["PublishingDate"] = 2] = "PublishingDate";
        })(Models.SearchCriteriaSortingEnum || (Models.SearchCriteriaSortingEnum = {}));
        var SearchCriteriaSortingEnum = Models.SearchCriteriaSortingEnum;
    })(App.Models || (App.Models = {}));
    var Models = App.Models;
})(App || (App = {}));
//@ sourceMappingURL=SearchCriteriaEnums.js.map
