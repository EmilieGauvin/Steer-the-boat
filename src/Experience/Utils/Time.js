import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module'
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        this.clock = new THREE.Clock()
        this.previousTime = 0

       window.requestAnimationFrame(() =>
       {
           this.tick()
       })

        this.start = 0
    }

    reset()
    {
        this.start = this.clock.getElapsedTime()
    }

    tick()
    {
        this.elapsedTimeTotal = this.clock.getElapsedTime()
        this.elapsedTime = this.elapsedTimeTotal - this.start
        this.deltaTime = this.elapsedTimeTotal - this.previousTime
        this.previousTime = this.elapsedTimeTotal
        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }
}
