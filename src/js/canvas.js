import platform from "../img/platform.png"
import hills from "../img/hills.png"
import background from "../img/background.png"
import platformSmallTall from "../img/platformSmallTall.png"

import spriteRunLeft from "../img/spriteRunLeft.png"
import spriteRunRight from "../img/spriteRunRight.png"
import spriteStandLeft from "../img/spriteStandLeft.png"
import spriteStandRight from "../img/spriteStandRight.png"

console.log(platform)
const canvas = document.querySelector('#my-canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


const gravity = .5


class Player {
    constructor() {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0

        }
        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0

        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875

            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        //     c.fillStyle = "red"
        //     c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right ||
            this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0
        } else if (this.frames > 29 &&
            (this.currentSprite === this.sprites.run.right ||
                this.currentSprite === this.sprites.run.left)) {

            this.frames = 0
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.draw()

        if (this.position.y + this.height + player.velocity.y <= canvas.height) {

            this.velocity.y += gravity
        }
        // else {
        //     this.velocity.y = 0
        // }
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
            image
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }


    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y,
            image
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }


    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}


function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc

    return image

}

let platformImage = createImage(platform)
let player = new Player()
let platforms = []
let genericObject = []
let platformSmallTallImage = createImage(platformSmallTall)
let lastKey 
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: { pressed: false }

}

let scrollOffset = 0

function init() {

    platformImage = createImage(platform)
    player = new Player()
    platforms = [
        new Platform({ x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, y: 270, image: platformSmallTallImage }),
        new Platform({ x: -1, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 2 + 100, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 3 + 300, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 4 + 300 - 2, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 5 + 700 - 2, y: 470, image: platformImage }),
    ]
    genericObject = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(background)
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage(hills)
        })
    ]


    scrollOffset = 0
}

player.draw()

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObject.forEach((genericObject) => {
        genericObject.draw()
    })
    platforms.forEach(platform => {
        platform.draw()

    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 & player.position.x > 0) {
        player.velocity.x = -player.speed

    } else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(platform => {
                platform.position.x -= 5

            })
            genericObject.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed

            })
            genericObject.forEach(genericObject => {
                genericObject.position.x += player.speed * .66
            })
        }

    }

    console.log(scrollOffset)
    platforms.forEach(platform => {
        //platform collisium
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }

    })

    // sprite switching 
    if (keys.right.pressed&&lastKey === "right" && player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if (keys.left.pressed&&lastKey ==='left'&& player.currentSprite!==player.sprites.run.left){
        player.frames =1
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }
    else if (!keys.left.pressed&&lastKey ==='left'&& player.currentSprite!==player.sprites.stand.left){
        player.frames =1
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }
    else if (!keys.right.pressed&&lastKey ==='right'&& player.currentSprite!==player.sprites.stand.right){
        player.frames =1
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // win condition
    if (scrollOffset > platformImage.width * 5 + 300 - 2) {
        console.log("you win")
    }
    // lose condition
    if (player.position.y >= canvas.height) {
        console.log("you lose")
        init()
    }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    // console.log(keyCode)

    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = true
            lastKey ='left'

            break
        case 83:
            console.log("down")
            break

        case 68:
            console.log("right")
            keys.right.pressed = true
           lastKey = 'right'
            break

        case 87:
            player.velocity.y = -15;

            break;
    }

})
addEventListener('keyup', ({ keyCode }) => {
    // console.log(keyCode)

    switch (keyCode) {
        case 65:
            console.log("left")
            keys.left.pressed = false
            break
        case 83:
            console.log("down")
            break

        case 68:
            console.log("right")
            keys.right.pressed = false

            break

        case 87:
            console.log("up")

            keys.up.pressed = false;



            break

    }

})