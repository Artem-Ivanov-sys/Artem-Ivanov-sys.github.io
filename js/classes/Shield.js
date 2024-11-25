import { ObjectTime } from "./ObjectTime.js"

export class Shield extends ObjectTime {
    constructor(master_root, x, y, sprites) {
        super()
        this.master_root = master_root
        this.x = x
        this.y = y
        this.sprites = sprites
        this.anim = 0
    }

    render() {
        this.master_root.drawImage(
            this.sprites.img, this.sprites.size*Math.floor(this.anim%this.sprites.row),
            this.sprites.size*Math.floor(this.anim/this.sprites.row),
            this.sprites.size, this.sprites.size, this.x-1,
                Math.floor(this.y+3*Math.sin((this.startedTime-performance.now())/500)), this.sprites.size, this.sprites.size
        )
    }
}