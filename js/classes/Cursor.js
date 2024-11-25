export function NewCursor() {
    let _offset = {x: 0, y: 0}
    return class Cursor {
        constructor() {}
        get offset() {
            return _offset
        }
        set offset(e) {
            _offset = {
                x: e.offsetX,
                y: e.offsetY
            }
        }
    }
}