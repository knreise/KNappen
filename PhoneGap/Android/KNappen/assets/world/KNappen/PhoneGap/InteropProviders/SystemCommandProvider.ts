/// <reference path="../_References.ts" />
module PhoneGap.InteropProviders {
    declare var navigator;
    export class SystemCommandProvider {

        public Init() {
            log.debug("SystemCommandProvider", "Init()");
            var _this = this;
            phoneGapInterop.onInteropCommand.addHandler(function (target: string, action: string, params: any[]) {
                _this.processInteropCommand(target, action, params);
            }, "SystemCommandProvider");
        }

        private processInteropCommand(target: string, action: string, params: any[]) {
            if (target.toLowerCase() === "system")
            {
                if (action === "exit") {
                    log.info("SystemCommandProvider", "exit");
                    try {
                        phoneGapInterop.onExitApp();
                    } catch (exception) { }
                    try {
                        navigator.app.exitApp();
                    } catch (exception) { }
                }

                if (action == "openUrl")
                {
                    var url = params["url"];
                    log.info("SystemCommandProvider", "openUrl: " + url);
                    var ref = window.open(url, '_system');
                }
            }

        }
    }
}
var systemCommandProvider = new PhoneGap.InteropProviders.SystemCommandProvider();
startup.addInit(function () { systemCommandProvider.Init(); }, "SystemCommandProvider");