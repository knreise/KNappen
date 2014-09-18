/// <reference path="../_References.ts" />
/**
    Distance calculating
    @namespace System.Utils
*/

module System.Utils{
    
    export class DistanceTool {

        constructor() {

        }

        public GetDistanceFromLatLon(poiLatlon: System.Models.Position, currentLatLon: System.Models.Position): number {

            var _this = this;

            var R = 6371;
            var dLat = _this.deg2rad(poiLatlon.lat() - currentLatLon.lat());
            var dLon = _this.deg2rad(poiLatlon.lon() - currentLatLon.lon());

            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(_this.deg2rad(poiLatlon.lat())) * Math.cos(_this.deg2rad(currentLatLon.lat())) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = R * c; //distance in km

            return distance;
        }
    
        private deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
    }
}

var distanceTool = new System.Utils.DistanceTool();