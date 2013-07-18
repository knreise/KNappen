/// <reference path="HttpDownloadProviderTest.ts" />
/// <reference path="../JS/App/_References.ts" />
/// <reference path="DataSourceNorvegianaTest.ts" />
/// <reference path="IUnitTest.ts" />
module UnitTests
{
    export class UnitTest
    {
        public run()
        {
            //this.test(new UnitTests.DataSourceNorvegianaTest());
            this.test(new UnitTests.HttpDownloadProviderTest());
        }

        private test(c: IUnitTest)
        {
            try {
                c.runTest($("#result"));
            } catch (exception) {
                $("#result").append("<div style='color:orange'>Exception running test: " + exception + "</div>\r\n");
            }
        }
    }
}
