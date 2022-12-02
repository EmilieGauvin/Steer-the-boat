import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module'
import Experience from '../Experience.js'


export default class Water {
    constructor(material) {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.waterMaterial = material
        this.setUp()
    }

    setUp() {
        // Geometry
        const waterGeometry = new THREE.PlaneGeometry(4, 4, 256, 256)

        // Mesh
        this.instance = new THREE.Mesh(waterGeometry, this.waterMaterial)
        this.instance.rotation.x = - Math.PI * 0.5
        this.instance.position.y = 0.01
        this.scene.add(this.instance)
    }
}


