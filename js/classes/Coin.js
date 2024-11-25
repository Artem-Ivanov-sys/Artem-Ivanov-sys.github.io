import { ObjectTime } from "./ObjectTime.js"

export class Coin extends ObjectTime {
    constructor(master_root, x, y, sprites) {
        super()
        this.master_root = master_root
        this.x = x
        this.y = y
        this.sprites = sprites
        this.anim = 0

        this.coin = sprites.img
    }

    render() {
        this.master_root.drawImage(
            this.coin, this.sprites.size*Math.floor(this.anim%this.sprites.row),
            this.sprites.size*Math.floor(this.anim/this.sprites.row),
            this.sprites.size, this.sprites.size, this.x,
                Math.floor(this.y+5*Math.sin((this.startedTime-performance.now())/500)), this.sprites.size, this.sprites.size
        )
    }
}