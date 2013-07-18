/// <reference path="../_References.ts" />
module App.Controllers {
    declare var soundManager;
    export class AudioController {

        public soundProvider: System.Providers.AudioProvider;

        constructor() {
        }

        public Init() {
            this.soundProvider = new System.Providers.AudioProvider();
            var _this = this;
            $("#audioButtonPause").mousedown(function () { _this.pause(); });
            $("#audioButtonStop").mousedown(function () { _this.stop(); });
        }

        public play(title: string, file: string) {
            var _this = this;
            $("#audioTitle").html(title);

           // $("#footerSection").show();
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

        public stop() {
         //   $("#footerSection").hide();
            var poiAudioBar = $("#poiAudioBar");
            poiAudioBar.hide();
            this.soundProvider.stop();
        }

        public pause() {
            this.soundProvider.pause();
        }        
        
    }
}
var audioController = new App.Controllers.AudioController();
startup.addInit(function () { audioController.Init(); }, "SoundManager");