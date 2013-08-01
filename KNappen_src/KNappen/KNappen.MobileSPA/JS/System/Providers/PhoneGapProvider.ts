/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    export class PhoneGapProvider {

        /**
          * PhoneGapProvider
          * @class System.Providers.PhoneGapProvider
          * @classdesc Provides PhoneGap communication services.
          */
        constructor() {
        }

        /**
          * Store a key-value pair.
          * @method System.Providers.PhoneGapProvider#set
          * @param {string} table Name of SQL table.
          * @param {string} key Key to use for storage.
          * @param {string} value Value to store.
          */
        public SqlSetKey(table: string, key: string, value: string, meta: string) {
            this.sendPhoneGapCommand("sql", "set",
                {
                    "table": table,
                    "key": key,
                    "value": value,
                    "meta": meta
                });
        }
        /**
          * Remove a key-value pair.
          * @method System.Providers.PhoneGapProvider#remove
          * @param {string} table Name of SQL table.
          * @param {string} key Key to remove.
          */
        public SqlRemoveKey(table: string, key: string) {
            this.sendPhoneGapCommand("sql", "set",
                {
                    "table": table,
                    "key": key
                });
        }
        /**
          * Signal PhoneGap to read SQL table and set keys into storageProvider.
          * @method System.Providers.PhoneGapProvider#read
          * @param {string} table Name of SQL table.
          */
        public SqlRead(table: string) {
            this.sendPhoneGapCommand("sql", "read",
                {
                    "table": table
                });
        }

        /**
          * Callback used by PhoneGap to set SQL read key.
          * @method System.Providers.PhoneGapProvider#SqlCallbackSet
          * @param {string} key Key to set
          * @param {string} value Value to set
          * @param {string} metaStr Serialized metaobject to set
          */
        public SqlCallbackSet(key: string, value: string, metaStr: string) {
            storageProvider.setRaw(key, value);
            storageProvider.setRaw(key + ".meta", serializer.deserializeJSObject(metaStr));
        }

        /**
          * Open URL in system browser.
          * @method System.Providers.PhoneGapProvider#openUrl
          * @param {string} url URL to open
          */
        public openUrl(url: string) {
            var d: any = document;
            d.location = this.fixUrl(url);
        }

        /**
          * Fix URL for opening 
          * @method System.Providers.PhoneGapProvider#openUrl
          * @param {string} url URL to open
          */
        public fixUrl(url: string): string {
            return 'architectsdk://system?action=openUrl&url=' + encodeURIComponent(url);
        }

        // TODO: Move somewhere else?
        public fixALinksIfPhoneGap(obj: JQuery) {
            var _this = this;
            if (compatibilityInfo.isPhoneGap) {
                this.fixALinks(obj);
            }
            else {
                $(obj).find('a').each(function () {
                    $(this).attr('target', "_blank");
                });
            }
        }

        /**
          * Iterate JQuery object, find A href and fix URL for opening 
          * @method System.Providers.PhoneGapProvider#fixALinks
          * @param {JQuery} obj JQuery element(s) to scan for links
          */
        public fixALinks(obj: JQuery) {
            var _this = this;
            $(obj).find('a').each(function () {

                var href = $(this).attr('href');
                if (!stringUtils.startsWith(href, "architectsdk")) {
                    $(this).attr('href', _this.fixUrl(href));
                    //.removeAttr('href');
                }
            });
        }

        /**
          * Signal PhoneGap to exit application
          * @method System.Providers.PhoneGapProvider#sendExit
          */
        public sendExit() {
            this.sendPhoneGapCommand("system", "exit");
        }

        /**
          * Send command to PhoneGap
          * @method System.Providers.PhoneGapProvider#sendPhoneGapCommand
          * @param {string} target Target module/Command type
          * @param {string} action Action to perform
          * @param {array} params Key/value pair of parameters to pass to action
          */
        public sendPhoneGapCommand(target: string, action: string, params?: { [key: string]: string; }) {
            var url = 'architectsdk://' + target + '?action=' + encodeURIComponent(action);
            if (params) {
                $.each(params, function (k, v) {
                    if (k) {
                        url += "&" + encodeURIComponent(k)
                    if (v)
                            url += "=" + encodeURIComponent(v);
                    }
                });
            }

            log.debug("PhoneGapProvider", "Sending command type \"" + target + "\" action \"" + action + "\" to PhoneGap: " + url);

            var d: any = document;
            d.location = url;
        }


        /**
          * Callback from PhoneGap that menu button was clicked
          * @method System.Providers.PhoneGapProvider#callbackMenuButton
          */
        public callbackMenuButton() {
            $('#mainPopupMenu').toggle();
        }

        /**
          * Callback from PhoneGap that back button was clicked
          * @method System.Providers.PhoneGapProvider#callbackBackButton
          */
        public callbackBackButton() {
            log.debug("PhoneGapProvider", "Back button pressed. Navigating back.");
            var result = viewController.goBack();

            if (!result) {
                log.debug("PhoneGapProvider", "No more navigation history - exiting app.");
                this.sendExit();
            }
        }

        /**
          * Callback from PhoneGap that SQL read is done successfully
          * @method System.Providers.PhoneGapProvider#callbackSqlReadSuccess
          */
        public callbackSqlReadSuccess() {
            log.debug("PhoneGapProvider", "PhoneGapInterop reports success on SQL read.")
            startup.shortcutLoadTimeout();
        }

        /**
          * Callback from PhoneGap that SQL read is done with errors
          * @method System.Providers.PhoneGapProvider#callbackSqlReadError
          * @param {string} errorCode Error code
          * @param {string} errorMessage Error message
          */
        public callbackSqlReadError(errorCode: string, errorMessage: string) {
            log.debug("PhoneGapProvider", "PhoneGapInterop reports error on SQL read: Code: " + errorCode + ", message: " + errorMessage);
            startup.shortcutLoadTimeout();
        }

        /**
          * Callback from PhoneGap with GPS position update
          * @method System.Providers.PhoneGapProvider#callbackGeoLocationUpdate
          * @param {number} latitude Latitude
          * @param {number} longitude Longditude
          * @param {number} altitude Altitude
          * @param {number} accuracy Position accuracy
          * @param {number} altitudeAccuracy Altitude accuracy
          * @param {number} heading Heading
          * @param {number} speed Speed
          * @param {number} timestamp Timestamp of pos
          */
        public callbackGeoLocationUpdate(latitude: number, longitude: number, altitude: number, accuracy: number, altitudeAccuracy: number, heading: number, speed: number, timestamp: number) {
            gpsProvider.setPos(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp);
        }


    }
}
var phoneGapProvider = new System.Providers.PhoneGapProvider();