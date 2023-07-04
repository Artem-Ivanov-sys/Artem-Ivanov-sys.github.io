
function Resize(event) {
    var block = document.getElementsByClassName("wrapper")[0],
        blockWidth = block.offsetWidth,
        blockHeight = block.offsetHeight,
        windowWidth = window.innerWidth * 5 / 6,
        windowHeight = window.innerHeight * 5 / 6
    if (block) {
        var scaleX = blockWidth / windowWidth, scaleY = blockHeight / windowHeight
        if (scaleX > scaleY) {
            block.style.transform = "scale(" + 1 / scaleX + ")"
        }
        else {
            block.style.transform = "scale(" + 1 / scaleY + ")"
        }
    }
}

window.addEventListener("resize", (e) => Resize(e))

Resize()
