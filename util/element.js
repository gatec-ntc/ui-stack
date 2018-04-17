
export function getElementX(el) {

    var xPos = el.offsetLeft
    var parentElement = el.offsetParent

    while (parentElement) {
        xPos += parentElement.offsetLeft
        parentElement = parentElement.offsetParent
    }

    return xPos
}

export function getElementY(el) {

    var yPos = el.offsetTop
    var parentElement = el.offsetParent

    while (parentElement) {
        yPos += parentElement.offsetTop
        parentElement = parentElement.offsetParent
    }

    return yPos
}

export function getElementRightX(el, elementX = getElementX(el)) {
    return elementX + el.offsetWidth
}

export function getElementBottomY(el, elementY = getElementY(el)) {
    return elementY + el.offsetHeight
}

export function isOncreenX(x) {
    return x >= 0 && x <= window.innerWidth
}

export function isOncreenY(y) {
    return y >= 0 && y <= window.innerHeight
}
