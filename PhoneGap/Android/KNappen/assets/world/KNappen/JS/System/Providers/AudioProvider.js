var System;
(function (System) {
    /// <reference path="../_References.ts" />
    (function (Providers) {
        var AudioProvider = (function () {
            function AudioProvider() {
                log.debug("AudioProvider", "constructor()");
                soundManager.setup({
                    url: 'Content/swf/',
                    //flashVersion: 9, // optional: shiny features (default = 8)
                    // optional: ignore Flash where possible, use 100% HTML5 mode
                    preferFlash: false,
                    debugMode: true,
                    onready: function () {
                        // Ready to use; soundManager.createSound() etc. can now be called.
                        log.debug("SoundProvider", "Ready to play souynds.");
                    }
                });

                soundManager.ontimeout(function () {
                });
            }
            AudioProvider.prototype.play = function (file, onFinishCallback, onWhileLoading, onDoneLoading, onWhilePlaying, onBufferingChanged) {
                log.debug("AudioProvider", "play: " + file);
                this.stop();

                this.currentSound = soundManager.createSound({
                    url: file,
                    autoPlay: false,
                    onfinish: onFinishCallback,
                    whileplaying: function () {
                        onWhilePlaying(this.position);
                    },
                    whileloading: function () {
                        onWhileLoading(this.bytesLoaded, this.bytesTotal);
                    },
                    onbufferchange: function () {
                        onBufferingChanged(this.isBuffering);
                    },
                    onload: onDoneLoading
                });
                this.currentSound.play();
            };

            AudioProvider.prototype.pause = function () {
                log.debug("AudioProvider", "pause()");
                if (this.currentSound) {
                    this.currentSound.togglePause();
                }
            };

            AudioProvider.prototype.stop = function () {
                log.debug("AudioProvider", "stop()");
                if (this.currentSound) {
                    this.currentSound.stop();
                    this.currentSound.destruct();
                }
            };

            AudioProvider.prototype.toggleMute = function () {
                this.currentSound.toggleMute();
            };
            return AudioProvider;
        })();
        Providers.AudioProvider = AudioProvider;
    })(System.Providers || (System.Providers = {}));
    var Providers = System.Providers;
})(System || (System = {}));
//@ sourceMappingURL=AudioProvider.js.map
