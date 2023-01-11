import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from "../Experience";

export default class Environment {
    constructor(startSkyColor, startSeaColor) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        this.setSkyDirectionalLight(startSkyColor)
        this.setSeaDirectionalLight(startSeaColor)
        this.setSpotLight()
    }

    setSeaDirectionalLight(color) {
        this.seaDirectionalLight = new THREE.DirectionalLight(color, 1)
        this.scene.add(this.seaDirectionalLight)
        this.seaDirectionalLight.position.set(0.25, -1, 0.25)
    }

    setSkyDirectionalLight(color) {
        this.skyDirectionalLight = new THREE.DirectionalLight(color, 1)
        this.scene.add(this.skyDirectionalLight)
        this.skyDirectionalLight.position.set(0.25, 1, 0.25)
    }

    setSpotLight() {
        const spotLight = new THREE.SpotLight('#ffffff', 0.85, 20, Math.PI, 0.25, 1)
        spotLight.position.set(0, 0.3, 2)
        spotLight.target.position.set(0, 1, 2)

        this.scene.add(spotLight)
        this.scene.add(spotLight.target)
    }
}
