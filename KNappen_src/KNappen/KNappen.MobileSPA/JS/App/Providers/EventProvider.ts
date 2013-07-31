/// <reference path="../_References.ts" />
module App.Providers {

    export class EventProvider_Settings {
        public onPreLoad = new System.Utils.Event("Settings.PreLoad");
        public onPostLoad = new System.Utils.Event("Settings.PostLoad");
        public onPreSave = new System.Utils.Event("Settings.PreSave");
        public onPostSave = new System.Utils.Event("Settings.PostSave");
    }

    export class EventProvider {
        public settings = new App.Providers.EventProvider_Settings();
    }
}
var eventProvider = new App.Providers.EventProvider();