var System;
(function (System) {
    /// <reference path="../_References.ts" />
    //todo: move to poicontroller
    (function (GUI) {
        var PoiDialog = (function () {
            function PoiDialog() {
            }
            PoiDialog.prototype.Init = function () {
                log.debug("dialog", "appending dialog");
                $("body").append('<a id="lnkDetail" href="#poiDetail" data-rel="dialog">Test</a>' + '<div data-role="page" id="poiDetail"></div>');
            };

            PoiDialog.prototype.OpenDetail = function (poi) {
                log.debug("PoiDialog", "Trying to append and open");

                var $dialog1 = $("#poiDetail");

                var content = "<div data-role='header' role='banner'>X</div><h2>" + poi.name() + "</h2></br><img src='" + poi.thumbnail() + "'/></br><h3>" + poi.description() + "</h3>";
                log.debug("PoiDialog", "called dialog");

                $dialog1.html(content);

                phoneGapProvider.fixALinksIfPhoneGap($dialog1);

                $("#lnkDetail").click();
                log.debug("PoiDialog", "called open");
            };
            return PoiDialog;
        })();
        GUI.PoiDialog = PoiDialog;
    })(System.GUI || (System.GUI = {}));
    var GUI = System.GUI;
})(System || (System = {}));
var poiDialog = new System.GUI.PoiDialog();
//@ sourceMappingURL=PoiDialog.js.map
