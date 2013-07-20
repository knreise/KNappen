/// <reference path="../_References.ts" />
/**
    System provider modules
    @namespace System.Providers
*/
module System.Providers {
    declare var config: System.ConfigBase;
    export class TemplateProvider {
        private templates: { [key: string]: string; } = {};

        public queueTemplateDownload(name: string, doneCallback: { (data: string): void; } = null, failCallback: { (message: string): void; } = null, alwaysCallback: { (): void; } = null) {
            log.debug("TemplateProvider", "Queued template for download: " + name);
            var _this = this;
            var item = new System.Providers.HttpDownloadItem(name,
                config.TemplateProviderFolder + "/" + name,
                function _doneCallback(data: string) {
                    log.debug("TemplateProvider", "Success downloading template " + name);
                    _this.setTemplate(name, data);
                    if (doneCallback)
                        doneCallback(data);
                },
                function _failCallback(message: string) {
                    log.error("TemplateProvider", "Error downloading template " + name + ": " + message);
                    if (failCallback)
                        failCallback(message);
                },
                function _alwaysCallback() {
                    if (alwaysCallback)
                        alwaysCallback();
                },
                "html");
            httpDownloadProvider.enqueueItem("Templates", System.Providers.HttpDownloadQueuePriority.High, item);
        }

        public setTemplate(name: string, content: string) {
            log.debug("TemplateProvider", "Setting template: " + name);
            this.templates[name.toUpperCase()] = content;
        }

        public getTemplate(name: string, replacement: { [name: string]: string; } = null): string {
            var ret: string = this.templates[name.toUpperCase()];
            if (!ret)
            {
                log.error("TemplateProvider", "Template " + name + " does not exist.");
                return "";
            }

            ret = translater.translateSubString(ret);

            if (replacement) {
                ret = ret.replace(/\$E\[([^\]]+)\]/gm, function (fullMatch, match, offset) {
                    return replacement[match];
                });
            }
            log.debug("TemplateProvider", "Returning template: " + name);

            return ret;
        }
    }
}
var templateProvider = new System.Providers.TemplateProvider();
startup.addPostInit(function () {
    templateProvider.queueTemplateDownload("TestTemplate.html");
    //var keys: { [name: string]: string; } = {};
    //keys["Key1"] = "ReplacementKey1";
    //keys["Key2"] = "ReplacementKey2";
    //setTimeout(function () {
    //    var str = templateProvider.getTemplate("TestTemplate.html", keys);
    //}, 5000);
});
