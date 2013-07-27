var System;
(function (System) {
    /// <reference path="../../../Scripts/typings/google.analytics/ga.d.ts" />
    /// <reference path="../ConfigBase.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var GoogleAnalyticsProvider = (function () {
            //ga: GoogleAnalytics = null;
            /**
            * GoogleAnalyticsProvider
            * @class System.Providers.GoogleAnalyticsProvider
            * @classdesc Provides Google Analytics reporting.
            */
            function GoogleAnalyticsProvider() {
                _gaq.push(['_setAccount', config.googleAnalyticsKey]);
                _gaq.push(['_trackPageview']);

                (function () {
                    var ga = document.createElement('script');
                    ga.type = 'text/javascript';
                    ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ga, s);
                })();
            }
            /**
            * Report a page to Google Analytics
            * @method System.Providers.GoogleAnalyticsProvider#reportPageVisit
            * @param {string} page Page name to report.
            */
            GoogleAnalyticsProvider.prototype.reportPageVisit = function (page) {
                this.reportEvent("Page", "Open", page);
            };

            GoogleAnalyticsProvider.prototype.reportEvent = function (category, action, label, count) {
                if (count)
                    _gaq.push(['_trackEvent', category, action, label, count.toString()]); else
                    _gaq.push(['_trackEvent', category, action, label]);
            };
            return GoogleAnalyticsProvider;
        })();
        Providers.GoogleAnalyticsProvider = GoogleAnalyticsProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var _gaq = _gaq || [];
//@ sourceMappingURL=GoogleAnalyticsProvider.js.map
