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
            this.sendPhoneGapCommand("sql", "remove",
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
            this.sendPhoneGapCommand("sql", "remove",
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

        public sendExit() {
            this.sendPhoneGapCommand("system", "exit");
        }

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


        public callbackMenuButton() {
            $('#mainPopupMenu').toggle();
        }

        public callbackBackButton() {
            log.debug("PhoneGapProvider", "Back button pressed. Navigating back.");
            var result = viewController.goBack();

            if (!result) {
                log.debug("PhoneGapProvider", "No more navigation history - exiting app.");
                this.sendExit();
            }
        }

        public callbackSqlReadSuccess() {
            log.debug("PhoneGapProvider", "PhoneGapInterop reports success on SQL read.")
            startup.shortcutLoadTimeout();
        }

        public callbackSqlReadError(errorCode: string, errorMessage: string) {
            log.debug("PhoneGapProvider", "PhoneGapInterop reports error on SQL read: Code: " + errorCode + ", message: " + errorMessage);
            startup.shortcutLoadTimeout();
        }

        public callbackGeoLocationUpdate(latitude: number, longitude: number, altitude: number, accuracy: number, altitudeAccuracy: number, heading: number, speed: number, timestamp: Date) {
            gpsProvider.setPos(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp);
        }


    }
}
var phoneGapProvider = new System.Providers.PhoneGapProvider();