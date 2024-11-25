import { ObjectTime } from "./ObjectTime.js"

export class Control extends ObjectTime {
    constructor(master_root, x, y, name) {
        super()
        this.master_root = master_root
        this.x = x
        this.y = y
        this.name = name
    }

    render() {
        this.master_root.fillStyle = "#777"
        this.master_root.fillRect(this.x-10, this.y-10, 20, 20)
        this.master_root.fillStyle = "#bbb"
        this.master_root.fillRect(this.x-8, this.y-8, 16, 16)
        this.master_root.fillStyle = "#000"
        this.master_root.font = "14px monospace"
        this.master_root.fillText(this.name, this.x-3, this.y+3)
    }
}