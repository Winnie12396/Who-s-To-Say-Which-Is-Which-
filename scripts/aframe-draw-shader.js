/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
			/******/
};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
		/******/
}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
	/******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ function (module, exports) {

		'use strict';

		/**
		 * A shader to draw canvas for A-Frame VR.
		 */

		if (typeof AFRAME === 'undefined') {
			throw 'Component attempted to register before AFRAME was available.';
		}

		/* get util from AFRAME */
		var debug = AFRAME.utils.debug;
		// debug.enable('shader:draw:*')

		debug.enable('shader:draw:warn');
		var warn = debug('shader:draw:warn');
		var log = debug('shader:draw:debug');

		// log = function() {
		// 	console.log(...arguments);
		// }

		AFRAME.registerShader('draw', {

			/**
			 * For material component:
			 * @see https://github.com/aframevr/aframe/blob/60d198ef8e2bfbc57a13511ae5fca7b62e01691b/src/components/material.js
			 * For example of `registerShader`:
			 * @see https://github.com/aframevr/aframe/blob/41a50cd5ac65e462120ecc2e5091f5daefe3bd1e/src/shaders/flat.js
			 * For MeshBasicMaterial
			 * @see http://threejs.org/docs/#Reference/Materials/MeshBasicMaterial
			 */

			schema: {

				/* For material */
				color: { type: 'color' },
				fog: { default: true },

				/* For texuture */
				src: { default: "" },
				fps: { type: 'number', default: 60 },
				width: { default: 256 },
				height: { default: 256 },

				updateFlag: { type: "boolean", default: false }

			},

			/**
			 * Initialize material. Called once.
			 * @protected
			 */
			init: function init(data) {
				log('init', data);
				log(this)
				this.__cnv = document.createElement('canvas');
				this.__cnv.width = this.schema.width.default;
				this.__cnv.height = this.schema.height.default;
				this.__ctx = this.__cnv.getContext('2d');
				this.__texture = new THREE.Texture(this.__cnv);
				this.__reset();
				this.material = new THREE.MeshBasicMaterial({ map: this.__texture });
				this.el.sceneEl.addBehavior(this);
				return this.material;
			},


			/**
			 * Update or create material.
			 * @param {object|null} oldData
			 */
			update: function update(oldData) {
				log('update', oldData);
				// this.__render();
				this.__updateMaterial(oldData);
				this.__updateTexture(oldData);

				this.el.emit('draw-update', {
					ctx: this.__ctx,
					texture: this.__texture
				});

				return this.material;
			},


			/**
			 * Called on each scene tick.
			 * @protected
			 */
			tick: function tick(t) {

				if (this.__fps <= 0 || !this.__nextTime) {
					return;
				}

				var now = Date.now();
				if (now > this.__nextTime) {
					//   this.__render();
				}
			},


			/*================================
			=            material            =
			================================*/

			/**
			 * Updating existing material.
			 * @param {object} data - Material component data.
			 */
			__updateMaterial: function __updateMaterial(data) {
				var material = this.material;

				var newData = this.__getMaterialData(data);
				Object.keys(newData).forEach(function (key) {
					material[key] = newData[key];
				});
			},


			/**
			 * Builds and normalize material data, normalizing stuff along the way.
			 * @param {Object} data - Material data.
			 * @return {Object} data - Processed material data.
			 */
			__getMaterialData: function __getMaterialData(data) {
				return {
					fog: data.fog,
					color: new THREE.Color(data.color)
				};
			},


			/*==============================
			=            texure            =
			==============================*/

			/**
			 * Update or create texure.
			 * @param {Object} data - Material component data.
			 */
			__updateTexture: function __updateTexture(data) {

				this.__cnv.width = data.width ? THREE.Math.floorPowerOfTwo(data.width) : this.schema.width.default;
				this.__cnv.height = data.height ? THREE.Math.floorPowerOfTwo(data.height) : this.schema.height.default;

				/* fps */
				if (typeof data.fps === 'undefined') {
					this.__fps = this.schema.fps.default;
				} else if (data.fps && data.fps > 0) {
					this.__fps = data.fps;
				} else {
					this.__fps = 0;
				}

				if (this.__fps > 0) {
					this.__render();
				} else {
					this.__nextTime = null;
				}
			},


			/*================================
			=            playback            =
			================================*/

			/**
			 * Pause video
			 * @public
			 */
			pause: function pause() {
				log('pause');
				this.__nextTime = null;
			},


			/**
			 * Play video
			 * @public
			 */
			play: function play() {
				log('play');
				if (this.__nextTime) {
					return;
				}
				this.__render();
			},


			/**
			 * Toggle playback. play if paused and pause if played.
			 * @public
			 */

			togglePlayback: function togglePlayback() {
				if (this.paused()) {
					this.play();
				} else {
					this.pause();
				}
			},


			/**
			 * Return if the playback is paused.
			 * @public
			 * @return {boolean}
			 */
			paused: function paused() {
				return !(this.__fps > 0);
			},


			/*==============================
			 =            canvas            =
			 ==============================*/

			/**
			 * clear canvas
			 * @private
			 */
			__clearCanvas: function __clearCanvas() {
				if (!this.__ctx || !this.__texture) {
					return;
				}
				this.__ctx.clearRect(0, 0, this.__width, this.__height);
				this.__texture.needsUpdate = true;
			},


			/**
			 * render
			 * @private
			 */
			__render: function __render() {
				log('render');
				this.__nextTime = null;

				/* emit */
				this.el.emit('draw-render', {
					ctx: this.__ctx,
					texture: this.__texture
				});

				/* setup next tick */
				this.__setNextTick();
			},


			/**
			 * get next time to draw
			 * @private
			 */
			__setNextTick: function __setNextTick() {
				if (this.__fps > 0) {
					this.__nextTime = Date.now() + 1000 / this.__fps;
				}
			},


			/*=============================
			=            reset            =
			=============================*/

			/**
			 * @private
			 */

			__reset: function __reset() {
				this.pause();
				this.__clearCanvas();
			}
		});

		/***/
}
/******/]);





