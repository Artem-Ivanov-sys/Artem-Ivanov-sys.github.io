import { resources } from "./js/Resources.js"
import { Player } from "./js/classes/Player.js"
import { checkCollision } from "./js/Collision.js"
import { createAngle } from "./js/CreateAngle.js"
import { NewCursor } from "./js/classes/Cursor.js"
import { Enemy } from "./js/classes/Enemy_1.js"
import { Enemy2 } from "./js/classes/Enemy_2.js"
import { Shield } from "./js/classes/Shield.js"
import { Weapon } from "./js/classes/Weapon.js"
import { Control } from "./js/classes/Control.js"

const canvas = document.getElementById("field")
const context = canvas.getContext("2d")
const FPS = 60
var gameStarted = false
var gameOver = false
const enemiesMaxCount = 75 // 75
var enemiesStarting = 180 // 180
var activated_enemies = [true, true, false]
var frames = 0
const WIDTH = canvas.width, HEIGHT = canvas.height

const cursor = new (NewCursor())()

var player = new Player(context, WIDTH/2, HEIGHT/2, 2, 100, 10, resources.src.player, 21, cursor)
var coins = []
var enemies = []
var controls = []
var weapons = [new Weapon(context, WIDTH/2, HEIGHT/3, resources.src.weapon_2.center_params, resources.src.weapon_2, undefined, undefined,
                () => {}, .3, 50, 3),
                new Weapon(context, WIDTH/2+100, HEIGHT/3, resources.src.weapon_1.center_params, resources.src.weapon_1, undefined, undefined, () => {}, 0, 100),
                new Weapon(context, WIDTH/2+200, HEIGHT/3,
                    resources.src.weapon_3.center_params, resources.src.weapon_3,
                    undefined, undefined, () => {}, .1, 500, 20, .8, 8),
                new Shield(context, WIDTH/2-40, HEIGHT/3, resources.src.shield)]
var origin = ""
var startTime = performance.now()

window.addEventListener("keydown", (e) => {
    if (e.key == "w") {
        player.walking.y = 1
    } else if (e.key == "s") {
        player.walking.y = -1
    }
    if (e.key == "d") {
        player.walking.x = 1
    } else if (e.key == "a") {
        player.walking.x = -1
    }
    if (e.key == " ") {
        player.onAttack = true
    }
    if (e.key == "f") {
        console.log("origin >>>> "+origin)
        if (origin == "weapon") {
            console.log("origin triggered")
            weapons.every((elem, i) => {
                if (Math.sqrt((elem.x-player.x)**2 + (elem.y-player.y)**2) < player.sprites.size/2) {
                    if (!(elem instanceof Shield)) {
                        console.log("Weapon picked")
                        if (player.weapon) {
                            let drop = player.weapon
                            weapons.push(drop)
                            weapons[weapons.length-1].x = player.x
                            weapons[weapons.length-1].y = player.y
                            weapons[weapons.length-1].owner = null
                            weapons[weapons.length-1].angle = 0
                        }
                        elem.owner = player
                        player.weapon = elem
                        weapons.splice(i, 1)
                        return false
                    }
                }
                return true
            })
            origin = ""
        } else if (player.weapon) {
            console.log("Weapon dropped")
            let drop = player.weapon
            weapons.push(drop)
            weapons[weapons.length-1].x = player.x
            weapons[weapons.length-1].y = player.y
            weapons[weapons.length-1].owner = null
            weapons[weapons.length-1].angle = 0
            player.weapon = null
        }
        console.log(weapons)
    }
})

window.addEventListener("keyup", (e) => {
    if ("ws".includes(e.key)) {
        if (e.key == "w" && player.walking.y == 1) {
            player.walking.y = 0
        } else if (e.key == "s" && player.walking.y == -1) {
            player.walking.y = 0
        }
    }
    if ("ad".includes(e.key)) {
        if (e.key == "a" && player.walking.x == -1) {
            player.walking.x = 0
        } else if (e.key == "d" && player.walking.x == 1) {
            player.walking.x = 0
        }
    }
    if (e.key == " ") {
        player.onAttack = false
    }
})

canvas.addEventListener("mousemove", (e) => {
    cursor.offset = e
    if (player.weapon) {
        let angle = createAngle([e.offsetX, e.offsetY], [player.x+resources.src.player.size/2, player.y+player.center])
        player.weapon.angle = e.offsetY>(player.y+player.center)?angle:-angle
        if (e.offsetX<player.x+resources.src.player.size/2) {
            player.on_right = false
            player.weapon.angle += Math.PI
        } else {
            player.on_right = true
        }
    }
})

