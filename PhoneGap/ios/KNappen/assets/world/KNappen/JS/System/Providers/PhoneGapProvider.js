var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var PhoneGapProvider = (function () {
            /**
            * PhoneGapProvider
            * @class System.Providers.PhoneGapProvider
            * @classdesc Provides PhoneGap communication services.
            */
            function PhoneGapProvider() {
                this.isPhoneGap = false;
                try  {
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
            PhoneGapProvider.prototype.SqlSetKey = function (table, key, value, meta) {
                var url = 'architectsdk://sql?action=set&table=' + encodeURIComponent(table) + '&key=' + encodeURIComponent(key) + '&value=' + encodeURIComponent(value) + "&meta=" + encodeURIComponent(meta);
                var d = document;
                d.location = url;
            };

            /**
            * Remove a key-value pair.
            * @method System.Providers.PhoneGapProvider#remove
            * @param {string} table Name of SQL table.
            * @param {string} key Key to remove.
            */
            PhoneGapProvider.prototype.SqlRemoveKey = function (table, key) {
                var url = 'architectsdk://sql?action=remove&table=' + encodeURIComponent(table) + '&key=' + encodeURIComponent(key);
                var d = document;
                d.location = url;
            };

            /**
            * Signal PhoneGap to read SQL table and set keys into storageProvider.
            * @method System.Providers.PhoneGapProvider#read
            * @param {string} table Name of SQL table.
            */
            PhoneGapProvider.prototype.SqlRead = function (table) {
                var url = 'architectsdk://sql?action=read&table=' + encodeURIComponent(table);
                var d = document;
                d.location = url;
            };

            PhoneGapProvider.prototype.SqlCallbackSet = function (key, value, metaStr) {
                storageProvider.setRaw(key, value);
                storageProvider.setRaw(key + ".meta", serializer.deserializeJSObject(metaStr));
            };

            /**
            * Open URL in system browser.
            * @method System.Providers.PhoneGapProvider#openUrl
            * @param {string} url URL to open
            */
            PhoneGapProvider.prototype.openUrl = function (url) {
                var d = document;
                d.location = this.fixUrl(url);
            };

            /**
            * Fix URL for opening
            * @method System.Providers.PhoneGapProvider#openUrl
            * @param {string} url URL to open
            */
            PhoneGapProvider.prototype.fixUrl = function (url) {
                return 'architectsdk://system?action=openUrl&url=' + encodeURIComponent(url);
            };

            // TODO: Move somewhere else?
            PhoneGapProvider.prototype.fixALinksIfPhoneGap = function (obj) {
                var _this = this;
                if (this.isPhoneGap) {
                    this.fixALinks(obj);
                } else {
                    $(obj).find('a').each(function () {
                        $(this).attr('target', "_blank");
                    });
                }
            };
            PhoneGapProvider.prototype.fixALinks = function (obj) {
                var _this = this;
                $(obj).find('a').each(function () {
                    var href = $(this).attr('href');
                    if (!stringUtils.startsWith(href, "architectsdk")) {
                        $(this).attr('href', _this.fixUrl(href));
                    }
                });
            };

            PhoneGapProvider.prototype.menuButton = function () {
                $('#mainPopupMenu').toggle();
            };

            PhoneGapProvider.prototype.backButton = function () {
                log.debug("PhoneGapPRovider", "Back-button pressed.");
                var result = viewController.goBack();

                if (!result) {
                    var url = 'architectsdk://sql?action=exit';
                    var d = document;
                    d.location = url;
                }
            };
            return PhoneGapProvider;
        })();
        Providers.PhoneGapProvider = PhoneGapProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var phoneGapProvider = new System.Providers.PhoneGapProvider();
//@ sourceMappingURL=PhoneGapProvider.js.map
