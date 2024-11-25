export class Bullet {
    constructor(master_root, x, y, speed, dmg, sprites, angle, on_right, player) {
        this.master_root = master_root
        this.x = x
        this.y = y
        this.angle = angle
        this.on_right = on_right
        this.speed = speed
        this.dmg = dmg
        this.sprites = sprites
        this.ignore = []
        this.player = player
    }

    move() {
        if (this.angle == Math.PI/2 || this.angle == -Math.PI/2) {
            this.y += this.speed * ((this.angle==Math.PI/2)*2-1)
        } else {
            this.x += this.speed * Math.cos(this.angle) * ((this.on_right)*2-1)
            this.y += this.speed * Math.sin(this.angle) * ((this.on_right)*2-1)
        }
    }

    attack(targets) {
        let ans = false
        targets.forEach((elem, i) => {
            if (this.x>elem.x && this.y>elem.y && this.x<elem.x+elem.sprites.size && this.y<elem.y+elem.sprites.size) {
                if (this.ignore.includes(elem)) {}
                else if (Math.random()>elem.aimed) {
                    this.ignore.push(elem)
                } else {
                    ans = [elem, i]
                    return 1
                }
            }
        })
        return ans
    }

    render() {
        this.master_root.drawImage(
            this.sprites.img, 0, 0, this.sprites.size, this.sprites.size,
            Math.floor(this.x-this.sprites.size/2), Math.floor(this.y-this.sprites.size/2), this.sprites.size, this.sprites.size
        )
    }
}