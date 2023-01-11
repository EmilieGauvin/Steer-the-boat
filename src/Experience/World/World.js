import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from "../Experience";
import Environment from './Environment.js';
import Boat from './Boat'
import Water from './Water';
import Start from './Start/Start';
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import SteeringWheel from './SteeringWheel/SteeringWheel'


export default class World {
    constructor(startingBoatColor) {
        this.experience = new Experience()
        this.time = this.experience.time
        this.renderer = this.experience.renderer
        this.resources = this.experience.resources
        this.hPScore = this.experience.hPScore

        //Set up
        this.setWaterMaterial()
        this.angleMultiplier = 0.3
        this.augmentation = 0
        this.resourcesLoaded = false


        // Event fires when all resources are loaded
        this.resources.on('ready', () => {
            this.steeringWheel = new SteeringWheel()
            this.start = new Start(startingBoatColor)
            this.water = new Water(this.waterMaterial)
            this.environment = new Environment(this.startSurfaceColor, this.startDepthColor)
            this.boat = new Boat(this.waterMaterial, startingBoatColor)
            this.boat = this.boat.instance
            this.resourcesLoaded = true
        })
    }

    setWaterMaterial() {
        // Color
        this.startDepthColor = '#2a4346'
        this.endDepthColor = '#220032'

        this.startSurfaceColor = '#b5cdd9'
        this.endSurfaceColor = '#ff0000'

        // Material
        this.waterMaterial = new THREE.ShaderMaterial({
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            transparent: true,
            uniforms:
            {
                uTime: { value: 0 },

                uBigWavesElevation: { value: 0.2 },
                uBigWavesFrequency: { value: new THREE.Vector2(1.2, 1.5) },
                uBigWavesSpeed: { value: 0.5 },

                uSmallWavesElevation: { value: 0.06 },
                uSmallWavesFrequency: { value: 1.8 },
                uSmallWavesSpeed: { value: 0.1 },
                uSmallWavesIterations: { value: 5.0 },


                uDepthColor: { value: new THREE.Color(this.startDepthColor) },
                uSurfaceColor: { value: new THREE.Color(this.startSurfaceColor) },
                uColorOffset: { value: 0.08 },
                uColorMultiplier: { value: 4 },

                uMoveX: { value: 0 },
                uMoveZ: { value: 0 }
            }
        })
    }

    resetWaterMaterial() {
        //reset colors of the lights
        this.environment.skyDirectionalLight.color = new THREE.Color(this.startSurfaceColor)
        this.environment.seaDirectionalLight.color = new THREE.Color(this.startDepthColor)

        //reset all uniforms and colors of the waterLaterial 
        this.waterMaterial.uniforms.uDepthColor.value = new THREE.Color(this.startDepthColor)
        this.waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(this.startSurfaceColor)

        this.waterMaterial.uniforms.uBigWavesElevation.value = 0.2
        this.waterMaterial.uniforms.uBigWavesFrequency.value.x = 1.2
        this.waterMaterial.uniforms.uBigWavesFrequency.value.y = 1.5
        this.waterMaterial.uniforms.uBigWavesSpeed.value = 0.5

        this.waterMaterial.uniforms.uSmallWavesElevation.value = 0.06
        this.waterMaterial.uniforms.uSmallWavesFrequency.value = 1.8
        this.waterMaterial.uniforms.uSmallWavesSpeed.value = 0.1

        this.waterMaterial.uniforms.uMoveZ.value = 0
        this.waterMaterial.uniforms.uMoveX.value = 0
    }

    resize() {
        //Resize start menu origami
        if (this.start) this.start.resize()
    }

