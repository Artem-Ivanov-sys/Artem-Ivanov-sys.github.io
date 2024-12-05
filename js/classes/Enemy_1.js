import { Coin } from "./Coin.js"
import { resources } from "../Resources.js"

export class Enemy {
    constructor(master_root, x, y, speed, max_health, dmg, sprites) {
        this.master_root = master_root
        this.x = x
        this.y = y
        this.dmg = dmg
        this.health = {cur: max_health, max: max_health}
        this.speed = speed
        this.sprites = sprites
        this.anim = 0
        this.walking = {x: 0, y: 0}
        this.weapon = null
        this.aimed = .8
    }

    walk(dir) {
        let absVal = Math.sqrt(dir[0]**2 + dir[1]**2)
        this.walking.x = this.speed * dir[0] / absVal
        this.walking.y = this.speed * dir[1] / absVal
        this.x += this.walking.x
        this.y += this.walking.y
    }

    attack(player) {
        if (Math.sqrt((this.x-player.x)**2+(this.y-player.y)**2) > this.sprites.size / 2) {
            let dir = [player.x - this.x, player.y - this.y]
            this.walk(dir)
        } else {this.walking.x = this.walking.y = 0}
        if (this.dmg) {
            if (Math.sqrt((player.x-this.x)**2+(player.y-this.y)**2) < this.sprites.size / 2) {
                if (player.shield == null) player.health.cur = Math.max(0, player.health.cur-this.dmg)
                else {
                    player.shield_health.cur = Math.max(0, player.shield_health.cur-this.dmg)
                    if (player.shield_health.cur == 0) player.shield = null
                }
                if (player.health.cur == 0) {
                    player.is_alive = false
                }
                this.cooldown()
            }
        }
    }

    attacked(from) {
        this.health.cur = Math.max(0, this.health.cur-from.dmg)
        return true
    }

    cooldown() {
        let dmg = this.dmg
        this.dmg = 0
        setTimeout(() => {this.dmg = dmg}, 1000)
    }

    die(coins) {
        let drop = []
        coins.push(new Coin(this.master_root, Math.floor(this.x+(this.sprites.size-resources.src.coin.size)/2),
            Math.floor(this.y+this.sprites.size-resources.src.coin.size), resources.src.coin))
        return drop
    }

    render() {
        this.master_root.drawImage(
            this.sprites.img, this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.walking.x>=0))%this.sprites.row),
            this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.walking.x>=0))/this.sprites.row),
            this.sprites.size, this.sprites.size,
            Math.floor(this.x), Math.floor(this.y), this.sprites.size, this.sprites.size
        )
        if (this.health.cur!=this.health.max) {
            this.master_root.fillStyle = "black"
            this.master_root.fillRect(this.x+this.sprites.size/4-1, this.y-4,
                this.sprites.size-this.sprites.size/2+2, 5)
            this.master_root.fillStyle = "#FF5B5B"
            this.master_root.fillRect(this.x+this.sprites.size/4, this.y-3,
                this.sprites.size-this.sprites.size/2, 3)
            this.master_root.fillStyle = "#1AB911"
            this.master_root.fillRect(this.x+this.sprites.size/4, this.y-3,
                this.sprites.size * 1/2 * this.health.cur / this.health.max, 3)
        }
    }
}