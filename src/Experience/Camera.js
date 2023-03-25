import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from "./Experience";

export default class Camera {
    constructor() {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.hPScore = this.experience.hPScore

        this.moveCamera = false
        this.cameraAngle = -Math.atan(0.7)
        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            70,
            this.sizes.width / this.sizes.height,
            0.1,
            1000)

        this.startPosition()
        this.scene.add(this.instance)
    }

    startPosition() {
        this.instance.position.set(0, 0.7, 1.5)
        this.instance.rotation.x = Math.PI * 0.25
        this.instance.updateMatrixWorld()
    }

    gamePosition() {
        this.instance.position.set(0, 0.7, 1.5)
        this.instance.rotation.x = this.cameraAngle
        this.instance.updateMatrixWorld()
        this.moveCamera = false
    }

    start() {
        this.hPDraw = this.experience.hPScore.hPDraw
        this.steeringWheelBuilder = this.experience.steeringWheelBuilder
        this.moveCamera = true
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
        this.scaleRatio = this.experience.scaleRatio
    }

    update() {
        if (this.controls)
            this.controls.update()

        if (this.moveCamera === true) {
            if (this.instance.rotation.x > this.cameraAngle) {
                this.instance.rotation.x -= 0.025

            }
            else if (this.instance.rotation.x <= this.cameraAngle) {
                this.instance.rotation.x = this.cameraAngle
                this.moveCamera = false
                this.experience.timerOn = true
            }
        }

    }
}