canvas.addEventListener("mousedown", (e) => {
    player.onAttack = true
})

canvas.addEventListener("mouseup", (e) => {
    player.onAttack = false
})

function render() {
    if (performance.now() - startTime > 1000 / FPS) {
        context.drawImage(resources.src.background.img, 0, 0, WIDTH, HEIGHT)
        let translation = 0
        if (player.onAttack && player.weapon && player.weapon.shakeVar) {
            player.weapon.shakeVar = false
            translation = Math.sin(performance.now())
        }
        context.translate(0, translation)
        if (player.weapon) {
            player.weapon.bullets.forEach(elem => {
                elem.render()
            })
        }
        let renderList = [...coins, ...enemies, ...weapons, player].sort((a, b) => {
            return a.y - b.y
        })
        context.globalAlpha = 0.2
        renderList.forEach((elem) => {
            if (["Coin", "Weapon"].includes(elem.__proto__.constructor.name)) {
                context.drawImage(resources.src.shadow.img, elem.x+(elem.sprites.size-34)/2, elem.y, 34, 36)
            } else {
                context.drawImage(resources.src.shadow.img, elem.x+(elem.sprites.size-34)/2, elem.y+elem.sprites.size-34, 34, 36)
            }
        })
        context.globalAlpha = 1
        renderList.forEach((elem) => {
            elem.render()
        })

        context.font = "20px monospace"; context.fillStyle = "white"
        context.drawImage(
            resources.src.coin.img, 0, 0, resources.src.coin.size, resources.src.coin.size, 5, 5, resources.src.coin.size, resources.src.coin.size
        )
        context.fillText(player.coins, resources.src.coin.size+10, resources.src.coin.size)
        context.fillText("HP", WIDTH-35-100, resources.src.coin.size)
        context.fillStyle = "#FF5B5B"
        context.fillRect(WIDTH-5-100, 5, 100, resources.src.coin.size)
        context.fillStyle = "#1AB911"
        context.fillRect(WIDTH-5-100, 5, Math.max(0, Math.floor(player.health.cur/player.health.max*100)), resources.src.coin.size)
        if (player.shield!=null) {
            context.font = "13px monospace";
            context.fillStyle = "white"
            context.fillText("ARM", WIDTH-35-100, resources.src.coin.size*1.75 + 2.5)
            context.fillStyle = "#939393"
            context.fillRect(WIDTH-5-100, 10 + resources.src.coin.size, 100, resources.src.coin.size/2)
            context.fillStyle = "#1192b9"
            context.fillRect(WIDTH-5-100, 10 + resources.src.coin.size, 
                Math.max(0, Math.floor(player.shield_health.cur/player.shield_health.max*100)), resources.src.coin.size/2)
        }
        controls.forEach((i) => i.render())
        frames++

        startTime = performance.now()

        context.translate(0, -translation)
        translation = 0
    }
}

function update() {
    if (Math.abs(player.walking.x)||Math.abs(player.walking.y)) {
        player.anim = Math.max(1, player.anim+.08)
    } else {player.anim=0}
    if (!player.is_alive) {
        gameOver = true
        gameStarted = false
    }
    player.coins_pick(coins)
    coins.forEach((c) => {
        c.anim = c.anim+.08>=resources.src.coin.count ? 0 : c.anim+.08
    })
    player.anim = player.anim>=resources.src.player.count ? 1 : player.anim
    player.health.cur = Math.min(player.health.max, player.health.cur+.03)
    player.walk()
    if (player.weapon && !gameOver) {
        gameStarted = true
    }
    if (player.weapon) {
        if (player.onAttack) {
            player.weapon.attack()
        }
        player.weapon.bullets = player.weapon.bullets.filter((elem) => {
            elem.move()
            if (elem.x < 0 || elem.x > WIDTH ||
                elem.y < 0 || elem.y > HEIGHT) {
                    return false
                }
            let hit = elem.attack(enemies)
            if (hit != false) {
                if (hit[0].attacked(elem)) {
                    if (hit[0].health.cur == 0) {
                        weapons = [...weapons, ...hit[0].die(coins)]
                        enemies.splice(hit[1], 1)
                    }
                    return false
                } else {
                    elem.angle = Math.PI - elem.angle
                }
            }
            return true
        })
    }
    controls.pop()
    origin = ""
    weapons.forEach((elem, i) => {
        if (Math.sqrt((elem.x-player.x)**2 + (elem.y-player.y)**2) < player.sprites.size/2) {
            if (!(elem instanceof Shield)) {
                if (!origin) {
                    origin = "weapon"
                    controls.push(new Control(context, elem.x+Math.floor(elem.sprites.size/2), elem.y-elem.sprites.sizeY, "F"))
                }
            } else if (elem instanceof Shield) {
                console.log("Shield picked")
                player.shield = elem.sprites
                player.shield_health.cur = 200
                weapons.splice(i, 1)
                origin = ""
            }
        }
    })
    if (gameStarted) {
        enemiesProceed()
    }
    if (player.coins == 10) {
        enemiesStarting = 100
    } else if (player.coins == 30) {
        enemiesStarting = 60
    } else if (player.coins == 80) {
        enemiesStarting = 40
    } else if (player.coins == 150) {
        enemiesStarting = 30
    } else if (player.coins == 300) {
        enemiesStarting = 20
    }
}

