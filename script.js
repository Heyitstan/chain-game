// 1. Data Setup
const wordChains = [
  // Key board, Board walk, Walk way, Way side, Side kick, Kick ball, Ball pit
  ["KEY", "BOARD", "WALK", "WAY", "SIDE", "KICK", "BALL", "PIT"],
  ["FIRE", "FIGHTER", "JET", "ENGINE", "ROOM", "SERVICE", "ANIMAL", "CRACKER"],
  ["SCHOOL", "BUS", "DRIVER", "LICENSE", "PLATE", "NUMBER", "ONE", "DIRECTION"],
  ["Dragon", "FRUIT", "SALAD", "DRESSING", "ROOM", "SERVICE", "ANIMAL", "KINGDOM"],
  ["MOVIE", "STAR", "FISH", "TANK", "TOP", "SECRET", "MISSION", "IMPOSSIBLE"],
  ["GOOD", "NIGHT", "LIGHT", "HOUSE", "WORK", "OUT", "POST", "OFFICE"],
  ["SLOW", "MOTION", "PICTURE", "FRAME", "WORK", "BENCH", "MARK", "DOWN"],
  ["AIM", "HIGH", "SCHOOL", "BUS", "STOP", "WATCH", "DOG", "HOUSE"],
  ["MICHAEL", "JORDAN", "RIVER", "BANK", "NOTE", "BOOK", "CASE", "STUDY"],
  ["BELLY", "BUTTON", "DOWN", "TOWN", "HALL", "MARK", "UP", "SIDE"],
  ["MONSTER", "TRUCK", "STOP", "LIGHT", "YEAR", "BOOK", "MARK", "DOWN"],
  ["SOUR", "DOUGH", "NUT", "SHELL", "SHOCK", "WAVE", "LENGTH", "WISE"]
];

let shuffledChains = [...wordChains].sort(() => Math.random() - 0.5);
let chainIndex = 0;
let gameData = shuffledChains[chainIndex];
let currentTargetIndex = 1; 
let revealedCount = 1;
let timeLeft = 60;
let timerInterval;

// --- CORE GAME FUNCTIONS ---

function renderBoard() {
    const board = document.getElementById('game-board');
    if (!board) return;
    board.innerHTML = ''; 
    
    gameData.forEach((word, index) => {
        const div = document.createElement('div');
        div.className = 'word-row';
        
        if (index === currentTargetIndex) {
            div.classList.add('active-guess-row');
            div.id = 'active-word-row';
            
            // 1. Create the visual slots
            word.split('').forEach((char, charIndex) => {
                const slot = document.createElement('div');
                slot.className = "letter-slot";
                slot.id = `slot-${charIndex}`;

                // If it's within the revealed hint range, show the hint initially
                if (charIndex < revealedCount) {
                    slot.innerText = char;
                    slot.classList.add('hint-slot');
                } else {
                    slot.innerText = "";
                }
                div.appendChild(slot);
            });

            // 2. Create the hidden master input
            const masterInput = document.createElement('input');
            masterInput.type = "text";
            masterInput.id = "master-input";
            masterInput.className = "master-input";
            masterInput.maxLength = word.length;
            masterInput.setAttribute('autocomplete', 'off');
            masterInput.setAttribute('autocorrect', 'off');
            masterInput.setAttribute('spellcheck', 'false');
            
            // Input starts EMPTY so user types from the first box
            masterInput.value = "";

            masterInput.addEventListener('input', (e) => {
                const val = e.target.value.toUpperCase();

                word.split('').forEach((originalChar, i) => {
                    const slot = document.getElementById(`slot-${i}`);
                    const userChar = val[i];

                    if (userChar) {
                        // User has typed something for this slot
                        slot.innerText = userChar;
                        slot.classList.add('filled');
                        // Optional: remove hint styling if user is "overwriting" it
                        slot.classList.remove('hint-slot');
                    } else {
                        // Slot is empty - show hint if it's in the hint range
                        if (i < revealedCount) {
                            slot.innerText = originalChar;
                            slot.classList.add('hint-slot');
                            slot.classList.remove('filled');
                        } else {
                            slot.innerText = "";
                            slot.classList.remove('filled');
                        }
                    }
                });
            });

            masterInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const fullGuess = masterInput.value.toUpperCase();
                    
                    if (fullGuess === word) {
                        currentTargetIndex++;
                        revealedCount = 1;
                        renderBoard();
                        if (currentTargetIndex === gameData.length - 1) handleWin();
                    } else {
                        div.classList.add('shake');
                        setTimeout(() => {
                            div.classList.remove('shake');
                            timeLeft = Math.max(0, timeLeft - 5);
                            revealedCount++; 
                            renderBoard(); 
                        }, 500);
                    }
                }
            });

            div.appendChild(masterInput);
        } else {
            const isVisible = (index === 0 || index === gameData.length - 1 || index < currentTargetIndex);
            div.innerText = isVisible ? word : "???";
            if (index < currentTargetIndex) div.classList.add('solved-word');
            if (index === 0) div.classList.add('start-word');
        }
        board.appendChild(div);
    });

    setTimeout(() => {
        const master = document.getElementById('master-input');
        if (master) master.focus();
        scrollToActiveWord();
    }, 50);
}

