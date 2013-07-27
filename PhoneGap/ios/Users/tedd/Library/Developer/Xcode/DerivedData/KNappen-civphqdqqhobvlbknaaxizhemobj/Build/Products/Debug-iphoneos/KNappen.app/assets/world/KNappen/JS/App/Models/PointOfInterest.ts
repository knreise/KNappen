/// <reference path="../../../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../_References.ts" />

/**
    Model modules
    @namespace App.Models
*/
module App.Models
{

    export interface KnockoutObservablePointOfInterestArray extends KnockoutObservableArray {
        (): App.Models.PointOfInterest[];
        (value: App.Models.PointOfInterest[]): void;

        subscribe(callback: (newValue: App.Models.PointOfInterest[]) => void , target?: any, topic?: string): KnockoutSubscription;
        notifySubscribers(valueToWrite: App.Models.PointOfInterest[], topic?: string);
    }

   
    export class PointOfInterest extends System.Models.PointOfInterestBase {

        public name: KnockoutObservableString = ko.observable("");
        public description: KnockoutObservableString = ko.observable("");
        public link: KnockoutObservableString = ko.observable("");
        public thumbnail: KnockoutObservableString = ko.observable("");
        public year: KnockoutObservableString = ko.observable("");
        public landingPage: KnockoutObservableString = ko.observable("");
        public license: KnockoutObservableString = ko.observable("");
        public categories: KnockoutObservableArray = ko.observableArray([]);
        public ingress: KnockoutObservableString = ko.observable("");
        public body: KnockoutObservableString = ko.observable("");
        public creator: KnockoutObservableString = ko.observable("");
        public institution: KnockoutObservableString = ko.observable("");
        public owner: KnockoutObservableString = ko.observable("");
        public tags: KnockoutObservableString = ko.observable("");
        public linkMoreInfo: KnockoutObservableString = ko.observable("");
        public mediaTypes: KnockoutObservableArray = ko.observableArray([]);
        public soundUri: KnockoutObservableString = ko.observable("");
        public videoUri: KnockoutObservableString = ko.observable("");
        public originalVersion: KnockoutObservableString = ko.observable("");
    }
}