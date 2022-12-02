import EventEmitter from "./EventEmitter"

export default class KeyEvents extends EventEmitter
{
    constructor()
    {
        super()

        window.addEventListener('keydown', (e) =>
        {
            if (e.key == "ArrowLeft") 
            {
                    this.trigger('left')
            }
        })

        window.addEventListener('keydown', (e) =>
        {
            if (e.key == "ArrowRight") 
            {
                    this.trigger('right')
            }
        })
    }
}







