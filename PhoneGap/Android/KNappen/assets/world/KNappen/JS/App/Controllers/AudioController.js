var App;
(function (App) {
    /// <reference path="../_References.ts" />
    (function (Controllers) {
        var AudioController = (function () {
            function AudioController() {
            }
            AudioController.prototype.Init = function () {
                this.soundProvider = new System.Providers.AudioProvider();
                var _this = this;
                $("#audioButtonPause").mousedown(function () {
                    _this.pause();
                });
                $("#audioButtonStop").mousedown(function () {
                    _this.stop();
                });
            };

            AudioController.prototype.play = function (title, file) {
                var _this = this;
                $("#audioTitle").html(title);

                // $("#footerSection").show();
                var audioStatusDiv = $("#audioStatusDiv");
                var poiAudioBar = $("#poiAudioBar");
                poiAudioBar.show();
                var audioButtonPlay = $("#audioButtonPlay");
                this.buttonDisable(audioButtonPlay);
                audioButtonPlay.mousedown(function () {
                    _this.play(title, file);
                });

                this.soundProvider.play(file, function onFinishCallback() {
                    // Done playing
                    _this.buttonEnable(audioButtonPlay);
                }, function onWhileLoading(bytesLoaded, bytesTotal) {
                    if (bytesTotal && bytesLoaded)
                        audioStatusDiv.html(tr.translate("Loading") + ": " + parseInt(((bytesTotal / bytesLoaded) * 100)) + "%"); else
                        audioStatusDiv.html('');
                }, function onDoneLoading() {
                    audioStatusDiv.html('');
                }, function onWhilePlaying(position) {
                    var duration = moment.duration(position, 'milliseconds');

                    //audioStatusDiv.html(duration.hours() + ':' + duration.minutes() + ":" + duration.seconds());
                    audioStatusDiv.html(moment(duration.asMilliseconds()).format('mm:ss'));
                }, function onBufferingChanged(isBuffering) {
                    if (isBuffering) {
                        audioStatusDiv.html(tr.translate("Buffering..."));
                    } else {
                        audioStatusDiv.html('');
                    }
                });
            };

            AudioController.prototype.buttonDisable = function (button) {
                button.attr('disabled', 'disabled').css("color", "#cccccc");
            };

            AudioController.prototype.buttonEnable = function (button) {
                button.removeAttr('disabled').css("color", '');
            };

            AudioController.prototype.stop = function () {
                //   $("#footerSection").hide();
                var poiAudioBar = $("#poiAudioBar");
                poiAudioBar.hide();
                this.soundProvider.stop();
            };

            AudioController.prototype.pause = function () {
                this.soundProvider.pause();
            };
            return AudioController;
        })();
        Controllers.AudioController = AudioController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
var audioController = new App.Controllers.AudioController();
startup.addInit(function () {
    audioController.Init();
}, "SoundManager");
//@ sourceMappingURL=AudioController.js.map
