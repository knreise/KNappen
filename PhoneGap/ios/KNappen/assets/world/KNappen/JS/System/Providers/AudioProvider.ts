/// <reference path="../_References.ts" />
module System.Providers {
    declare var soundManager;
    export class AudioProvider {

        private currentSound: any;

        constructor() {
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
                // SM2 could not start. Flash blocked, missing or security error? Complain, etc.?
            });
        }

        public play(file: string, onFinishCallback: { (): void; }, onWhileLoading: { (bytesLoaded: number, bytesTotal: number): void; }, onDoneLoading: { (): void; }, onWhilePlaying: { (position: number): void; }, onBufferingChanged: { (isBuffering: bool): void; }) {
            log.debug("AudioProvider", "play: " + file);
                this.stop();

            this.currentSound = soundManager.createSound({
                url: file,
                autoPlay: false,
                onfinish: onFinishCallback,
                whileplaying: function () { onWhilePlaying(this.position); },
                whileloading: function () { onWhileLoading(this.bytesLoaded, this.bytesTotal); },
                onbufferchange: function () { onBufferingChanged(this.isBuffering); },
                onload: onDoneLoading,


            });
            this.currentSound.play();

        }

        public pause() {
            log.debug("AudioProvider", "pause()");
            if (this.currentSound) {
                this.currentSound.togglePause();
            }
        }

        public stop() {
            log.debug("AudioProvider", "stop()");
            if (this.currentSound) {
                this.currentSound.stop();
                this.currentSound.destruct();
            }
        }

        public toggleMute() {
            this.currentSound.toggleMute();
        }
    }
}