// --- SYSTEM FUNCTIONS ---

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showEndScreen("Time's up!", "Better luck next time.");
            return;
        }
        timeLeft--;
        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.innerText = `Time: ${timeLeft}s`;
            if (timeLeft <= 10) timerDisplay.classList.add('low-time');
            else timerDisplay.classList.remove('low-time');
        }
    }, 1000);
}

function resetGame() {
    chainIndex = (chainIndex + 1) % shuffledChains.length;
    gameData = shuffledChains[chainIndex];
    currentTargetIndex = 1;
    revealedCount = 1;
    timeLeft = 60;
    document.getElementById('end-screen').style.display = 'none';
    document.getElementById('record-message').innerText = '';
    renderBoard();
    startTimer();
}

function handleWin() {
    clearInterval(timerInterval);
    const previousBest = localStorage.getItem('bestTime');
    let recordText = "";
    if(!previousBest || timeLeft > parseInt(previousBest)) {
        localStorage.setItem('bestTime', timeLeft);
        recordText = "New Personal Best!";
        updateBestTimeDisplay();
    }
    document.getElementById('record-message').innerText = recordText;
    showEndScreen("Congratulations!", `Chain complete with ${timeLeft}s left!`);
}

function showEndScreen(title, message) {
    const endTitle = document.getElementById('end-title');
    const endMessage = document.getElementById('end-message'); // Get the message element
    
    document.getElementById('end-screen').style.display = 'flex';

    // 1. Handle the Title (Your existing logic)
    if (title === "Congratulations!") {
        endTitle.innerHTML = title.split('').map((char, i) => {
            return `<span style="--i:${i}">${char}</span>`;
        }).join('');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
        endTitle.innerText = title;
    }

    endMessage.innerHTML = message;
}

function scrollToActiveWord() {
    const activeRow = document.getElementById('active-word-row');
    const board = document.getElementById('game-board');
    const timer = document.getElementById('timer-display');
    
    if (!activeRow || !board) return;

    // 1. Get the word above the active one (the "Context")
    const contextRow = activeRow.previousElementSibling;
    // We want to scroll to the context row, unless the timer is the only thing above it
    const targetRow = (contextRow && contextRow !== timer) ? contextRow : activeRow;

    // 2. Calculate the "Sticky Gap" (how much space the timer takes up)
    const stickyHeight = timer ? timer.offsetHeight : 0;

    // 3. Calculate distance
    // targetRect.top is distance from top of viewport
    // boardRect.top is distance from top of game container
    const targetRect = targetRow.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const scrollTarget = (targetRect.top - boardRect.top) + board.scrollTop - stickyHeight - 10;

    // 4. Perform the scroll
    board.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
    });
}

function updateBestTimeDisplay() {
    const bestTime = localStorage.getItem('bestTime');
    const display = document.getElementById('best-time-display');
    if (display) display.innerText = bestTime ? `Best Time: ${bestTime}s left` : 'Best Time: --';
}

document.addEventListener('DOMContentLoaded', () => {
    updateBestTimeDisplay();
    document.getElementById('start-button').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        startTimer();
        renderBoard();
    });
});