function enemiesProceed() {
    function spawn_en_1(side) {
        if (side == 0) {
            enemies.push(new Enemy(context, Math.floor(Math.random()*(2*resources.src.enemy_1.size+WIDTH)-resources.src.enemy_1.size),
                -resources.src.enemy_1.size, 1.5, 50, 10, resources.src.enemy_1))
        } else if (side == 1) {
            enemies.push(new Enemy(context, WIDTH,
                Math.floor(Math.random()*(2*resources.src.enemy_1.size+HEIGHT)-resources.src.enemy_1.size), 1.5, 50, 10, resources.src.enemy_1))
        } else if (side == 2) {
            enemies.push(new Enemy(context, Math.floor(Math.random()*(2*resources.src.enemy_1.size+WIDTH)-resources.src.enemy_1.size),
                HEIGHT, 1.5, 50, 10, resources.src.enemy_1))
        } else if (side == 3) {
            enemies.push(new Enemy(context, -resources.src.enemy_1.size,
                Math.floor(Math.random()*(2*resources.src.enemy_1.size+HEIGHT)-resources.src.enemy_1.size), 1.5, 50, 10, resources.src.enemy_1))
        }
    }

    function spawn_en_2(side) {
        if (side == 0) {
            enemies.push(new Enemy2(context, Math.floor(Math.random()*(2*resources.src.Enemy_2.size+WIDTH)-resources.src.Enemy_2.size),
                -resources.src.Enemy_2.size, 1, 100, 40, resources.src.Enemy_2, resources.src.shield))
        } else if (side == 1) {
            enemies.push(new Enemy2(context, WIDTH,
                Math.floor(Math.random()*(2*resources.src.Enemy_2.size+HEIGHT)-resources.src.Enemy_2.size),
                1, 100, 40, resources.src.Enemy_2, resources.src.shield))
        } else if (side == 2) {
            enemies.push(new Enemy2(context, Math.floor(Math.random()*(2*resources.src.enemy_1.size+WIDTH)-resources.src.Enemy_2.size),
                HEIGHT, 1, 100, 40, resources.src.Enemy_2, resources.src.shield))
        } else if (side == 3) {
            enemies.push(new Enemy2(context, -resources.src.Enemy_2.size,
                Math.floor(Math.random()*(2*resources.src.Enemy_2.size+HEIGHT)-resources.src.Enemy_2.size),
                1, 100, 40, resources.src.Enemy_2, resources.src.shield))
        }
    }

    function spawn_en_3(side) {}
 
    if (frames > enemiesStarting) {
        if (enemies.length < enemiesMaxCount) {
            let side = Math.floor(Math.random()*4)
            let type = Math.random()
            if (type < .2) {
                spawn_en_1(side)
            } else if (type < .9) {
                if (activated_enemies[1]) {
                    spawn_en_2(side)
                } else {
                    spawn_en_1(side)
                }
            } else {
                if (activated_enemies[2]) {
                    spawn_en_3(side)
                } else {
                    spawn_en_1(side)
                }
            }
        }

        frames = 0
    }

    enemies.forEach((e) => {
        e.attack(player)
        if (Math.abs(e.walking.x)||Math.abs(e.walking.y)) {
            e.anim = Math.max(1, e.anim+.08)
        } else {e.anim=0}
        e.anim = e.anim>=resources.src.enemy_1.count ? 1 : e.anim
    })
    for (let i = 0; i < enemies.length-1; i++) {
        for (let j = i+1; j < enemies.length; j++) {
            let delta = checkCollision(enemies[i], enemies[j])
            enemies[i].x += delta.dx/2
            enemies[i].y += delta.dy/2
            enemies[j].x += -delta.dx/2
            enemies[j].y += -delta.dy/2
        }
    }
}

var frame = () => {
    update()
    render()
    requestAnimationFrame(frame)
}

window.onload = () => {
    new Promise((resolve, reject) => resources.render()).then(frame())
}