AFRAME.registerComponent('draw-text', {
	dependencies: [],
	schema: {
		text: { type: 'string', default: "" },
		color: { type: 'string', default: "#000" },
		strokeColor: { type: 'string', default: "#000" },
		strokeWidth: { type: 'number', default: 0 },
		backgroundColor: { type: 'string', default: "transparent" }
	},
	init() {
		this.el.setAttribute("material", "shader", "draw");
		this.el.addEventListener('draw-update', this.render.bind(this))
		this.el.setAttribute("material", "transparent", true);
	},
	update(oldData) {
		this.el.setAttribute("material", "updateFlag", !this.el.getAttribute("material").updateFlag);
	},
	remove() { },
	pause() { },
	play() { },
	render(e) {
		var ctx = e.detail.ctx,
			texture = e.detail.texture

		ctx.font = "700px sans-serif";
		w = ctx.measureText(this.data.text).width || 100;
		h = 700;

		ctx.canvas.width = w;
		ctx.canvas.height = h;

		if (this.data.backgroundColor == "transparent") {
			ctx.clearRect(0, 0, w, h);
		} else {
			ctx.fillStyle = this.data.backgroundColor;
			ctx.fillRect(0, 0, w, h);
		}

		ctx.font = "600px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		ctx.strokeStyle = this.data.strokeColor;
		ctx.lineWidth = this.data.strokeWidth*10;
		ctx.strokeText(this.data.text, w / 2, h / 2);

		ctx.fillStyle = this.data.color;
		ctx.fillText(this.data.text, w / 2, h / 2);

		texture.needsUpdate = true

		this.el.setAttribute("width", w / 1000);
		this.el.setAttribute("height", h / 1000);

		// console.log(w,h);
	}
})


AFRAME.registerComponent('fuse-button', {
	dependencies: [],
	schema: {
		color: { type: 'string', default: "#15031b"},
		barColor: { type: 'string', default: "#d24" },
		fuseTimeout: { type: 'number', default: 1000}
	},
	init() {
		var anis = {
			animation__mouseenter: "property: scale; startEvents: mouseenter; easing: easeInCubic; dur: 100; to: 1.03 1.03 1.03",
			animation__mouseleave: "property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 100; to: 1 1 1"
		}

		for (const key in anis) {
			this.el.setAttribute(key, anis[key]);
		}

		this.el.setAttribute("color", this.data.color);
	},
	update(oldData) {
		var w = Number(this.el.getAttribute("width"));
		var h = Number(this.el.getAttribute("height")) || 1;
		// console.log(w,h);

		var geometry = new THREE.PlaneGeometry(w, h);
		var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(this.data.barColor) });
		var plane = new THREE.Mesh(geometry, material);
		plane.position.set(-w/2, 0, 0.01);
		this.el.setObject3D('progressBar', plane);

		this.el.object3DMap.progressBar.scale.x = 0.0001;

		var anis = {
			animation__fusing_bar: `property: object3DMap.progressBar.scale.x; isRawProperty: true; startEvents: fusing; easing: linear; dur: ${this.data.fuseTimeout}; from: 0.0001; to: 1`,
			animation__fusing_bar_p: `property: object3DMap.progressBar.position.x; isRawProperty: true; startEvents: fusing; easing: linear; dur: ${this.data.fuseTimeout}; from: ${-w/2}; to: 0`,
			animation__mouseleave_bar: `property: object3DMap.progressBar.scale.x; isRawProperty: true; startEvents: mouseleave; easing: linear; dur: 100; to: 0.0001`,
			animation__mouseleave_bar_p: `property: object3DMap.progressBar.position.x; isRawProperty: true; startEvents: mouseleave; easing: linear; dur: 100; to: ${-w/2}`,
			animation__click_bar: `property: object3DMap.progressBar.scale.x; isRawProperty: true; startEvents: click; easing: linear; dur: 300; to: 0.0001`,
			animation__click_bar_p: `property: object3DMap.progressBar.position.x; isRawProperty: true; startEvents: click; easing: linear; dur: 300; to: ${w/2}`
		}

		for (const key in anis) {
			this.el.setAttribute(key, anis[key]);
		}
	}
})


