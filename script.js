// Game variables
let gameSequence = [];
let playerSequence = [];
let round = 0;
let maxRounds = 5;
let isPlayerTurn = false;
let gameStarted = false;

// Get DOM elements
const startBtn = document.getElementById('start-btn');
const status = document.getElementById('status');
const roundInfo = document.getElementById('round-info');
const title = document.getElementById('title');
const pads = document.querySelectorAll('.pad');

// Colors array
const colors = ['red', 'green', 'blue', 'yellow'];

// Event listeners
startBtn.addEventListener('click', startGame);
pads.forEach(pad => {
    pad.addEventListener('click', handlePadClick);
});

// Start the game
function startGame() {
    gameSequence = [];
    playerSequence = [];
    round = 0;
    gameStarted = true;
    isPlayerTurn = false;
    
    startBtn.classList.add('hidden');
    status.classList.remove('hidden');
    roundInfo.classList.remove('hidden');
    
    nextRound();
}

// Start next round
function nextRound() {
    round++;
    playerSequence = [];
    isPlayerTurn = false;
    
    // Add random color to sequence
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    
    // Update display
    roundInfo.textContent = `Round ${round} of ${maxRounds}`;
    status.textContent = "Watch the sequence...";
    
    // Disable pads during computer turn
    disablePads();
    
    // Play the sequence
    setTimeout(() => {
        playSequence();
    }, 1000);
}

// Play the computer sequence
function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i < gameSequence.length) {
            activatePad(gameSequence[i]);
            i++;
        } else {
            clearInterval(interval);
            // Start player turn
            setTimeout(() => {
                isPlayerTurn = true;
                status.textContent = `Your turn! Click ${gameSequence.length} pad${gameSequence.length > 1 ? 's' : ''}`;
                enablePads();
            }, 500);
        }
    }, 600);
}

// Handle pad clicks
function handlePadClick(event) {
    if (!isPlayerTurn || !gameStarted) return;
    
    const clickedColor = event.target.dataset.color;
    playerSequence.push(clickedColor);
    
    // Activate the clicked pad
    activatePad(clickedColor);
    
    // Check if the click is correct
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
        // Wrong click - game over
        gameOver(false);
        return;
    }
    
    // Check if player completed the sequence
    if (playerSequence.length === gameSequence.length) {
        isPlayerTurn = false;
        disablePads();
        
        if (round === maxRounds) {
            // Player won!
            gameOver(true);
        } else {
            // Next round
            status.textContent = "Correct! Next round coming...";
            setTimeout(() => {
                nextRound();
            }, 1500);
        }
    } else {
        // Update status with remaining clicks
        const remaining = gameSequence.length - playerSequence.length;
        status.textContent = `Your turn! ${remaining} more click${remaining > 1 ? 's' : ''}`;
    }
}

// Activate a pad (visual feedback)
function activatePad(color) {
    const pad = document.querySelector(`[data-color="${color}"]`);
    pad.classList.add('active');
    
    setTimeout(() => {
        pad.classList.remove('active');
    }, 300);
}

// Enable pads for clicking
function enablePads() {
    pads.forEach(pad => {
        pad.classList.remove('disabled');
    });
}

// Disable pads
function disablePads() {
    pads.forEach(pad => {
        pad.classList.add('disabled');
    });
}

// Game over
function gameOver(won) {
    gameStarted = false;
    isPlayerTurn = false;
    disablePads();
    
    if (won) {
        status.textContent = "🎉 You Won! Great memory!";
        title.textContent = "You Win!";
        document.querySelector('.game-container').classList.add('game-won');
    } else {
        status.textContent = "❌ Game Over! Try again?";
        title.textContent = "Game Over";
        document.querySelector('.game-container').classList.add('game-over');
    }
    
    // Show restart button
    setTimeout(() => {
        resetGame();
    }, 3000);
}

// Reset the game
function resetGame() {
    gameSequence = [];
    playerSequence = [];
    round = 0;
    gameStarted = false;
    isPlayerTurn = false;
    
    title.textContent = "Simon Says";
    status.classList.add('hidden');
    roundInfo.classList.add('hidden');
    startBtn.classList.remove('hidden');
    
    document.querySelector('.game-container').classList.remove('game-over', 'game-won');
    enablePads();
}
