var PhoneGap;
(function (PhoneGap) {
    /// <reference path="../_References.ts" />
    (function (InteropProviders) {
        var SystemCommandProvider = (function () {
            function SystemCommandProvider() {
            }
            SystemCommandProvider.prototype.Init = function () {
                log.debug("SystemCommandProvider", "Init()");
                var _this = this;
                phoneGapInterop.onInteropCommand.addHandler(function (target, action, params) {
                    _this.processInteropCommand(target, action, params);
                }, "SystemCommandProvider");
            };

            SystemCommandProvider.prototype.processInteropCommand = function (target, action, params) {
                if (target.toLowerCase() === "system") {
                    if (action === "exit") {
                        log.info("SystemCommandProvider", "exit");
                        try  {
                            phoneGapInterop.onExitApp();
                        } catch (exception) {
                        }
                        try  {
                            navigator.app.exitApp();
                        } catch (exception) {
                        }
                    }

                    if (action == "openUrl") {
                        var url = params["url"];
                        log.info("SystemCommandProvider", "openUrl: " + url);
                        var ref = window.open(url, '_system');
                    }
                }
            };
            return SystemCommandProvider;
        })();
        InteropProviders.SystemCommandProvider = SystemCommandProvider;
    })(PhoneGap.InteropProviders || (PhoneGap.InteropProviders = {}));
    var InteropProviders = PhoneGap.InteropProviders;
})(PhoneGap || (PhoneGap = {}));
var systemCommandProvider = new PhoneGap.InteropProviders.SystemCommandProvider();
startup.addInit(function () {
    systemCommandProvider.Init();
}, "SystemCommandProvider");
//@ sourceMappingURL=SystemCommandProvider.js.map
