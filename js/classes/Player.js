import { createAngle } from "../CreateAngle.js"
import { resources } from "../Resources.js"

export class Player {
    constructor(master_root, x, y, speed, max_health, dmg, sprites, center, cursor) {
        this.master_root = master_root
        this.x = x
        this.y = y
        this.dmg = dmg
        this.health = {cur: max_health, max: max_health}
        this.shield_health = {cur: 0, max: 200}
        this.shield = null
        this.speed = speed
        this.sprites = sprites
        this.anim = 0
        this.walking = {x: 0, y: 0}
        this.weapon = null
        this.center = center
        this.on_right = true
        this.cursor = cursor
        this.is_alive = true
        
        this.coins = 301
    }

    walk() {
        let slowing = this.weapon!=null?this.weapon.slowing:0
        slowing += this.shield!=null?.2:0
        if (this.walking.y > 0) {
            this.y = Math.max(this.y - this.speed * (1 - slowing), 0)
        } else if (this.walking.y < 0) {
            this.y = Math.min(this.y + this.speed * (1 - slowing), this.master_root.canvas.height-this.sprites.size)
        }

        if (this.walking.x > 0) {
            this.x = Math.min(this.x + this.speed * (1 - slowing), this.master_root.canvas.width-this.sprites.size)
        } else if (this.walking.x < 0) {
            this.x = Math.max(this.x - this.speed * (1 - slowing), 0)
        }

        if (!this.weapon) {
            if (this.walking.x > 0) {
                this.on_right = true
            } else if (this.walking.x < 0) {
                this.on_right = false
            }
        } else {
            let angle = createAngle([this.cursor.offset.x, this.cursor.offset.y], [this.x+this.sprites.size/2, this.y+this.center])
            let x = this.cursor.offset.x, y = this.cursor.offset.y
            this.weapon.angle = y>(this.y+this.center)?angle:-angle
            if (x<this.x+this.sprites.size/2) {
                this.on_right = false
                this.weapon.angle += Math.PI
            } else {
                this.on_right = true
            }
        }
    }

    coins_pick(coins) {
        coins.forEach((c, i) => {
            if (Math.sqrt((c.x-this.x)**2 + (c.y-this.y)**2) < resources.src.coin.size) {
                this.coins++
                coins.splice(i, 1)
            }
        })
    }

    render_shield() {
        if (this.shield_health.cur) {
            this.master_root.drawImage(
                this.shield.img, this.shield.size*(this.shield_health.cur < this.shield_health.max/2),
                this.shield.size*(this.on_right),
                this.shield.size, this.shield.size,
                Math.floor(this.x - (this.shield.size - this.sprites.size)/2),
                Math.floor(this.y - (this.shield.size - this.sprites.size)/2), this.shield.size, this.shield.size
            )
        }
    }

    render() {
        this.master_root.drawImage(
            this.sprites.img, this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.on_right))%this.sprites.row),
            this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.on_right))/this.sprites.row),
            this.sprites.size, this.sprites.size,
            Math.floor(this.x), Math.floor(this.y), this.sprites.size, this.sprites.size
        )
        if (this.on_right) this.render_shield()
        if (this.weapon) {
            this.weapon.render()
        }
        this.master_root.globalAlpha = 0.8
        if (!this.on_right) this.render_shield()
        this.master_root.globalAlpha = 1
    }
}