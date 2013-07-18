/// <reference path="IUnitTest.ts" />
/// <reference path="../JS/App/_References.ts" />
module UnitTests {
    export class HttpDownloadProviderTest implements UnitTests.IUnitTest {
        public runTest(resultwindow: JQuery) {

            config.httpDownloadMaxSimultaneousDownloads = 3;

            var result: string = "";
            var result2: string = "";
            var resultL: string = "";
            // Set up download object
            var item1 = new System.Providers.HttpDownloadItem("1", "UnitTests.html",
            function (data: string) { result += "1"; result2 += "1"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var item2 = new System.Providers.HttpDownloadItem("2", "UnitTests.html",
            function (data: string) { result += "2"; result2 += "2"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var item3 = new System.Providers.HttpDownloadItem("3", "UnitTests.html",
            function (data: string) { result += "3"; result2 += "3"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var itemA = new System.Providers.HttpDownloadItem("A", "UnitTests.html",
            function (data: string) { result2 += "A"; resultL += "A"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var itemB = new System.Providers.HttpDownloadItem("B", "UnitTests.html",
            function (data: string) { result2 += "B"; resultL += "B"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var itemC = new System.Providers.HttpDownloadItem("C", "UnitTests.html",
            function (data: string) { result2 += "C"; resultL += "C"; },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });

            var itemEnd = new System.Providers.HttpDownloadItem("E1", "UnitTests.html",
            function (data: string) {
                setTimeout(function () {
                    var correct = "13231332";
                    if (result == correct) {
                        resultwindow.append("<div style='color:green'>HttpDownloadProvider: SeqQueue downloaded in correct order.</div>\r\n");
                    }
                    else {
                        resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: string should be \"" + correct + "\", is \"" + result + "\"</div>\r\n");
                    }
                }, 5000);
            },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });
            var itemEndL = new System.Providers.HttpDownloadItem("EL", "UnitTests.html",
            function (data: string) {
                setTimeout(function () {
                    var correct = "ABBBCC";
                    if (resultL == correct) {
                        resultwindow.append("<div style='color:green'>HttpDownloadProvider: DiffQueue downloaded in correct order.</div>\r\n");
                    }
                    else {
                        resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: string should be \"" + correct + "\", is \"" + resultL + "\"</div>\r\n");
                    }
                }, 5000);
            },
            function (message: string) { resultwindow.append("<div style='color:red'>HttpDownloadProvider: Error: " + message + "</div>\r\n"); },
            function () { });

            // Add to downloader
            httpDownloadProvider.paused = true;
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.Normal, item2);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.Normal, item2);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Normal, item2);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Normal, item3);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Normal, item1);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Normal, item3);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.Normal, itemB);
            httpDownloadProvider.enqueueItem("TestA", System.Providers.HttpDownloadQueuePriority.Normal, itemB);
            httpDownloadProvider.enqueueItem("TestB", System.Providers.HttpDownloadQueuePriority.Normal, itemB);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.Low, item3);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Low, item3);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Low, item2);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.Low, itemC);
            httpDownloadProvider.enqueueItem("TestA", System.Providers.HttpDownloadQueuePriority.Low, itemC);
            httpDownloadProvider.enqueueItem("TestC", System.Providers.HttpDownloadQueuePriority.Low, itemC);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.High, item1);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.High, item1);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.High, item3);
            httpDownloadProvider.enqueueItem("DELETED", System.Providers.HttpDownloadQueuePriority.High, itemA);
            httpDownloadProvider.enqueueItem("TestA", System.Providers.HttpDownloadQueuePriority.High, itemA);
            httpDownloadProvider.enqueueItem("TestA", System.Providers.HttpDownloadQueuePriority.High, itemB);

            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Low, itemEnd);
            httpDownloadProvider.enqueueItem("Test1", System.Providers.HttpDownloadQueuePriority.Low, itemEndL);

            httpDownloadProvider.clearQueue("DELETED");

            httpDownloadProvider.paused = false;
        }
    }
}