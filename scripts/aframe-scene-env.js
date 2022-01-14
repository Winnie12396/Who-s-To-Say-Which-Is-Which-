AFRAME.registerComponent('scene-env', {
    schema: {
        type: "selector"
    },
    init: function() {
    },
    update: function(oldData) {
        // console.log(this.data);
        // const texture = new THREE.Texture(this.data);
        const texture = new THREE.TextureLoader().load( this.data.src );
        var scene = this.el.sceneEl.object3D;

        scene.traverse(o => {
            if (o.material) {
                o.material.sphericalEnvMap = texture;
                o.material.needsUpdate = true;
            }
        });
        
        // var geometry = new THREE.PlaneGeometry();
        // var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
        // var helper = new THREE.Mesh(geometry, material);
        // helper.position.set(0,0,0.001)
        // this.el.setObject3D('helper', helper);
    }
});


// .environment