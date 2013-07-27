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
            }
            /**
            * Store a key-value pair.
            * @method System.Providers.PhoneGapProvider#set
            * @param {string} table Name of SQL table.
            * @param {string} key Key to use for storage.
            * @param {string} value Value to store.
            */
            PhoneGapProvider.prototype.SqlSetKey = function (table, key, value, meta) {
                this.sendPhoneGapCommand("sql", "remove", {
                    "table": table,
                    "key": key,
                    "value": value,
                    "meta": meta
                });
            };

            /**
            * Remove a key-value pair.
            * @method System.Providers.PhoneGapProvider#remove
            * @param {string} table Name of SQL table.
            * @param {string} key Key to remove.
            */
            PhoneGapProvider.prototype.SqlRemoveKey = function (table, key) {
                this.sendPhoneGapCommand("sql", "remove", {
                    "table": table,
                    "key": key
                });
            };

            /**
            * Signal PhoneGap to read SQL table and set keys into storageProvider.
            * @method System.Providers.PhoneGapProvider#read
            * @param {string} table Name of SQL table.
            */
            PhoneGapProvider.prototype.SqlRead = function (table) {
                this.sendPhoneGapCommand("sql", "read", {
                    "table": table
                });
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
                if (compatibilityInfo.isPhoneGap) {
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

            PhoneGapProvider.prototype.sendExit = function () {
                this.sendPhoneGapCommand("system", "exit");
            };

            PhoneGapProvider.prototype.sendPhoneGapCommand = function (target, action, params) {
                var url = 'architectsdk://' + target + '?action=' + encodeURIComponent(action);
                if (params) {
                    $.each(params, function (k, v) {
                        if (k) {
                            url += "&" + encodeURIComponent(k);
                            if (v)
                                url += "=" + encodeURIComponent(v);
                        }
                    });
                }

                log.debug("PhoneGapProvider", "Sending command type \"" + target + "\" action \"" + action + "\" to PhoneGap: " + url);

                var d = document;
                d.location = url;
            };

            PhoneGapProvider.prototype.callbackMenuButton = function () {
                $('#mainPopupMenu').toggle();
            };

            PhoneGapProvider.prototype.callbackBackButton = function () {
                log.debug("PhoneGapProvider", "Back button pressed. Navigating back.");
                var result = viewController.goBack();

                if (!result) {
                    log.debug("PhoneGapProvider", "No more navigation history - exiting app.");
                    this.sendExit();
                }
            };

            PhoneGapProvider.prototype.callbackSqlReadSuccess = function () {
                log.debug("PhoneGapProvider", "PhoneGapInterop reports success on SQL read.");
                startup.shortcutLoadTimeout();
            };

            PhoneGapProvider.prototype.callbackSqlReadError = function (errorCode, errorMessage) {
                log.debug("PhoneGapProvider", "PhoneGapInterop reports error on SQL read: Code: " + errorCode + ", message: " + errorMessage);
                startup.shortcutLoadTimeout();
            };

            PhoneGapProvider.prototype.callbackGeoLocationUpdate = function (latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp) {
                gpsProvider.setPos(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp);
            };
            return PhoneGapProvider;
        })();
        Providers.PhoneGapProvider = PhoneGapProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var phoneGapProvider = new System.Providers.PhoneGapProvider();
//@ sourceMappingURL=PhoneGapProvider.js.map