    update() {
        //Only update world if resources are loaded
        if (this.resourcesLoaded === false) return;
        if (this.steeringWheel) this.steeringWheel.update()
        if (this.start) this.start.update()

        //If timer is off, no color change or uniform augmentation
        if (this.experience.timerOn === false) this.augmentation = 0
        if (this.experience.timerOn === true) {
            //water color changes
            this.waterMaterial.uniforms.uDepthColor.value.lerp(new THREE.Color(this.endDepthColor), this.experience.colorSpeed)
            this.waterMaterial.uniforms.uSurfaceColor.value.lerp(new THREE.Color(this.endSurfaceColor), this.experience.colorSpeed)

            //light color changes
            this.environment.skyDirectionalLight.color.lerp(new THREE.Color(this.endSurfaceColor), this.experience.colorSpeed)
            this.environment.seaDirectionalLight.color.lerp(new THREE.Color(this.endDepthColor), this.experience.colorSpeed)

            //augmentation formula for water uniforms
            this.augmentation = (0.001 + Math.sin(this.time.elapsedTime * 0.1) * 0.005) * this.time.deltaTime
        }

        // Update waterMaterial uniforms
        this.waterMaterial.uniforms.uTime.value = - this.time.elapsedTime
        this.waterMaterial.uniforms.uBigWavesElevation.value += this.augmentation
        this.waterMaterial.uniforms.uBigWavesFrequency.value.x += this.augmentation * 4
        this.waterMaterial.uniforms.uBigWavesFrequency.value.y += this.augmentation
        this.waterMaterial.uniforms.uBigWavesSpeed.value += this.time.deltaTime * 0.001
        this.waterMaterial.uniforms.uSmallWavesElevation.value += this.augmentation * 0.5
        this.waterMaterial.uniforms.uSmallWavesFrequency.value += this.augmentation * 0.5
        this.waterMaterial.uniforms.uSmallWavesSpeed.value += this.augmentation * 0.5


        // if game is not over 
        if (this.hPScore.hP > this.hPScore.hPMax * 1.1 / 5) {
            //Get steeringAngle from steeringWheel or keyboard arrows
            let steeringAngle
            if (this.steeringWheel.steeringOn === false) steeringAngle = this.experience.keySteer
            if (this.steeringWheel.steeringOn === true) steeringAngle = - this.steeringWheel.instance.rotation.z

            //Update waterMaterials move uniforms
            this.speed = this.time.deltaTime * 0.35
            this.waterMaterial.uniforms.uMoveZ.value -= this.speed * Math.cos(steeringAngle)
            this.waterMaterial.uniforms.uMoveX.value += this.speed * Math.sin(steeringAngle)

            //Calculate boat new position and orientation acording to waterMaterial update
            const newBoatXcos = (this.boat.position.x + this.waterMaterial.uniforms.uMoveX.value) * this.waterMaterial.uniforms.uBigWavesFrequency.value.x - this.time.elapsedTime * this.waterMaterial.uniforms.uBigWavesSpeed.value
            const newBoatZcos = (this.boat.position.z + this.waterMaterial.uniforms.uMoveZ.value) * this.waterMaterial.uniforms.uBigWavesFrequency.value.y - this.time.elapsedTime * this.waterMaterial.uniforms.uBigWavesSpeed.value
            const newBoatElevationY = Math.sin(newBoatXcos) * Math.sin(newBoatZcos) * this.waterMaterial.uniforms.uBigWavesElevation.value

            const deltaBoatVectorX = (newBoatXcos - this.oldBoatXcos) * this.angleMultiplier
            const deltaBoatVectorY = (newBoatElevationY - this.oldBoatElevationY)
            const deltaBoatVectorZ = (newBoatZcos - this.oldBoatZcos) * this.angleMultiplier
            const deltaBoatVector = new THREE.Vector3(deltaBoatVectorX, deltaBoatVectorY, deltaBoatVectorZ)

            this.oldBoatElevationY = newBoatElevationY
            this.oldBoatXcos = newBoatXcos
            this.oldBoatZcos = newBoatZcos

            //update boat position and angle
            this.boat.position.y = newBoatElevationY * 0.95
            this.boat.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), deltaBoatVector.normalize())
            this.boat.rotation.y = -steeringAngle


            //if timer is on, update boat HP
            if (this.experience.timerOn === false) return;

            //check angle of boat compared to Y axis
            const deltaAngle = deltaBoatVector.angleTo(new THREE.Vector3(0, 1, 0))

            //if angle to big, lower HP and outline the boat in reat 
            if ((deltaAngle <= 1) || (deltaAngle >= 2)) {
                this.hPScore.hP -= 1
                this.experience.renderer.outlinePass.selectedObjects = [this.boat]
            }
            else {
                if (this.experience.renderer.outlinePass.selectedObjects.length) this.experience.renderer.outlinePass.selectedObjects = []
            }

            //match the HPdraw angle to the boat's
            this.hPScore.orientation(deltaAngle)

        }

        //if game is over
        if (this.hPScore.hP === this.hPScore.hPMax * 1.1 / 5) {
            if (this.experience.timerOn === true) {
                //no outline
                this.experience.renderer.outlinePass.selectedObjects = []

                //after drowning, fire game end event to experience
                window.setTimeout(() => {
                    this.hPScore.gameEnd()
                }, 2500)
            }
            this.experience.timerOn = false

            //Drown boat
            this.boat.rotation.z -= 0.03
            this.boat.position.y -= 0.002
        }
    }
}