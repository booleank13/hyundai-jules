document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const GAME_DURATION = 3000; // 3 seconds
    const REPEL_DISTANCE = 120; // Distance to start running away
    const MAX_SPEED = 12; // Max pixels per frame
    const CONTAINER_WIDTH = 320;
    const CONTAINER_HEIGHT = 480;
    const CAR_WIDTH = 140; // Matches CSS
    const CAR_HEIGHT = 70; // Approx based on aspect ratio

    // Elements
    const sceneGame = document.getElementById('scene-game');
    const sceneMsg1 = document.getElementById('scene-msg1');
    const sceneEnd = document.getElementById('scene-end');
    const carContainer = document.getElementById('car-container');
    const hintText = document.getElementById('hint-text');

    // State
    let gameActive = false;
    let startTime = null;
    let carPos = { x: CONTAINER_WIDTH / 2, y: CONTAINER_HEIGHT / 2 };
    let carVel = { x: 0, y: 0 };
    let mousePos = { x: CONTAINER_WIDTH / 2, y: CONTAINER_HEIGHT / 2 };

    // Initialization
    function init() {
        gameActive = true;
        startTime = Date.now();
        requestAnimationFrame(gameLoop);

        // Setup input listeners
        document.addEventListener('mousemove', handleInput);
        document.addEventListener('touchmove', handleInput, { passive: false });
        document.addEventListener('touchstart', handleInput, { passive: false });

        // Timer to end game
        setTimeout(finishGame, GAME_DURATION);
    }

    function handleInput(e) {
        e.preventDefault();
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        // Adjust for container position (if embedded or centered)
        const rect = document.body.getBoundingClientRect();
        mousePos.x = clientX - rect.left;
        mousePos.y = clientY - rect.top;
    }

    function gameLoop() {
        if (!gameActive) return;

        // Physics Logic
        // Vector from mouse to car
        let dx = carPos.x - mousePos.x;
        let dy = carPos.y - mousePos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        // Repel force
        if (dist < REPEL_DISTANCE) {
            // Normalized direction away from mouse
            let dirX = dx / dist;
            let dirY = dy / dist;

            // Speed increases as distance decreases
            let speed = (REPEL_DISTANCE - dist) / REPEL_DISTANCE * MAX_SPEED;

            // Add some noise/jitter to make it unpredictable
            dirX += (Math.random() - 0.5) * 0.5;
            dirY += (Math.random() - 0.5) * 0.5;

            carVel.x += dirX * 2; // Acceleration
            carVel.y += dirY * 2;
        }

        // Friction
        carVel.x *= 0.9;
        carVel.y *= 0.9;

        // Update Position
        carPos.x += carVel.x;
        carPos.y += carVel.y;

        // Boundary Checks (Bounce)
        const margin = 20;
        let bounced = false;

        // Left
        if (carPos.x < CAR_WIDTH / 2 + margin) {
            carPos.x = CAR_WIDTH / 2 + margin;
            carVel.x = Math.abs(carVel.x) * 0.8; // Bounce with energy loss
            bounced = true;
        }
        // Right
        if (carPos.x > CONTAINER_WIDTH - CAR_WIDTH / 2 - margin) {
            carPos.x = CONTAINER_WIDTH - CAR_WIDTH / 2 - margin;
            carVel.x = -Math.abs(carVel.x) * 0.8;
            bounced = true;
        }
        // Top (keep below logo)
        if (carPos.y < CAR_HEIGHT / 2 + 60) {
            carPos.y = CAR_HEIGHT / 2 + 60;
            carVel.y = Math.abs(carVel.y) * 0.8;
            bounced = true;
        }
        // Bottom
        if (carPos.y > CONTAINER_HEIGHT - CAR_HEIGHT / 2 - margin) {
            carPos.y = CONTAINER_HEIGHT - CAR_HEIGHT / 2 - margin;
            carVel.y = -Math.abs(carVel.y) * 0.8;
            bounced = true;
        }

        // If caught in a corner or near wall and being chased, add a little extra push to escape
        if (bounced && dist < REPEL_DISTANCE) {
            // Find direction to center
            const toCenterX = (CONTAINER_WIDTH / 2) - carPos.x;
            const toCenterY = (CONTAINER_HEIGHT / 2) - carPos.y;
            const mag = Math.sqrt(toCenterX*toCenterX + toCenterY*toCenterY);

            // Push towards center
            carVel.x += (toCenterX / mag) * 5;
            carVel.y += (toCenterY / mag) * 5;
        }

        // Apply to element
        // We use translate(-50%, -50%) in CSS, so top/left should be center coordinates
        // But to make it easier with JS, we can just set top/left relative to container
        // Actually CSS has `top: 50%; left: 50%; transform: translate(-50%, -50%)`
        // So setting top/left to px values works perfectly if we update style.

        carContainer.style.left = `${carPos.x}px`;
        carContainer.style.top = `${carPos.y}px`;

        requestAnimationFrame(gameLoop);
    }

    function finishGame() {
        gameActive = false;

        // Transition to Scene 2
        switchScene(sceneGame, sceneMsg1);

        // Schedule Scene 3
        setTimeout(() => {
            switchScene(sceneMsg1, sceneEnd);
        }, 3000); // Show message 1 for 3 seconds
    }

    function switchScene(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    // Start
    init();
});
