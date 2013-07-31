/// <reference path="../_References.ts" />
/**
    Providers
    @namespace App.Providers
*/
module App.Providers {

    export class EventProvider_Settings {

        /**
            EventProvider_Settings
            @class App.Providers.EventProvider_Settings
            @classdesc Provides Settings events
        */
        constructor() {
        }

        public onPreLoad = new System.Utils.Event("Settings.PreLoad");
        public onPostLoad = new System.Utils.Event("Settings.PostLoad");
        public onPreSave = new System.Utils.Event("Settings.PreSave");
        public onPostSave = new System.Utils.Event("Settings.PostSave");
    }

    /**
        EventProvider
        @class App.Providers.EventProvider
        @classdesc Provides events for classes that can't host them by themselves for various reasons.
    */
    export class EventProvider {
        public settings = new App.Providers.EventProvider_Settings();
    }
}
var eventProvider = new App.Providers.EventProvider();