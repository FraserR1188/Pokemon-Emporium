//Code for help modal
var modal = document.getElementById("help-modal");
var btn = document.getElementById("help-button");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var cardList = [
    "bulbasaur",
    "charizard",
    "fuecoco",
    "gardevoir",
    "gengar",
    "hitmonlee",
    "machamp",
    "mewtwo",
    "pidgeotto",
    "pikachu"
]

//these variables are for creating the board
var cardSet;
var board = [];
var rows = 4;
var columns = 5;

//these variables are for selecting the cards themselves
var card1Selected;
var card2Selected;

//these variables are for the timer/time to beat
var timer; // To store the interval
var timerStarted = false; // Flag to start the timer on the first flip
var elapsedTime = 0; //track time elapsed in seconds
var bestTime = null ; //retrieves best time if available
var matches = 0; // Variable to track matched pairs
var totalPairs;


var gameOver = false; // New flag to control game state

window.onload = function() {
    shuffleCards();
    startGame();
    updateBestTimeDisplay();
}

function shuffleCards() {
    // this creates two of each card
    cardSet = cardList.concat(cardList);
    totalPairs = cardSet.length / 2; // Store the total number of pairs

    // Shuffle the cards
    for (let i = 0; i < cardSet.length; i++) {
        let c = Math.floor(Math.random() * cardSet.length);
        // Swap the cards around
        let swap = cardSet[i];
        cardSet[i] = cardSet[c];
        cardSet[c] = swap;
    }
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImage = cardSet.pop();
            row.push(cardImage);

            // Create card container
            let card = document.createElement("div");
            card.id = r + "-" + c;
            card.classList.add("card");
            card.addEventListener("click", selectCard);

            // Inner wrapper for flipping
            let cardInner = document.createElement("div");
            cardInner.classList.add("card-inner");

            // Create front and back sides
            let cardFront = document.createElement("div");
            cardFront.classList.add("card-front"); // Back of the card, with default image

            let cardBack = document.createElement("div");
            cardBack.classList.add("card-back");
            cardBack.style.backgroundImage = `url('assets/images/playing-cards/${cardImage}.avif')`; // Unique card face

            // Append the front and back to card inner, and card inner to card
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);

            document.getElementById("game-board").append(card);
        }
        board.push(row);
    }
}

// this goes through the board to create the back of the card
function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            let cardBack = card.querySelector(".card-back");
            cardBack.style.backgroundImage = "url('assets/images/back-card/pokemon-card-back-1.avif')";
        }
    }
}

function selectCard() {
    // Don't allow selection if the game is over
    if (gameOver) return;

    // Start the timer when the first card is flipped
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    if (!this.classList.contains("flipped")) {
        if (!card1Selected) {
            // First card selected
            card1Selected = this;
            card1Selected.classList.add("flipped");
        } else if (!card2Selected && this != card1Selected) {
            // Second card selected
            card2Selected = this;
            card2Selected.classList.add("flipped");

            // Check if they match after a short delay
            setTimeout(() => {
                checkCardMatch();
            }, 1000);
        }
    }
}



function startTimer() {
    timer = setInterval(() => {
        elapsedTime++;
        document.getElementById("timer").innerText = `${elapsedTime}s`;
    }, 1000); // Update every second
}


function checkCardMatch() {
    if (card1Selected && card2Selected) {
        // Check if the selected cards match
        if (card1Selected.querySelector(".card-back").style.backgroundImage === card2Selected.querySelector(".card-back").style.backgroundImage) {
            // Increment match counter
            matches++;

            // Check if all matches are found (game complete)
            if (matches === totalPairs) { // Assuming two cards per pair
                clearInterval(timer); // Stop the timer
                gameOver = true; // Set gameOver to true
            
                // Display final elapsed time
                alert(`Congratulations! You completed the game in ${elapsedTime} seconds!`);
                updateBestTimeDisplay();
            
                return; // Exit the function to prevent further code execution
            }
            

            // Reset selected cards for the next turn
            card1Selected = null;
            card2Selected = null;

        } else {
            // If the cards don't match, flip them back after a delay
            setTimeout(() => {
                card1Selected.classList.remove("flipped");
                card2Selected.classList.remove("flipped");

                // Reset selected cards
                card1Selected = null;
                card2Selected = null;
            }, 1000); // Delay to show both cards for a moment
        }
    }
}



function updateBestTimeDisplay() {
    if (!bestTime || elapsedTime < bestTime) {
        bestTime = elapsedTime;
        document.getElementById("best-time").innerText = `${bestTime}s`;
    }
}

function resetGame() {
    // Clear the timer if it is running
    clearInterval(timer);
    timer = null; // Ensure the timer variable is reset

    // Reset the timer variables
    elapsedTime = 0;
    timerStarted = false;
    gameOver = false;
    document.getElementById("timer").innerText = `${elapsedTime}s`;

    // Reset the match counter and game board state
    matches = 0; // Reset match counter
    card1Selected = null;
    card2Selected = null;

    // Clear the board array and reset the UI
    board = [];
    document.getElementById("game-board").innerHTML = ""; // Clear the current game board

    // Re-shuffle and recreate the cards
    shuffleCards(); // Re-shuffle the cards
    startGame();    // Start the game again
}


