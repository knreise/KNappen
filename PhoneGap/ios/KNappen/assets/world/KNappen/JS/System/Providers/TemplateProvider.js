var System;
(function (System) {
    /// <reference path="../_References.ts" />
    /**
    System provider modules
    @namespace System.Providers
    */
    (function (Providers) {
        var TemplateProvider = (function () {
            function TemplateProvider() {
                this.templates = {};
            }
            TemplateProvider.prototype.queueTemplateDownload = function (name, doneCallback, failCallback, alwaysCallback) {
                if (typeof doneCallback === "undefined") { doneCallback = null; }
                if (typeof failCallback === "undefined") { failCallback = null; }
                if (typeof alwaysCallback === "undefined") { alwaysCallback = null; }
                log.debug("TemplateProvider", "Queued template for download: " + name);
                var _this = this;
                if (!stringUtils.endsWith(config.TemplateProviderFolder, "/") && !stringUtils.startsWith(name, "/"))
                    name = "/" + name;
                var fullName = config.TemplateProviderFolder + name;
                var item = new System.Providers.HttpDownloadItem(name, fullName, function _doneCallback(data) {
                    log.debug("TemplateProvider", "Success downloading template " + name);
                    _this.setTemplate(name, data);
                    if (doneCallback)
                        doneCallback(data);
                }, function _failCallback(message) {
                    log.error("TemplateProvider", "Error downloading template " + name + " (" + fullName + "): " + message);
                    if (failCallback)
                        failCallback(message);
                }, function _alwaysCallback() {
                    if (alwaysCallback)
                        alwaysCallback();
                }, "html");
                httpDownloadProvider.enqueueItem("Templates", System.Providers.HttpDownloadQueuePriority.High, item);
            };

            TemplateProvider.prototype.setTemplate = function (name, content) {
                log.debug("TemplateProvider", "Setting template: " + name);
                this.templates[name.toUpperCase()] = content;
            };

            TemplateProvider.prototype.getTemplate = function (name, replacement) {
                if (typeof replacement === "undefined") { replacement = null; }
                var ret = this.templates[name.toUpperCase()];
                if (!ret) {
                    log.error("TemplateProvider", "Template " + name + " does not exist.");
                    return "";
                }

                ret = translater.translateSubString(ret);

                if (replacement) {
                    ret = ret.replace(/\$\[([^\]]+)\]/gm, function (fullMatch, match, offset) {
                        var r = replacement[match];

                        if (typeof r === "function")
                            r = (r)();
                        return r;
                    });
                    ret = ret.replace(/\$IF(\(\![\s\S]*?)\$ENDIF/gm, function (fullMatch, match, offset) {
                        var v = match.replace(/^\(\!([^\)]+)\)[\s\S]*/gm, "$1");
                        var r = replacement[v];

                        if (typeof r === "function")
                            r = (r)();
                        if (!r)
                            return match.replace(/^\([^\)]+\)([\s\S]*)/gm, "$1");
                        return "";
                    });
                    ret = ret.replace(/\$IF(\([\s\S]*?)\$ENDIF/gm, function (fullMatch, match, offset) {
                        var v = match.replace(/^\(([^\)]+)\)[\s\S]*/gm, "$1");
                        var r = replacement[v];

                        if (typeof r === "function")
                            r = (r)();
                        if (r)
                            return match.replace(/^\([^\)]+\)([\s\S]*)/gm, "$1");
                        return "";
                    });
                }
                log.debug("TemplateProvider", "Returning template: " + name);

                return ret;
            };

            TemplateProvider.prototype.getReplacementKeys = function (obj) {
                // Create replacement keys by copying POI into them first
                var keys = {};
                $.each(obj, function (k, v) {
                    keys[k] = v;
                });

                // Then copy in config, just in case. Prefix with "config."
                $.each(config, function (k, v) {
                    keys["config." + k] = v;
                });
                return keys;
            };
            return TemplateProvider;
        })();
        Providers.TemplateProvider = TemplateProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
var templateProvider = new System.Providers.TemplateProvider();
startup.addPostInit(function () {
});
//@ sourceMappingURL=TemplateProvider.js.map
