AFRAME.registerComponent('move-to', {
    multiple: true,
    schema: {
        target: {type: "selector"},
        position: {type: "vec3"},
        time: {default: 3.0},
        ease: {default: "linear"},
        startEvent: {type: "string"},
        onEndEvent: {type: "string"}
    },
    init: function() {
    },
    update: function(oldData) {
        this.isStart = false;
        this.percent = 0.0;
        this.isCompleted = false;

        this.target = this.data.target || this.el;

        if (this.data.startEvent) {
            this.el.addEventListener(this.data.startEvent, () => {
                this.start()
            });
        } else {
            this.start()
        }
        
    },
    start: function() {
        this.startPos = this.target.object3D.position.clone();
        this.targetPos = new THREE.Vector3(this.data.position.x, this.data.position.y, this.data.position.z);
        // console.log(this.startPos);
        // console.log(this.targetPos);
        this.isStart = true;
    },
    tick: function(time, timeDelta) {
        if(!this.isStart || this.isCompleted) return;

        if (!this.isCompleted && this.percent >= 1.0) {
            this.isCompleted = true;
            this.percent = 0.0;
            this.isStart = false;

            this.el.emit(this.data.onEndEvent);
            // console.log("done");
        } else {
            this.percent += timeDelta/1000/this.data.time;
            this.percent = Math.min(this.percent, 1.0);

            var easePercent = this.EasingFunctions[this.data.ease](this.percent);

            var nowPos = this.startPos.clone();
            nowPos.lerp(this.targetPos, easePercent);

            this.target.object3D.position.copy(nowPos); 
        }                
    },
    remove: function() {
    },
    EasingFunctions: {
        // no easing, no acceleration
        linear: t => t,
        // accelerating from zero velocity
        easeInQuad: t => t*t,
        // decelerating to zero velocity
        easeOutQuad: t => t*(2-t),
        // acceleration until halfway, then deceleration
        easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
        // accelerating from zero velocity 
        easeInCubic: t => t*t*t,
        // decelerating to zero velocity 
        easeOutCubic: t => (--t)*t*t+1,
        // acceleration until halfway, then deceleration 
        easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
        // accelerating from zero velocity 
        easeInQuart: t => t*t*t*t,
        // decelerating to zero velocity 
        easeOutQuart: t => 1-(--t)*t*t*t,
        // acceleration until halfway, then deceleration
        easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
        // accelerating from zero velocity
        easeInQuint: t => t*t*t*t*t,
        // decelerating to zero velocity
        easeOutQuint: t => 1+(--t)*t*t*t*t,
        // acceleration until halfway, then deceleration 
        easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
    }
});