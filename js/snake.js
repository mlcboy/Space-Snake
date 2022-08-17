class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{x:this.x, y:this.y}]
        this.rotateX = 0
        this.nextRotateX = 0
        this.rotateY = 0
        this.nextRotateY = 1
    }

    move() {
        var newRect;
        if(this.nextRotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }
        else if(this.nextRotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        }
        else if(this.nextRotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        }
        else if(this.nextRotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }
        snake.rotateX = snake.nextRotateX;
        snake.rotateY = snake.nextRotateY;
        this.tail.shift()
        this.tail.push(newRect)
    }
}

class Apple {
    constructor() {
        var isTouching;
        while(true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            for(var i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }
            this.color = "red"
            this.size = snake.size
            if (!isTouching) {
                break;
            }
        }
    }
}

class Star {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.s = Math.random() * 2;
        this.ang = Math.random() * 2 * Math.PI;
        this.v = (this.s * this.s) / 4;
    }

    moveStar() {
        this.x += this.v * Math.cos(this.ang);
        this.y += this.v * Math.sin(this.ang);
        this.and += (Math.random() * 20 * Math.PI) / 180 - (10 * Math.PI) / 180;
    }

    showStar() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
        canvasContext.fillStyle = "#fddba3";
        canvasContext.fill();
    }
}

var context = document.getElementById("canvas")
var canvasContext = canvas.getContext('2d')
var pause = document.getElementById('paused')
var gameOver = document.querySelector('.game-over')
var start = document.getElementById('start')
var score = document.getElementById('score');
var highscore = localStorage.getItem("highscore");
document.getElementById('highscore').innerHTML = localStorage.getItem("highscore");

var snake = new Snake(20, 20, 20);
var apple = new Apple();
var isPaused = false;

//audio files
let eatSound = new Audio();
let deathSound = new Audio();
let startSound = new Audio();
let music = new Audio();
eatSound.src = './audio/eat.mp3';
deathSound.src = './audio/death.mp3';
startSound.src = './audio/start.mp3';
music.src = './audio/music.mp3';


window.onload = () => {
    gameLoop();
}

var started = false;
function startGame() {
    window.addEventListener("keydown", (event) => {
        setTimeout(()=> {
            if (event.keyCode == 32 && !started) {
                startSound.play();
                start.style.opacity = 0;
                started = true;
            }
        }, 1)
    })
}

function gameLoop() {
    const gameInterval = setInterval(show, 1000/15)
}

function starLoop() {
    window.requestAnimationFrame(starLoop);
    drawStars();
}

function show() {
    music.play();
    if (started) {
        update();
    }
    console.log(startGame()); //line needed
    draw();
    drawStars();
}

function update() {
    if (!isPaused) {
        if (checkHitSelf() || checkHitWall()) {isGameOver(); return;}
        music.play()
        snake.move()
        eatApple()
        checkHitWall()
        checkHitSelf()
    }
}


function isGameOver() {
    if (Number(score.innerHTML) > Number(highscore)) {
        highscore = score.innerHTML;
        localStorage.setItem("highscore", highscore);
    }
    deathSound.play();
    setTimeout(function() {
        document.location.reload();
        clearInterval(gameLoop);
    }, 1900)
    setTimeout(function() {gameOver.style.opacity = '1';}, 150);
}


function checkHitSelf() {
    var headTail = snake.tail[snake.tail.length - 1]
    for (var i = 0; i < snake.tail.length - 2; i++) {
        let snakeBody = this.snake.tail[i];
        if (snakeBody.x == headTail.x && snakeBody.y == headTail.y) {
            return true;
        }
    }
}

function checkHitWall() {
    var headTail = snake.tail[snake.tail.length - 1]
    if (headTail.x < 0 || headTail.x == canvas.width ||
        headTail.y < 0 || headTail.y == canvas.height) {
            return true;
    }
}

function eatApple() {
    if (snake.tail[snake.tail.length - 1].x == apple.x  &&
        snake.tail[snake.tail.length - 1].y == apple.y) {
            eatSound.play();
            snake.tail[snake.tail.length] = {x: apple.x, y: apple.y}
            apple = new Apple();
        }
}

function draw() {
    score.innerText = snake.tail.length - 1;   
    createRect(0, 0, canvas.width, canvas.height, "black")
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
    for (var i = 0; i < snake.tail.length; i++) {
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
            snake.size - 5, snake.size - 5, '#03fc1c')
    }
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

w = canvas.width;
h = canvas.height;

let stars = [];
function drawStars() {
    if (stars.length < 100) {
        for (let j = 0; j < 10; j++) {
            stars.push(new Star());
        }
    }

    //animation
    for (let i = 0; i < stars.length; i++) {
        stars[i].moveStar();
        stars[i].showStar();
        if (stars[i].x < 0 || stars[i].x > w || stars[i].y > h || stars[i].y < 0) {
            stars.splice(i, 1);
        }
    }
}
starLoop();
setInterval(starLoop, 1000/100);

window.requestAnimationFrame = function () {
    return (
        window.requestAnimationFrame || 
        function (callback) {
            window.setTimeout(callback);
        }
    );
};

window.addEventListener("keydown", (event) => {
    setTimeout(()=> {
        //left
        if ((event.keyCode == 37  || event.keyCode == 65) && snake.rotateX != 1) {
            snake.nextRotateX = -1
            snake.nextRotateY = 0;
        }
        //right
        else if ((event.keyCode == 39  || event.keyCode == 68) && snake.rotateX != -1) {
            snake.nextRotateX = 1
            snake.nextRotateY = 0;
        }
        //up
        else if ((event.keyCode == 38 || event.keyCode == 87) && snake.rotateY != 1) {
            snake.nextRotateX = 0
            snake.nextRotateY = -1;
        }
        //down
        else if ((event.keyCode == 40 || event.keyCode == 83) && snake.rotateY != -1) {
            snake.nextRotateX = 0
            snake.nextRotateY = 1;
        }
        //pause
        else if (event.keyCode == 80 && !isPaused) {
            isPaused = true;
            pause.style.opacity = '1';
        }
        else if (event.keyCode == 80 && isPaused) {
            isPaused = false;
            pause.style.opacity = '0';
        }
    }, 1)
})

window.addEventListener('resize', function() {
    (w = canvas.width),
    (h = canvas.height);
    starLoop();
});


