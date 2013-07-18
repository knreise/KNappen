/// <reference path="IUnitTest.ts" />
/// <reference path="../JS/App/_References.ts" />
module UnitTests
{
    export class DataSourceNorvegianaTest implements UnitTests.IUnitTest
    {
        
        public runTest(resultwindow: JQuery)
        {
            var dataSource = new App.SearchProviders.DataSourceNorvegiana();
            var searchCriteria = new App.Models.SearchCriteria();

            dataSource.search(searchCriteria,
                function (searchResult: App.Models.SearchResult)
                {
                    if (searchResult.numFound() > 4000000)
                        resultwindow.append("<div style='color:green'>DataSourceNorvegiana items: " + searchResult.numFound() + "</div>\r\n");
                    else
                        resultwindow.append("<div style='color:red'>DataSourceNorvegiana items: " + searchResult.numFound() + "</div>\r\n");
                },
                function (errorMessage: string)
                {
                    resultwindow.append("<div style='color:red'>DataSourceNorvegiana items: " + errorMessage + "</div>\r\n");
                }
            );
        }
    }
}