import * as THREE from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r146/build/three.module.js'
import Experience from '../Experience.js'
import fullScreenGroup from '../Utils/fullScreenGroup'
import resizeFullScreenGroup from '../Utils/resizeFullScreenGroup'
import HPScore from './HPScore.js'


export default class HPDraw {
    constructor(startingBoatColor) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.time = this.experience.time
        this.camera = this.experience.camera
        this.fakeCamera = this.experience.fakeCamera
        this.resources = this.experience.resources

        this.hPScore = new HPScore()

        //Set up
        this.startColor = '#82c6b8'
        this.endColor = '#4a00d2'
        this.color = new THREE.Color(this.startColor)

        this.resources.on('ready', () => {
            this.setUp()
            this.backHPDrawSetUp(startingBoatColor)
            this.frontHPDrawSetUp()
        })
    }

    setUp() {
        this.timerPosition = new THREE.Mesh()

        this.resource = this.resources.items.scoreBoat
        this.model = this.resource.scene

        this.scale = 1.8

        this.backHPDraw = this.model.children.find((child) => child.name === 'scoreBoatBack')
        this.backHPDraw.scale.set(this.scale, this.scale, this.scale)

        this.frontHPDraw = this.model.children.find((child) => child.name === 'scoreBoatFront')
        this.frontHPDraw.position.z -= 0.0001
        this.frontHPDraw.scale.set(this.scale, this.scale, this.scale)

        this.fullscreen = fullScreenGroup(
            [{ object: this.model, X: -0.45, Y: 0.40, Z: 0 },
            { object: this.timerPosition, X: 0.45, Y: 0.45, Z: 0 }],
            this.fakeCamera.instance,
            this.fakeCamera.instance.position.length() * 0.2,
            this.scene,
            false)
    }

    backHPDrawSetUp(startingBoatColor) {
        this.backHPDrawMaterial = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            wireframe: true,
            vertexShader: `
                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);                }
            `,
            fragmentShader: `
                uniform vec3 uColor;

                void main()
                {
                    gl_FragColor = vec4(uColor, 1.0);
                }
            `,
            uniforms:
            {
                uColor: { value: startingBoatColor }
            }
        })

        this.backHPDraw.material = this.backHPDrawMaterial
    }

    frontHPDrawSetUp() {
        this.frontHPDrawMaterial = new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    vUv = uv;
                }
            `,
            fragmentShader: `
                uniform float uHP;
                uniform float uTime;
                varying vec2 vUv;
                uniform float uAngle;
                uniform vec3 uColor;
                
                vec2 rotate(vec2 uv, float rotation, vec2 mid)
                {
                    return vec2(
                      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
                      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
                    );
                }
                
                void main()
                {
                    vec2 rotatedUv = rotate(vUv, -uAngle, vec2(0.5));

                    float test = rotatedUv.y + sin(rotatedUv.x*25.0 + uTime * 5.0) * 0.05;
                    float strength = step(uHP, test);
                    gl_FragColor = vec4(uColor, strength);
                }
            `,
            uniforms:
            {
                uHP: { value: 1 },
                uTime: { value: 0 },
                uAngle: { value: 0 },
                uColor: { value: new THREE.Vector3(1, 1, 1) }
            }
        })

        this.frontHPDraw.material = this.frontHPDrawMaterial

    }

    orientation(angle) {
        this.backHPDraw.rotation.z = (angle - Math.PI * 0.5) * 0.5
        this.frontHPDraw.rotation.z = (angle - Math.PI * 0.5) * 0.5
        this.frontHPDrawMaterial.uniforms.uAngle.value = (angle - Math.PI * 0.5) * 0.5
    }

    resize() {
        if (this.fullscreen) resizeFullScreenGroup(this.fullscreen)
    }

    reset() {
        this.color = new THREE.Color(this.startColor)
    }

    update() {
        if (this.experience.timerOn === true) {
            this.color.lerp(new THREE.Color(this.endColor), this.experience.colorSpeed)
        }

        if (this.frontHPDrawMaterial) {
            this.frontHPDrawMaterial.uniforms.uHP.value = this.hPScore.hP / this.hPScore.hPMax
            this.frontHPDrawMaterial.uniforms.uTime.value = this.time.elapsedTime
            this.frontHPDrawMaterial.uniforms.uColor.value = new THREE.Vector3(this.color.r, this.color.g, this.color.b)
        }

        if (this.timerPosition) {
            let worldPosition = new THREE.Vector3
            this.timerPosition.getWorldPosition(worldPosition)

            const screenPosition = worldPosition.clone()
            screenPosition.project(this.camera.instance)

            const translateX = screenPosition.x * this.sizes.width * 0.5
            const translateY = - screenPosition.y * this.sizes.height * 0.5
            document.querySelector('.timer').style.transform = `translateX(${translateX}px) translateY(${translateY}px)`

            document.querySelector('.timer').style.backgroundColor = this.color.getStyle()
            document.querySelector('.timer').style.color = this.scene.background.getStyle()
        }
    }
}