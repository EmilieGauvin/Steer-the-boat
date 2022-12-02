import EventEmitter from "../Utils/EventEmitter"
import HPDraw from './HPDraw'
import Experience from '../Experience.js'

let instance = null

export default class HPScore extends EventEmitter {

    constructor(startingBoatColor) {
        super(startingBoatColor)

        if (instance) {
            return instance
        }

        instance = this

        this.experience = new Experience()
        this.hPDraw = new HPDraw(startingBoatColor)

        this.hPMax = 2000
        this.reset()


        this.triggerTimerOn = false
    }

    reset() {
        this.hP = this.hPMax * 4.25 / 5
        this.hPDraw.reset()
    }

    orientation(angle) {
        this.hPDraw.orientation(angle)
    }

    update() {

        if ((this.triggerTimerOn === false) && (this.experience.timerOn === true)) {
            this.triggerTimerOn = true
            this.trigger('gameStart')
        }
        this.hPDraw.update()
    }

    gameEnd() {
        this.trigger('gameEnd')
        this.triggerTimerOn = false
        this.reset()
        console.log('game end')
    }
}