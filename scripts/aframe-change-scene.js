AFRAME.registerComponent("change-scene", {
    schema: {
        to: { type: 'selector' },
        event: {type: "string"},
        fadePanel: { type: 'selector' },
        fadeTime: { default: 500 },
        onChangeEvent: {type: "string"},
        onEndEvent: {type: "string"}
    },
    init: function () {
        this.el.addEventListener(this.data.event, async () => {
            if (this.data.fadePanel) {
                this.data.fadePanel.emit("fadeOut");
                await this.wait(this.data.fadeTime);
            }
            
            document.querySelectorAll("[scene]").forEach(scene => {
                if (scene.id !== this.data.to.id) {
                    scene.setAttribute('visible', false)
                } else {
                    scene.setAttribute('visible', true)
                }
                scene.flushToDOM();
            })

            if (this.data.onChangeEvent) {
                this.el.emit(this.data.onChangeEvent);
            }

            if (this.data.fadePanel) {
                this.data.fadePanel.emit("fadeIn");
                await this.wait(this.data.fadeTime);
            }

            if (this.data.onEndEvent) {
                this.el.emit(this.data.onEndEvent);
            }
        })
    },
    wait: async function(ms) {
        return new Promise(r => {
            setTimeout(r, ms);
        });
    }
})