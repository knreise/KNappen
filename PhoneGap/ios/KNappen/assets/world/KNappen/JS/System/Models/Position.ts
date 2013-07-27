/// <reference path="../_References.ts" />
/**
    Models
    @namespace System.Models
*/
module System.Models {

    export interface KnockoutObservablePosition extends KnockoutObservableBase {
        lat: KnockoutObservableNumber;
        lon: KnockoutObservableNumber;
        alt: KnockoutObservableNumber;
        acc: KnockoutObservableNumber;

        toString(): string;

        (): System.Models.Position;
        (value: System.Models.Position): void;

        subscribe(callback: (newValue: System.Models.Position) => void , target?: any, topic?: string): KnockoutSubscription;
        notifySubscribers(valueToWrite: System.Models.Position, topic?: string);
    }

    export class Position {

        public lat: KnockoutObservableNumber;
        public lon: KnockoutObservableNumber;
        public alt: KnockoutObservableNumber;
        public acc: KnockoutObservableNumber;

        public altitudeAccuracy: KnockoutObservableNumber;
        public heading: KnockoutObservableNumber;
        public speed: KnockoutObservableNumber;
        public timestamp: KnockoutObservableDate;

        /** 
            Position
            @class System.Models.Position
            @classdesc Creates an instance of a position object
            @property {number} Latitude.
            @property {number} Longditude.
            @property {number} Altitude.
            @property {number} Accelleration.
          */
        constructor(lat: number, lon: number, alt?: number, acc?: number, altitudeAccuracy?: number, heading?: number, speed?: number, timestamp?: Date) {
            this.lat = ko.observable(lat);
            this.lon = ko.observable(lon);
            this.alt = ko.observable(alt);
            this.acc = ko.observable(acc);

            this.altitudeAccuracy = ko.observable();
            this.heading = ko.observable();
            this.speed = ko.observable();
            this.timestamp = ko.observable();
        }

        public toString(): string {
            return "lat: " + (this.lat() || "NA")
                + ", lon: " + (this.lon() || "NA")
                + ", alt: " + (this.alt() || "NA")
                + ", acc: " + (this.acc() || "NA");
        }
    }
}