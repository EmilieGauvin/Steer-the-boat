import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Sizes from "./Utils/Sizes"
import Time from "./Utils/Time"
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World.js'
import Debug from './Utils/Debug'
import sources from './World/sources'
import Resources from './Utils/Resources'
import KeyEvents from './Utils/KeyEvents'
import HPScore from './HP/HPScore'
import PointerEvents from './Utils/PointerEvents'
import LoadingBar from './LoadingBar/LoadingBar'

let instance = null

export default class Experience {
    constructor(canvas) {
        if (instance) {
            return instance
        }
        instance = this

        //Global acces
        window.experience = this

        //Options
        this.canvas = canvas

        //Set up variables
        this.timerOn = false
        this.colorSpeed = 0.0001
        this.boatColorName = 'mediumslateblue'
        this.boatColor = new THREE.Color(this.boatColorName)
        this.keySteer = 0
        this.keySteerSpeed = 0.05

        //Set up
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.pointerEvents = new PointerEvents
        this.pointer = this.pointerEvents.pointer
        this.camera = new Camera()
        this.fakeCamera = new Camera()
        this.fakeCamera.gamePosition()
        this.renderer = new Renderer()
        this.resources = new Resources(sources)
        this.loadingBar = new LoadingBar()
        this.keyEvents = new KeyEvents()
        this.hPScore = new HPScore(this.boatColor)
        this.world = new World(this.boatColor)

        //Sizes events
        this.sizes.on('resize', () => {
            this.resize()
        })

        //Time tick event
        this.time.on('tick', () => {
            this.update()
        })

        // Keyboard event
        this.keyEvents.on('left', () => {
            if (this.keySteer > -1) this.keySteer -= this.keySteerSpeed * Math.PI * 0.5
        })
        this.keyEvents.on('right', () => {
            if (this.keySteer < 1) this.keySteer += this.keySteerSpeed * Math.PI * 0.5
        })

        //HP GAME END events 
        this.hPScore.on('gameEnd', () => {
            this.camera.startPosition()
            this.timerOn = false
            this.hPScore.reset()
            this.world.resetWaterMaterial()
            this.renderer.reset()
        })

    }

    resize() {
        this.camera.resize()
        this.fakeCamera.resize()
        this.renderer.resize()
        this.hPScore.hPDraw.resize()
        this.world.resize()
        if (this.steeringWheelBuilder) this.steeringWheelBuilder.resize()
    }


    update() {
        this.camera.update()
        this.renderer.update()
        if (this.loadingBar) this.loadingBar.update()
        if (this.hPScore) this.hPScore.update()
        if (this.world) this.world.update()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        //Travers the wholde scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if (this.debug.active)
            this.debug.ui.destroy()
    }
}
