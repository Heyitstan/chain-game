// 1. Data Setup
const wordChains = [
  ["HOT", "DOG", "HOUSE", "BOAT"],
  ["PAPER", "PLANE", "TICKET", "OFFICE"],
  ["ICE", "CREAM", "SODA", "POP"],
  ["RAIN", "BOW", "TIE", "BREAKER"],
  ["SWIMMING", "POOL", "TABLE", "TENNIS"],
  ["CREDIT", "CARD", "GAME", "NIGHT"],
  ["CHOP", "STICK", "FIGURE", "SKATER"],
  ["BOOK", "SHELF", "LIFE", "GUARD"]
]

let shuffledChains = [...wordChains].sort(() => Math.random() - 0.5);
let chainIndex = 0;
let gameData = shuffledChains[chainIndex];
let currentTargetIndex = 1; 
let revealedCount = 1;
let timeLeft = 60;
let timerInterval;

function resetGame() {
  console.log("Resetting game...");
  // Update the global gameData variable (remove 'const' from inside here)
  chainIndex++;
  document.getElementById('record-message').innerText = '';

  if (chainIndex >= shuffledChains.length) {
    shuffledChains = [...wordChains].sort(() => Math.random() - 0.5);
    chainIndex = 0;
  }
  gameData = shuffledChains[chainIndex];

  // 2. Reset game state variables
  currentTargetIndex = 1;
  revealedCount = 1;
  timeLeft = 60;

  // 3. Update UI
  document.getElementById('end-screen').style.display = 'none';
  document.getElementById('guess-input').disabled = false;
  document.getElementById('guess-input').value = '';
  
  // 4. Restart the logic
  renderBoard();
  startTimer();
  document.getElementById('guess-input').focus();
}

// 2. The functions that control the UI
function renderBoard() {
    const board = document.getElementById('game-board');
    if (!board) {
        console.error("Could not find game-board element!");
        return;
    }

    board.innerHTML = ''; // Clear previous content
    
    gameData.forEach((word, index) => {
        const div = document.createElement('div');
        div.className = 'word-row';

        const isInvisible = 
          index === 0 ||
          index === gameData.length - 1 ||
          Math.abs(index - currentTargetIndex) <= 1;

        if (!isInvisible) {
          return;
        }
        
        if (index === 0 || index === gameData.length - 1 || index < currentTargetIndex) {
            // Words the player has already solved or the start/end hints
            div.innerText = word;
        } else if (index === currentTargetIndex) {
            // The word the player is currently guessing
            div.classList.add('hidden-word');
            // Show revealed letters and underscores for the rest
            const displayed = word.substring(0, revealedCount);
            const hidden = "_".repeat(word.length - revealedCount);
            div.innerText = displayed + hidden;

            setTimeout(() => {
              div.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        } else {
            // Words further down the chain that aren't reachable yet
            div.innerText = "???";
        }
        board.appendChild(div);
    });
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;

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
        
        if (timeLeft <= 10) {
          timerDisplay.classList.add('low-time');
        } else {
          timerDisplay.classList.remove('low-time');
        }
      }
  }, 1000);
}

function showEndScreen(title, message) {
    clearInterval(timerInterval);
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'flex';

    document.getElementById('end-screen').style.display = 'flex';
    document.getElementById('end-title').innerText = title;
    document.getElementById('end-message').innerText = message;
    document.getElementById('guess-input').blur();

    if (title === "Congratulations!") {
      console.log("Triggering confetti animation...");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3498db', '#27ae60', '#f1c40f'],
      });
    }
  }

// 3. The "Initialization" - This waits for the HTML to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Loaded. Initializing Game...");
    
    const input = document.getElementById('guess-input');
    const startBtn = document.getElementById('start-button');
    const overlay = document.getElementById('overlay');
    const endScreen = document.getElementById('end-screen');

    overlay.style.display = 'flex';
    endScreen.style.display = 'none';

    // Initial draw
    renderBoard();
    updateBestTimeDisplay();

    // Start button logic
    startBtn.addEventListener('click', () => {
        console.log("Starting game...");
        overlay.style.display = 'none';
        timeLeft = 60;
        startTimer();
        input.focus();
    });

    // Listen for guesses
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const guess = input.value.toUpperCase().trim();
            const actual = gameData[currentTargetIndex];

            if (guess === actual) {
                // Correct! Move to next word
                currentTargetIndex++;
                revealedCount = 1;
                
                // Check if they finished the list
                if (currentTargetIndex === gameData.length - 1) {
                    renderBoard();
                    clearInterval(timerInterval);

                    const previousBest = localStorage.getItem('bestTime');
                    let recordText = "";
                    
                    if (!previousBest || timeLeft > parseInt(previousBest)) {
                      localStorage.setItem('bestTime', timeLeft);
                      recordText = "New Personal Best!";
                      updateBestTimeDisplay();
                    }
                    document.getElementById('record-message').innerText = recordText;
                    showEndScreen("Congratulations!", `You've completed the word chain with ${timeLeft}s left!`)
                    return;
                }
            } else {
                // Wrong! Reveal a letter and penalize time
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
                if (revealedCount < actual.length) {
                    revealedCount++;
                }
                timeLeft = Math.max(0, timeLeft - 5);
            }
            
            input.value = ''; // Clear input box
            renderBoard();    // Redraw the list
        }
    });
});

function updateBestTimeDisplay() {
  const bestTime = localStorage.getItem('bestTime');
  const display = document.getElementById('best-time-display');
  if (bestTime) {
    display.innerText = `Best Time: ${bestTime}s left`;
  } else {
    display.innerText = 'Best Time: No Record yet';
  }
}

updateBestTimeDisplay();