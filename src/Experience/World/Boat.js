import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from "../Experience";

export default class Boat {
    constructor(material, startingColor) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        //setup
        this.resource = this.resources.items.boat
        this.startingColor = startingColor

        this.setInstance()
    }

    setInstance() {
        //GLTF model
        this.model = this.resource.scene
        this.scene.add(this.model)
        this.instance = this.model.children.find((child) => child.name === 'boat')

        //material
        this.instance.material.color = this.startingColor
        this.instance.material.side = THREE.DoubleSide
        this.instance.material.metalness = 0
        this.instance.material.roughness = 1

        //boat position
        this.instance.position.x = 0
        this.instance.position.z = 1
    }
}

