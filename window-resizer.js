
function Resize(event) {
    var block = document.getElementsByClassName("wrapper")[0],
        blockWidth = block.offsetWidth,
        blockHeight = block.offsetHeight,
        windowWidth = window.innerWidth * 0.95,
        windowHeight = window.innerHeight * .95
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
