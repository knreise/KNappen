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
            sqlProvider.sqlSettingsSet(table, key, value, meta);
        }

        /**
          * Remove a key-value pair.
          * @method System.Providers.PhoneGapProvider#remove
          * @param {string} table Name of SQL table.
          * @param {string} key Key to remove.
          */
        public SqlRemoveKey(table: string, key: string) {
            sqlProvider.sqlSettingsRemove(table, key);
        }

        /**
          * Signal PhoneGap to read SQL table and set keys into storageProvider.
          * @method System.Providers.PhoneGapProvider#read
          * @param {string} table Name of SQL table.
          */
        public SqlRead(table: string, finishedCallback?: () => void) {
            sqlProvider.sqlSettingsRead(table, finishedCallback);
        }

        /**
          * Callback used by PhoneGap to set SQL read key.
          * @method System.Providers.PhoneGapProvider#SqlCallbackSet
          * @param {string} key Key to set
          * @param {string} value Value to set
          * @param {string} metaStr Serialized metaobject to set
          */
        public SqlCallbackSet(key: string, value: string, metaStr: string) {
            try {
                log.debug("PhoneGapProvider", "SqlCallbackSet: Key: " + key);
                storageProvider.setRaw(key, value);

                var deserializedObject = serializer.deserializeJSObject(metaStr);
                storageProvider.setRaw(key + ".meta", deserializedObject);
            } catch (exception) {
                log.error("PhoneGapProvider", "SqlCallbackSet: an exception was thrown: " + exception);
            }
        }

        /**
          * Open URL in system browser.
          * @method System.Providers.PhoneGapProvider#openUrl
          * @param {string} url URL to open
          */
        public openUrl(url: string) {
            window.open(url, '_system');
        }

        // TODO: Move somewhere else?
        public fixALinksIfPhoneGap(obj: JQuery) {
            $(obj).find('a').each(function () {
                $(this).attr('target', "_blank");
            });
        }

        /**
          * Signal PhoneGap to exit application
          * @method System.Providers.PhoneGapProvider#sendExit
          */
        public sendExit() {
            try {
                phoneGapInterop.onExitApp();
            } catch (exception) { }
            try {
                navigator.app.exitApp();
            } catch (exception) { }
        }

        /**
          * Callback from PhoneGap that menu button was clicked
          * @method System.Providers.PhoneGapProvider#callbackMenuButton
          */
        public callbackMenuButton() {
            viewController.selectView("mainMenu");
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

        public playVideo(url: string) {
            window.plugins.videoPlayer.play(url);
        }

    }
}
var phoneGapProvider = new System.Providers.PhoneGapProvider();