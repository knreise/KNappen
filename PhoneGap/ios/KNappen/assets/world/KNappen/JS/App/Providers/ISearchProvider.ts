/// <reference path="../_References.ts" />
module App.Providers {
    
    export interface ISearchProvider {
        search(searchCriteria: App.Models.SearchCriteria, successCallback: { (searchResult: App.Models.SearchResult): void; }, errorCallback: { (errorMessage: string): void; });
    }
}