import { ObjectTime } from "./ObjectTime.js"
import { Bullet } from "./Bullet.js"
import { resources } from "../Resources.js"

export class Weapon extends ObjectTime {
    constructor(master_root, x, y, center_params, sprites, angle, owner, shakeVar,
        slowing=0, delay=0, scattering=0, scale=.8, count=1) {
        super()
        this.count = count
        this.master_root = master_root
        this.x = x
        this.y = y
        this.center_params = center_params
        this.sprites = sprites
        this.active = true
        this.angle = angle || 0
        this.owner = owner || 0
        this.bullets = []
        this.scale = scale
        this.onAttack = false
        this.scattering = scattering
        this.slowing = slowing
        this.delay = delay
        console.log(this.slowing, this.delay)

        this.shakeVar = shakeVar
    }

    attack() {
        if (this.active) {
            this.active = false
            this.shakeVar = true
            for (let i=0;i<this.count;i++) {
                this.bullets.push(new Bullet(this.master_root, this.owner.x+this.owner.sprites.size/2 + 
                    this.sprites.bullet_factor[0]*Math.cos(this.angle) - this.sprites.bullet_factor[1]*Math.sin(this.angle),
                    this.owner.y+this.owner.center + 
                    this.sprites.bullet_factor[0]*Math.sin(this.angle) + this.sprites.bullet_factor[1]*Math.cos(this.angle),
                    10, this.owner.dmg, resources.src.bullet, this.angle + (Math.random()*2*this.scattering - this.scattering) * Math.PI / 180,
                    this.owner.on_right, this.owner))
            }
            setTimeout(() => {this.active = true}, this.delay)
        }
    }

    render() {
        if (!this.owner) {
            this.master_root.translate(this.x+this.sprites.size/2, this.y+this.sprites.sizeY/2+10)
            this.master_root.rotate(this.angle)
            this.master_root.drawImage(
                this.sprites.img, 0, this.sprites.sizeY,
                this.sprites.size, this.sprites.sizeY,
                -this.sprites.size/2, Math.floor(-this.sprites.sizeY/2+5*Math.sin((this.startedTime-performance.now())/500)),
                    this.sprites.size, this.sprites.sizeY
            )
            this.master_root.rotate(-this.angle)
            this.master_root.translate(-this.x-this.sprites.size/2, -this.y-this.sprites.sizeY/2-10)
        } else {
            this.bullets.forEach((elem) => {
                elem.render()
            })
            if (!this.owner.on_right) {
                this.master_root.translate(this.owner.x+this.owner.sprites.size/2,
                    this.owner.y+this.owner.center)
                this.master_root.rotate(this.angle)
                this.master_root.scale(-1, 1)
                this.master_root.drawImage(
                    this.sprites.img, 0, 0,
                    this.sprites.size, this.sprites.sizeY,
                    -this.center_params[0]*this.scale, -this.center_params[1]*this.scale,
                    this.sprites.size*this.scale, this.sprites.sizeY*this.scale
                )
                this.master_root.fillStyle = "red"
                this.master_root.fillRect(0, 0, 1, 1)
                this.master_root.scale(-1, 1)
                this.master_root.rotate(-this.angle)
                this.master_root.translate(-this.owner.x-this.owner.sprites.size/2,
                    -this.owner.y-this.owner.center)
            } else {
                this.master_root.translate(this.owner.x+this.owner.sprites.size/2,
                    this.owner.y+this.owner.center)
                this.master_root.rotate(this.angle)
                this.master_root.drawImage(
                    this.sprites.img, 0, 0,
                    this.sprites.size, this.sprites.sizeY,
                    -this.center_params[0]*this.scale, -this.center_params[1]*this.scale,
                    this.sprites.size*this.scale, this.sprites.sizeY*this.scale
                )
                this.master_root.fillStyle = "red"
                this.master_root.fillRect(-1, -1, 1, 1)
                this.master_root.rotate(-this.angle)
                this.master_root.translate(-this.owner.x-this.owner.sprites.size/2,
                    -this.owner.y-this.owner.center)
            }
        }
    }
}