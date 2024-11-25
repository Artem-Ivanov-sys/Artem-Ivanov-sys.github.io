export class Resources {
    constructor() {
        this.src = {
            background: {
                src:"sprites/background.png"
            },
            shadow: {
                src:"sprites/shadow.png"
            },
            player: {
                size:34,
                count:3,
                row:2,
                src:"sprites/girl1.png"
            },
            enemy_1: {
                size:34,
                count:3,
                row:2,
                src:"sprites/enemy1.png"
            },
            Enemy_2: {
                size:40,
                count:3,
                row:2,
                src:"sprites/enemy2.png"
            },
            shield: {
                size:40,
                count:1,
                row:2,
                health_line: [13, 14, 14],
                src:"sprites/shield.png"
            },
            coin: {
                size:22,
                count:3,
                row:2,
                src:"sprites/coin.png"
            },
            weapon_1: {
                size:52,
                sizeY:18,
                center_params: [22, 8],
                bullet_factor: [0, 0],
                count:1,
                row:1,
                src:"sprites/m16.png"
            },
            weapon_2: {
                size:52,
                sizeY:22,
                center_params: [10, 6],
                bullet_factor: [0, 3],
                count:1,
                row:1,
                src:"sprites/m134.png"
            },
            bullet: {
                size:2,
                src:"sprites/m16_bullet.png"
            }
        }
    }

    render() {
        Object.keys(this.src).forEach(key => {
            this.src[key].img = new Image()
            this.src[key].img.src = this.src[key].src
        })
        console.log(this.src)
    }
}

export const resources = new Resources()