const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let dog, dogImg;
let dogFrames = {
    idle: [],
    walk: [],
    jump: []
};
let currentFrame = 0;
let keys = { left: false, right: false, up: false };

canvas.width = 800;
canvas.height = 400;

startBtn.addEventListener('click', startGame);

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    dogImg = new Image();
    dogImg.src = 'pekingese_sprite.png'; // Replace with your sprite sheet path

    dogImg.onload = () => {
        // Assume sprite sheet has 4 idle frames, 4 walk frames, and 2 jump frames (adjust as needed)
        dogFrames.idle = [0, 1, 2, 3]; // Example frame indices
        dogFrames.walk = [4, 5, 6, 7];
        dogFrames.jump = [8, 9];

        dog = {
            x: 50,
            y: canvas.height - 100,
            width: 50,
            height: 50,
            speed: 5,
            jumpPower: 15,
            velocity: 0,
            onGround: false,
            currentAnimation: 'idle',
            frameIndex: 0
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        updateGameArea();
    };
}

function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') keys.left = true;
    if (event.key === 'ArrowRight') keys.right = true;
    if (event.key === ' ' && dog.onGround) dog.velocity = -dog.jumpPower;
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft') keys.left = false;
    if (event.key === 'ArrowRight') keys.right = false;
}

function updateGameArea() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update dog animation
    if (keys.left || keys.right) {
        dog.currentAnimation = 'walk';
    } else if (dog.velocity < 0) {
        dog.currentAnimation = 'jump';
    } else {
        dog.currentAnimation = 'idle';
    }

    // Update dog movement
    if (keys.left && dog.x > 0) dog.x -= dog.speed;
    if (keys.right && dog.x < canvas.width - dog.width) dog.x += dog.speed;

    // Jumping and Gravity
    dog.y += dog.velocity;
    if (dog.y + dog.height > canvas.height) {
        dog.y = canvas.height - dog.height;
        dog.velocity = 0;
        dog.onGround = true;
    } else {
        dog.velocity += 1; // gravity
        dog.onGround = false;
    }

    // Draw dog with correct animation
    const frames = dogFrames[dog.currentAnimation];
    dog.frameIndex = (dog.frameIndex + 1) % frames.length;
    const frameX = frames[dog.frameIndex] * 50; // Assuming each frame is 50px wide
    ctx.drawImage(dogImg, frameX, 0, 50, 50, dog.x, dog.y, dog.width, dog.height);

    requestAnimationFrame(updateGameArea);
}
