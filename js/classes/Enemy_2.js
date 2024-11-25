import { Coin } from "./Coin.js"
import { resources } from "../Resources.js"

export class Enemy2 {
    constructor(master_root, x, y, speed, max_health, dmg, sprites, shield) {
        this.master_root = master_root
        this.x = x
        this.y = y
        this.dmg = dmg
        this.health = {cur: max_health, max: max_health, shield: {cur: 500, max: 500}}
        this.speed = speed
        this.sprites = sprites
        this.shield = shield
        this.anim = 0
        this.walking = {x: 0, y: 0}
        this.weapon = null
        this.aim = 1
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
                    gameStarted = false
                    gameOver = true
                }
                this.cooldown()
            }
        }
    }

    attacked(from) {
        if (from.y - this.y < this.shield.health_line[1] || this.health.shield.cur == 0) {
            this.health.cur = Math.max(0, this.health.cur-from.dmg)
            return true
        } else {
            this.health.shield.cur = Math.max(0, this.health.shield.cur-from.dmg)
            this.health.cur = Math.max(0, this.health.cur-from.dmg/30)
            return false
        }
    }

    cooldown() {
        let dmg = this.dmg
        this.dmg = 0
        setTimeout(() => {this.dmg = dmg}, 1500)
    }

    die(coins) {
        coins.push(new Coin(this.master_root, Math.floor(this.x+(this.sprites.size-resources.src.coin.size)/2),
            Math.floor(this.y+this.sprites.size-resources.src.coin.size), resources.src.coin))
        if (this.health.shield.cur > this.health.shield.max / 2) {
            if (Math.random() > 0.98) {
                weapons.push(new Shield(this.master_root, Math.floor(this.x+(this.sprites.size-resources.src.shield.size)/2),
                    Math.floor(this.y+this.sprites.size-resources.src.shield.size), resources.src.shield))
            }
        }
    }

    render() {
        this.master_root.drawImage(
            this.sprites.img, this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.walking.x>=0))%this.sprites.row),
            this.sprites.size*Math.floor((this.anim+this.sprites.count*(this.walking.x>=0))/this.sprites.row),
            this.sprites.size, this.sprites.size,
            Math.floor(this.x), Math.floor(this.y), this.sprites.size, this.sprites.size
        )
        if (this.health.shield.cur) {
            this.master_root.drawImage(
                this.shield.img, this.sprites.size*(this.health.shield.cur < this.health.shield.max/2),
                this.sprites.size*(this.walking.x>=0),
                this.sprites.size, this.sprites.size,
                Math.floor(this.x), Math.floor(this.y), this.sprites.size, this.sprites.size
            )
            // let delta_coords
            if (this.health.shield.cur!=this.health.shield.max) {
                this.master_root.fillStyle = "black"
                this.master_root.fillRect(this.x+this.shield.health_line[0]-1, this.y+this.shield.health_line[1]-4,
                    this.shield.health_line[2] * 1/2+2, 5)
                this.master_root.fillStyle = "#FF5B5B"
                this.master_root.fillRect(this.x+this.shield.health_line[0], this.y+this.shield.health_line[1]-3,
                    this.shield.health_line[2] * 1/2, 3)
                this.master_root.fillStyle = "#1AB911"
                this.master_root.fillRect(this.x+this.shield.health_line[0], this.y+this.shield.health_line[1]-3,
                    this.shield.health_line[2] * 1/2 * this.health.shield.cur / this.health.shield.max, 3)
            }
        }
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