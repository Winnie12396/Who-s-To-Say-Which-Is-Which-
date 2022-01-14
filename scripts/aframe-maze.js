AFRAME.registerComponent('room', {
    schema: {
        type: {default: "000000"},
        side: {type: "string", default: "front"},
        color: {type: "string", default: "#fff"},
        colors: {type: "array"},
        src: {type: "string", default: ""},
        srcs: {type: "array"},
        normalMap: {type: "string", default: ""},
        normalMaps: {type: "array"},
        repeat: {type: "string", default: "1 1"},
        repeats: {type: "array"},
        normalTextureRepeat: {type: "string", default: "1 1"},
        normalTextureRepeats: {type: "array"},
        metalness: {type: "string", default: "0.0"},
        metalnesses: {type: "array"},
        roughness: {type: "string", default: "0.5"},
        roughnesses: {type: "array"},
        sphericalEnvMap: {type: "string", default: ""},
        debug: {type: "boolean", default: false}
    },
    init: function() {
        this.walls = [];
    },
    update: function(oldData) {
        if (this.walls.length) {
            this.walls.forEach(wall => {
                wall.remove();
            })
            this.walls = []
        } 

        var positions = [
            `0.5 0 0`,
            `-0.5 0 0`,
            `0 0.5 0`,
            `0 -0.5 0`,
            `0 0 0.5`,
            `0 0 -0.5`,
        ]
        var rotations = [
            "0 -90 0",
            "0 90 0",
            "90 0 0",
            "-90 0 0",
            "0 180 0",
            "0 0 0"
        ]

        var hasWall = this.data.type;
        for (var i = 0; i < 6; i++) {
            if (hasWall[i] === "1") {
                var wall = document.createElement("a-entity");

                wall.setAttribute("geometry", `primitive: plane; width: 1; height: 1;`);
                wall.setAttribute("position", positions[i] );
                wall.setAttribute("rotation", rotations[i] );
                wall.setAttribute("material", `
                    color: ${this.data.color}; 
                    side: ${this.data.side}; 
                    src: ${this.data.src}; 
                    normalMap: ${this.data.normalMap}; 
                    repeat: ${this.data.repeat}; 
                    normalTextureRepeat: ${this.data.normalTextureRepeat}; 
                    metalness: ${this.data.metalness};
                    roughness: ${this.data.roughness};
                    sphericalEnvMap: ${this.data.sphericalEnvMap};
                `);

                if (this.data.colors.length) {
                    wall.setAttribute("material", "color", this.data.colors[i])
                }
                if (this.data.srcs.length) {
                    wall.setAttribute("material", "src", this.data.srcs[i])
                }
                if (this.data.normalMaps.length) {
                    wall.setAttribute("material", "normalMap", this.data.normalMaps[i])
                }
                if (this.data.repeats.length) {
                    wall.setAttribute("material", "repeat", this.data.repeats[i])
                }
                if (this.data.normalTextureRepeats.length) {
                    wall.setAttribute("material", "normalTextureRepeat", this.data.normalTextureRepeats[i])
                }
                if (this.data.metalnesses.length) {
                    wall.setAttribute("material", "metalness", this.data.metalnesses[i])
                }
                if (this.data.roughnesses.length) {
                    wall.setAttribute("material", "roughness", this.data.roughnesses[i])
                }

                if (this.data.debug) {
                    wall.setAttribute("wireframehelper", "")
                }

                this.el.appendChild(wall);
                this.walls.push(wall);
            }
        }
    },
    tick: function() {
    },
    remove: function() {
    }
});


AFRAME.registerComponent('maze', {
    schema: {
        map: {type: "array"},
        roomSize: {type: "vec3", default: {x:4, y:4, z:4}},
        side: {type: "string"},
        color: {type: "string"},
        colors: {type: "string"},
        src: {type: "string"},
        srcs: {type: "string"},
        normalMap: {type: "string"},
        normalMaps: {type: "string"},
        repeat: {type: "string"},
        repeats: {type: "string"},
        normalTextureRepeat: {type: "string"},
        normalTextureRepeats: {type: "string"},
        metalness: {type: "string"},
        metalnesses: {type: "string"},
        roughness: {type: "string"},
        roughnesses: {type: "string"},
        sphericalEnvMap: {type: "string"},
        debug: {type: "boolean", default: false}
    },
    init: function() {
        this.rooms = [];
    },
    update: function(oldData) {
        if (this.rooms.length) {
            this.rooms.forEach(room => {
                room.remove();
            })
            this.rooms = []
        } 

        var map = this.data.map;

        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[y].length; x++) {
                if (map[y][x] == "0") continue;

                var walls = [1,1,1,1,1,1];

                // 確認四方有無房間，有的話打通牆壁
                if (x+1<map[y].length && map[y][x+1] == "1") {
                    walls[0] = 0
                }
                if (x-1>=0 && map[y][x-1] == "1") {
                    walls[1] = 0
                }
                if (y+1<map.length && map[y+1][x] == "1") {
                    walls[4] = 0
                }
                if (y-1>=0 && map[y-1][x] == "1") {
                    walls[5] = 0
                }

                var room = document.createElement("a-entity");

                room.setAttribute("room", `type: ${walls.join("")}`);
                room.setAttribute("scale", `${this.data.roomSize.x} ${this.data.roomSize.y} ${this.data.roomSize.z}`);
                room.setAttribute("position", `${x*this.data.roomSize.x} ${this.data.roomSize.y/2} ${y*this.data.roomSize.z}`);

                if (this.data.color) room.setAttribute("room", "color", this.data.color);
                if (this.data.colors) room.setAttribute("room", "colors", this.data.colors);
                if (this.data.src) room.setAttribute("room", "src", this.data.src);
                if (this.data.srcs) room.setAttribute("room", "srcs", this.data.srcs);
                if (this.data.normalMap) room.setAttribute("room", "normalMap", this.data.normalMap);
                if (this.data.normalMaps) room.setAttribute("room", "normalMaps", this.data.normalMaps);
                if (this.data.repeat) room.setAttribute("room", "repeat", this.data.repeat);
                if (this.data.repeats) room.setAttribute("room", "repeats", this.data.repeats);
                if (this.data.normalTextureRepeat) room.setAttribute("room", "normalTextureRepeat", this.data.normalTextureRepeat);
                if (this.data.normalTextureRepeats) room.setAttribute("room", "normalTextureRepeats", this.data.normalTextureRepeats);
                if (this.data.metalness) room.setAttribute("room", "metalness", this.data.metalness);
                if (this.data.metalnesses) room.setAttribute("room", "metalnesses", this.data.metalnesses);
                if (this.data.roughness) room.setAttribute("room", "roughness", this.data.roughness);
                if (this.data.roughnesses) room.setAttribute("room", "roughnesses", this.data.roughnesses);
                if (this.data.sphericalEnvMap) room.setAttribute("room", "sphericalEnvMap", this.data.sphericalEnvMap);

                if (this.data.debug) room.setAttribute("room", "debug", this.data.debug);


                this.el.appendChild(room);
                this.rooms.push(room);

            }
        }
    },
    tick: function() {
    },
    remove: function() {
    }
});

AFRAME.registerComponent('wireframehelper', {
    init: function() {
    },
    update: function(oldData) {
        var geometry = new THREE.PlaneGeometry();
        var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xff0000 });
        var helper = new THREE.Mesh(geometry, material);
        helper.position.set(0,0,0.001)
        this.el.setObject3D('helper', helper);
    },
    tick: function() {
    },
    remove: function() {
    }
});