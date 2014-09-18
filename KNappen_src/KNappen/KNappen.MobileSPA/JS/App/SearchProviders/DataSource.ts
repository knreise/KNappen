/// <reference path="../_References.ts" />

/**
    Providers
    @namespace App.SearchProviders
*/
module App.SearchProviders {

    export class DataSource {

        private pageSize: number;

        private hasResultCount: boolean = false;
        private resultCount: number = 0;
        private results: Array<App.Models.PointOfInterest> = new Array<App.Models.PointOfInterest>();

        private successCallback: App.Providers.SearchSuccessCallback;
        private errorCallback: App.Providers.SearchErrorCallback;

        constructor(pageSize: number, successCallback: App.Providers.SearchSuccessCallback, errorCallback: App.Providers.SearchErrorCallback) {
            this.pageSize = pageSize;
            this.successCallback = successCallback;
            this.errorCallback = errorCallback;
        }

        public addPoi(poi: App.Models.PointOfInterest): void {
            this.results.push(poi);
        }

        public searchNotNeeded(searchedPois: number): boolean {
            return this.results.length >= this.pageSize || (this.hasResultCount && (searchedPois >= this.resultCount));
        }

        public setResultCount(resultCount: number): void {
            if (!this.hasResultCount) {
                this.resultCount = resultCount;
                this.hasResultCount = true;
            }
        }

        public getResultCount(): number {
            return this.resultCount;
        }

        public getNextPoi(poiChooser: App.Providers.PoiChooser): void {

            if (this.results.length == 0) {
                return;
            }

            var poi = this.results[0];
            var otherPoi = poiChooser.poi;

            if (otherPoi == null || poi.distance() < otherPoi.distance()) {
                poiChooser.poi = poi;
                poiChooser.choose = () => this.results.shift();
            }
        }

        public raiseSuccess(searchHandle: App.Providers.SearchHandle): void {
            this.successCallback(searchHandle);
        }

        public raiseError(errorMessage: string, searchHandle: App.Providers.SearchHandle): void {
            this.errorCallback(errorMessage, searchHandle);
        }
    }
}

