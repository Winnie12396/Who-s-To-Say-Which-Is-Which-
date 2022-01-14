AFRAME.registerComponent('video-player', {
    schema: {
        playEvent: {default: ""},
        pauseEvent: {default: ""},
        toggleEvent: {default: ""},
        onEndEvent: {default: ""}
    },
    init: function () {
        var self = this
        this.isPlaying = false;

        if (this.data.playEvent != "") {
            this.el.addEventListener(this.data.playEvent, function() {
                var video = this.components.material.material.map.image;
                video.play();
                this.isPlaying = true;
            });
        }

        if (this.data.pauseEvent != "") {
            this.el.addEventListener(this.data.pauseEvent, function() {
                var video = this.components.material.material.map.image;
                video.pause();
                this.isPlaying = false;
            });
        }

        if (this.data.toggleEvent != "") {
            this.el.addEventListener(this.data.toggleEvent, function() {
                var video = this.components.material.material.map.image;
                if (this.isPlaying) {
                    video.pause();
                } else {
                    video.play();
                }
                this.isPlaying = !this.isPlaying;
            });
        }

        var video = this.el.components.material.material.map.image;
        if (this.data.onEndEvent != "") {
            video.addEventListener("ended", function() {
                self.el.emit(self.data.onEndEvent);
            })
        }
        if (this.data.onPlayEvent != "") {
            video.addEventListener("play", function() {
                self.el.emit(self.data.onPlayEvent);
            })
        }
    }
});