/// <reference path="../_References.ts" />
/**
    Controller modules
    @namespace App.Controllers
*/
module App.Controllers {
    declare var soundManager;
    export class AudioController {

        public soundProvider: System.Providers.AudioProvider;

        /**
            AudioController
            @class App.Controllers.AudioController
            @classdesc This class plays audio and shows/hides audio bar.
        */
        constructor() {
        }

        public Init() {
            this.soundProvider = new System.Providers.AudioProvider();
            var _this = this;
            $("#audioButtonPause").mousedown(function () { _this.pause(); });
            $("#audioButtonStop").mousedown(function () { _this.stop(); });
        }


        /**
            Play audio file
            @method App.Controllers.AudioController#play
            @param {string} title Title to display
            @param {string} file URL of file to play
            @public
        */
        public play(title: string, file: string) {
            var _this = this;
            $("#audioTitle").html(title);

            // $("#footerSection").show();
            windowSizeController.ShowFooter(true);
            var audioStatusDiv = $("#audioStatusDiv");
            var poiAudioBar = $("#poiAudioBar");
            poiAudioBar.show();
            var audioButtonPlay = $("#audioButtonPlay");
            this.buttonDisable(audioButtonPlay);
            audioButtonPlay.mousedown(function () { _this.play(title, file); });

            this.soundProvider.play(file,
                function onFinishCallback() {
                    // Done playing
                    _this.buttonEnable(audioButtonPlay);
                },
                function onWhileLoading(bytesLoaded: number, bytesTotal: number) {
                    if (bytesTotal && bytesLoaded)
                        audioStatusDiv.html(tr.translate("Loading") + ": " + parseInt(<any>((bytesTotal / bytesLoaded) * 100)) + "%");
                    else
                        audioStatusDiv.html('');
                },
                function onDoneLoading() {
                    audioStatusDiv.html('');
                },
                function onWhilePlaying(position: number) {
                    var duration = moment.duration(position, 'milliseconds');
                    //audioStatusDiv.html(duration.hours() + ':' + duration.minutes() + ":" + duration.seconds());
                    audioStatusDiv.html(moment(duration.asMilliseconds()).format('mm:ss'));
                },
                function onBufferingChanged(isBuffering: bool) {
                    if (isBuffering) {
                        audioStatusDiv.html(tr.translate("Buffering..."));
                    } else {
                        audioStatusDiv.html('');
                    }
                });
        }

        private buttonDisable(button: JQuery) {
            button.attr('disabled', 'disabled').css("color", "#cccccc");
        }

        private buttonEnable(button: JQuery) {
            button.removeAttr('disabled').css("color", '');
        }

        /**
            Stop playing audio file
            @method App.Controllers.AudioController#stop
            @public
        */
        public stop() {
            //   $("#footerSection").hide();
            var poiAudioBar = $("#poiAudioBar");
            poiAudioBar.hide();
            windowSizeController.ShowFooter(false);
            this.soundProvider.stop();
        }

        /**
            Toggle pause playing audio file
            @method App.Controllers.AudioController#stop
            @public
        */
        public pause() {
            this.soundProvider.pause();
        }
    
    }
}
var audioController = new App.Controllers.AudioController();
startup.addInit(function () { audioController.Init(); }, "SoundManager");