AFRAME.registerComponent("attach-to", {
    schema: {type: "string"},
    init: function () {
        this.target = document.querySelector(this.data);

        this.targetWorldPosition = new THREE.Vector3();
        this.target.object3D.getWorldPosition(this.targetWorldPosition);
        this.el.object3D.position.copy(this.targetWorldPosition);

        this.targetWorldQuaternion = new THREE.Quaternion();
        this.target.object3D.getWorldQuaternion(this.targetWorldQuaternion);
        this.el.object3D.setRotationFromQuaternion(this.targetWorldQuaternion);
    },
    tick: function() {
        this.target.object3D.getWorldPosition(this.targetWorldPosition);
        this.el.object3D.position.lerp(this.targetWorldPosition, 0.1);

        this.target.object3D.getWorldQuaternion(this.targetWorldQuaternion);
        this.el.object3D.setRotationFromQuaternion(this.targetWorldQuaternion);
    }
})