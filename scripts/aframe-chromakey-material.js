AFRAME.registerComponent('chromakey', {
	schema: {
		color: { default: { x: 0.1, y: 0.9, z: 0.2 }, type: 'vec3', is: 'uniform' },
		range: { default: 0.5 , type: 'float', is: 'uniform' },
	},

	init: function () {
		var src = document.querySelector(this.el.getAttribute('src'));
		var texture
		if (src.tagName === "VIDEO") {
			texture = new THREE.VideoTexture(src)
			texture.minFilter = THREE.LinearFilter
		} else {
			texture = new THREE.TextureLoader().load(src.src);
			// texture = new THREE.Texture(src);
		}
		this.material = this.el.getObject3D('mesh').material = new THREE.ShaderMaterial({
			side: THREE.DoubleSide,
			transparent: true,
			uniforms: {
				color: {
					type: 'c',
					value: this.data.color
				},
				range: {
					type: 'f',
					value: this.data.range
				},
				texture: {
					type: 't',
					value: texture
				}
			},
			vertexShader: [
				'varying vec2 vUv;',
				'void main(void)',
				'{',
				'vUv = uv;',
				'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
				'gl_Position = projectionMatrix * mvPosition;',
				'}'
			].join('\n'),
			fragmentShader: [
				'uniform sampler2D texture;',
				'uniform vec3 color;',
				'uniform float range;',
				'varying vec2 vUv;',
				'void main(void)',
				'{',
				'vec3 tColor = texture2D( texture, vUv ).rgb;',
				'float a = (length(tColor - color) - range) * 7.0;',
				'gl_FragColor = vec4(tColor, a);',
				//   'gl_FragColor = vec4(vUv.x,vUv.y,0, 1.0);',
				// 'gl_FragColor = texture2D( texture, vUv );',
				'}'
			].join('\n')
		})

		// console.log(texture);
	},

	update: function () {
		// return;
		this.material.range = this.data.range;
		this.material.color = this.data.color;
		// this.material.src = this.data.src
		// this.material.transparent = this.data.transparent
	},
});