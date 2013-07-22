/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var AR: any;
    export class PhoneGapProvider {

        public isPhoneGap: bool = false;

        /**
          * PhoneGapProvider
          * @class System.Providers.PhoneGapProvider
          * @classdesc Provides PhoneGap communication services.
          */
        constructor() {
            try {
                if (AR)
                    this.isPhoneGap = true;
            } catch (exception) {
            }

        }

        /**
          * Store a key-value pair.
          * @method System.Providers.PhoneGapProvider#set
          * @param {string} table Name of SQL table.
          * @param {string} key Key to use for storage.
          * @param {string} value Value to store.
          */
        public SqlSetKey(table: string, key: string, value: string, meta: string) {
            var url = 'architectsdk://sql?action=set&table=' + encodeURIComponent(table) + '&key=' + encodeURIComponent(key) + '&value=' + encodeURIComponent(value) + "&meta=" + encodeURIComponent(meta);
            var d: any = document;
            d.location = url;
        }
        /**
          * Remove a key-value pair.
          * @method System.Providers.PhoneGapProvider#remove
          * @param {string} table Name of SQL table.
          * @param {string} key Key to remove.
          */
        public SqlRemoveKey(table: string, key: string) {
            var url = 'architectsdk://sql?action=remove&table=' + encodeURIComponent(table) + '&key=' + encodeURIComponent(key);
            var d: any = document;
            d.location = url;
        }
        /**
          * Signal PhoneGap to read SQL table and set keys into storageProvider.
          * @method System.Providers.PhoneGapProvider#read
          * @param {string} table Name of SQL table.
          */
        public SqlRead(table: string) {
            var url = 'architectsdk://sql?action=read&table=' + encodeURIComponent(table);
            var d: any = document;
            d.location = url;
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
            if (this.isPhoneGap) {
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

        public menuButton() {
            $('#mainPopupMenu').toggle();
        }

        public backButton() {
            log.debug("PhoneGapPRovider", "Back-button pressed.");
            var result = viewController.goBack();

            if (!result) {
                var url = 'architectsdk://sql?action=exit';
                var d: any = document;
                d.location = url;
            }

        }

        public fixLocalFileRef(file: string): string {
            if (navigator.userAgent.match(/(Android)/)) {
                return "file:///android_asset/world/KNappen/" + file;
            } else {
                return file;
            }
        }
    }
}
var phoneGapProvider = new System.Providers.PhoneGapProvider();