// captions = "
// attach - to: #test;
// timeline: [
// 	time: 0.0, text: '第1行字幕',
// 	time: 2.0, text: '第2行字幕',
// 	time: 4.0, text: '第3行字幕',
// 	time: 6.0, text: '第4行字幕',
// 	time: 8.0, text: ''
// ];
// "


AFRAME.registerComponent("video-captions", {
	schema: { 
		video: {type: "string"},
		timeline: {
			parse: function (value) {
				value = value.replaceAll("'", '"')
				return JSON.parse(value);
			}
		}
	},
	init: function () {
		this.isPlaying = false;
		this.nextIndex = 0;
		console.log(this.data.timeline);

		this.el.setAttribute("draw-text", "")
	},
	update: function () {
		this.video = document.querySelector(this.data.video);
	},
	tick: function () {
		this.isPlaying = (this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2);

		if (!this.isPlaying) {
			this.nextIndex = 0;
			return;
		}
	
		if (this.nextIndex >= this.data.timeline.length) return;

		var vTime = this.video.currentTime;
		if (vTime >= this.data.timeline[this.nextIndex].time) {
			this.el.setAttribute("draw-text", "text", this.data.timeline[this.nextIndex].text)
			this.nextIndex++;
		}
	}
})


AFRAME.registerComponent("caption", {
	schema: {
		bind: { type: "selector" }, 
		bindType: { type: "string", default: "audio" }, 
		startEvent: { type: "string", default: "_captionStart" },
		onEndEvent: { type: "string", default: "" },
		onEndEventTarget: { type: "selector" },
		color: { type: 'string', default: "#000" },
		strokeColor: { type: 'string', default: "#000" },
		strokeWidth: { type: 'number', default: 0 },
		backgroundColor: { type: 'string', default: "transparent" },
		timeline: {
			parse: function (value) {
				value = value.replaceAll("'", '"')
				return JSON.parse(value);
			}
		}
	},
	init: function () {
		this.isCaptionPlaying = false;
		this.currentTime = 0.0;
		this.nextIndex = 0;
		this.el.setAttribute("draw-text", {
			color: this.data.color,
			strokeColor: this.data.strokeColor,
			strokeWidth: this.data.strokeWidth,
			backgroundColor: this.data.backgroundColor
		});

		this.el.addEventListener(this.data.startEvent, () => {
			if (this.isCaptionPlaying) return;
			
			this.currentTime = 0.0;
			this.nextIndex = 0;
			this.isCaptionPlaying = true;
		});
		this.el.emit("_captionStart");
	},
	update: function () {
		
	},
	tick: function (time, timeDelta) {
		if (this.data.bind) {
			if (this.data.bindType == "audio") {
				var soundComponent = this.data.bind.components.sound;
				var isMediaPlaying = soundComponent.pool.children[0].isPlaying;
			} else if (this.data.bindType == "video") {
				var isMediaPlaying = (this.data.bind.currentTime > 0 && !this.data.bind.paused && !this.data.bind.ended && this.data.bind.readyState > 2);
			}

			if (!isMediaPlaying) {
				// this.nextIndex = 0;
				return;
			}
		} 

		if (!this.isCaptionPlaying) {
			this.nextIndex = 0;
			return;
		}

		if (this.data.bind) {
			if (this.data.bindType == "audio") {
				var soundComponent = this.data.bind.components.sound;
				var audioSource = soundComponent.pool.children[0].source;
				var audioContext = audioSource.context;
				var currentTime = audioContext.currentTime - soundComponent.pool.children[0]._startedAt + soundComponent.pool.children[0].offset;
				// console.log(currentTime);
			} else if (this.data.bindType == "video") {
				var currentTime = this.data.bind.currentTime;
			}
			var mTime = currentTime;
			if (mTime >= this.data.timeline[this.nextIndex].time) {
				this.el.setAttribute("draw-text", "text", this.data.timeline[this.nextIndex].text)
				this.nextIndex++;
			}
		} else {
			this.currentTime += timeDelta/1000;

			if (this.currentTime >= this.data.timeline[this.nextIndex].time) {
				this.el.setAttribute("draw-text", "text", this.data.timeline[this.nextIndex].text)
				this.nextIndex++;
			}
		}

		if (this.nextIndex >= this.data.timeline.length) {
			this.isCaptionPlaying = false;
			this.nextIndex = 0;
			console.log("done");
			if (this.data.onEndEvent) {
				if (this.data.onEndEventTarget) {
					this.data.onEndEventTarget.emit(this.data.onEndEvent);
				} else {
					this.el.emit(this.data.onEndEvent);
				}
			}
		}
		
	}
})