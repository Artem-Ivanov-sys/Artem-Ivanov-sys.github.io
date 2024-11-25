export function checkCollision(obj1, obj2) {
    let delta = {dx: 0, dy: 0}  
    if (obj1.y>=obj2.y&&obj1.y<=obj2.y+obj2.sprites.size/2&&obj1.walking.y<=obj2.walking.y) {           // up side
        if ((obj1.x>=obj2.x&&obj1.x<=obj2.x+obj2.sprites.size/2)||
            (obj1.x+obj1.sprites.size/2>=obj2.x&&obj1.x+obj1.sprites.size/2<=obj2.x+obj2.sprites.size/2)) {
            if (Math.abs(obj1.y-obj2.y-obj2.sprites.size/2)<10) {
                if (Math.abs(delta.dx+delta.dy) < obj2.y + obj2.sprites.size/2 - obj1.y) {
                    delta.dy = (obj2.y + obj2.sprites.size/2 - obj1.y)
                }
            }
        }
    } if (obj1.y+obj1.sprites.size/2>=obj2.y&&obj1.y+obj1.sprites.size/2<=obj2.y+obj2.sprites.size/2&&
        obj1.walking.y>=obj2.walking.y) {    // down side
        if ((obj1.x>=obj2.x&&obj1.x<=obj2.x+obj2.sprites.size/2)||
            (obj1.x+obj1.sprites.size/2>=obj2.x&&obj1.x+obj1.sprites.size/2<=obj2.x+obj2.sprites.size/2)) {
            if (Math.abs(obj2.y-obj1.y-obj1.sprites.size/2)<10) {
                if (Math.abs(delta.dx+delta.dy) < obj1.y + obj1.sprites.size/2 - obj2.y) {
                    delta.dy = -(obj1.y + obj1.sprites.size/2 - obj2.y)
                }
            }
        }
    } if (obj1.x+obj1.sprites.size/2>=obj2.x&&obj1.x+obj1.sprites.size/2<=obj2.x+obj2.sprites.size/2&&
        obj1.walking.x>=obj2.walking.x) {    // right side
        if ((obj1.y>=obj2.y&&obj1.y<=obj2.y+obj2.sprites.size/2)||
            (obj1.y+obj1.sprites.size/2>=obj2.y&&obj1.y+obj1.sprites.size/2<=obj2.y+obj2.sprites.size/2)) {
            if (Math.abs(obj2.x-obj1.x-obj1.sprites.size/2)<10) {
                if (Math.abs(delta.dx+delta.dy) < obj1.x + obj1.sprites.size/2 - obj2.x) {
                    delta.dx = -(obj1.x + obj1.sprites.size/2 - obj2.x)
                }
            }
        }
    } if (obj1.x<=obj2.x+obj2.sprites.size/2&&obj1.x>=obj2.x&&obj1.walking.x<=obj2.walking.x) {    // left side
        if ((obj1.y>=obj2.y&&obj1.y<=obj2.y+obj2.sprites.size/2)||
            (obj1.y+obj1.sprites.size/2>=obj2.y&&obj1.y+obj1.sprites.size/2<=obj2.y+obj2.sprites.size/2)) {
            if (Math.abs(obj1.x-obj2.x-obj2.sprites.size/2)<10) {
                if (Math.abs(delta.dx+delta.dy) < obj2.x + obj2.sprites.size/2 - obj1.x) {
                    delta.dx = (obj2.x + obj2.sprites.size/2 - obj1.x)
                }
            }
        }
    }
    return delta
}