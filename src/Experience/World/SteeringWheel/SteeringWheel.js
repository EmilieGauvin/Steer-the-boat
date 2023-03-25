import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../../Experience.js'
import fullScreenGroup from '../../Utils/fullScreenGroup'
import resizeFullScreenGroup from '../../Utils/resizeFullScreenGroup'

export default class SteeringWheelBuilder {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.fakeCamera = this.experience.fakeCamera
        this.resources = this.experience.resources
        this.pointerEvents = this.experience.pointerEvents
        this.pointer = this.experience.pointer


        //Setup
        this.setModel()
        this.wheelResetting = false
        this.steeringOn = false
        this.raycaster = new THREE.Raycaster()
        this.intersect = []

        //Pointer events
        this.pointerEvents.on('pointerDown', () => {
            this.selectSteeringWheel()
        })

        this.pointerEvents.on('pointerMove', () => {
            this.moveSteeringWheel()
        })

        this.pointerEvents.on('pointerCancel', () => {
            this.dropSteeringWheel()
        })
    }

    selectSteeringWheel() {
        //Check if clicked on steeringWhell
        this.raycaster.setFromCamera(this.pointer, this.camera.instance)
        this.intersect = this.raycaster.intersectObject(this.model)
        if (this.intersect.length) this.steeringOn = true
        else this.steeringOn = false
    }

    moveSteeringWheel() {
        //If didn't clicked on steeringWheel, or the wheel resetting, return
        if (this.steeringOn === false) return
        if (this.wheelResetting === true) return

        //If clicked on steeringWheel, rotate wheel acording to pointer.x
        this.instance.rotation.z = -this.pointer.x * Math.PI * 0.5 * 3

        //Limit angles
        if (this.instance.rotation.z >= Math.PI * 0.5) this.instance.rotation.z = Math.PI * 0.4
        if (this.instance.rotation.z <= -Math.PI * 0.5) this.instance.rotation.z = -Math.PI * 0.4
    }

    dropSteeringWheel() {
        //If clicked on steeringwheel, reset it
        if (this.steeringOn === false) return
        this.wheelResetting = true
    }

    setModel() {
        this.resource = this.resources.items.steeringWheel
        this.model = this.resource.scene
        this.scale = 0.10
        this.model.scale.set(this.scale, this.scale, this.scale)

        this.backWheel = this.model.children.find((child) => child.name === 'backWheel')
        this.backWheel.material = new THREE.MeshBasicMaterial({
            visible: false
        })

        this.instance = this.model.children.find((child) => child.name === 'frontWheel')
        this.instance.material = new THREE.MeshBasicMaterial({
            color: 'white',
            side: THREE.DoubleSide
        })

        this.fullscreen = fullScreenGroup(
            [{ object: this.model, X: 0, Y: -0.45, Z: 0 }],
            this.fakeCamera.instance,
            this.fakeCamera.instance.position.length() * 0.2,
            this.scene,
            false)
    }

    resize() {
        if (this.fullscreen) resizeFullScreenGroup(this.fullscreen)
    }

    update() {
        //Reset wheel to angle = 0
        if (this.wheelResetting === true) {
            if (this.instance.rotation.z < 0) {
                this.instance.rotation.z += 4 * this.time.deltaTime
                if (this.instance.rotation.z >= 0) this.instance.rotation.z = 0
            }
            if (this.instance.rotation.z > 0) {
                this.instance.rotation.z -= 4 * this.time.deltaTime
                if (this.instance.rotation.z <= 0) this.instance.rotation.z = 0
            }
            if (this.instance.rotation.z === 0) {
                this.intersect = []
                this.steeringOn = false
                this.experience.keySteer = 0
                this.wheelResetting = false
            }
        }
    }
}