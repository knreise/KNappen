/// <reference path="../../../Scripts/typings/google.analytics/ga.d.ts" />
/// <reference path="../ConfigBase.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers
{
    declare var config: System.ConfigBase;
    export class GoogleAnalyticsProvider
    {
        //ga: GoogleAnalytics = null;
        /**
          * GoogleAnalyticsProvider
          * @class System.Providers.GoogleAnalyticsProvider
          * @classdesc Provides Google Analytics reporting.
          */
        constructor() {
            _gaq.push(['_setAccount', config.googleAnalyticsKey]);
            _gaq.push(['_trackPageview']);

            (function () {
                var ga: any = document.createElement('script');
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
        public reportPageVisit(page: string)
        {
            this.reportEvent("Page", "Open", page);
        }

        public reportEvent(category: string, action: string, label: string, count?: number) {
            if (count)
                _gaq.push(['_trackEvent', category, action, label, count.toString()]);
            else
                _gaq.push(['_trackEvent', category, action, label]);
        }
    }
}
var _gaq = _gaq || [];
