//Code for help modal
var modal = document.getElementById("help-modal");
var btn = document.getElementById("help-button");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
};

span.onclick = function() {
  modal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//Code for email modal

document.addEventListener("DOMContentLoaded", function () {
    const openModalButton = document.getElementById("openEmailModal");
    const modal = document.getElementById("emailModal");
    const closeModalButton = modal.querySelector(".close");

    // Verify button exists
    if (!closeModalButton) {
        console.error("Close button not found");
        return;
    }

    // Open the modal
    openModalButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        modal.style.display = "block";
    });

    // Close the modal when clicking the close button
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});


//List of pokemon which will be connected to the cards in the game
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
];

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

// This run's all functions on window load
window.onload = function() {
    shuffleCards(); // Shuffle cards before starting the game
    startGame(); // Initialise the game board
    updateBestTimeDisplay(); // Update the best time display if necessary
    adjustCardSize(); // Adjust card size on load

    // Add event listener for window resize
    window.addEventListener("resize", adjustCardSize);
};


/**
 * This function adjusts card size depending on the screen width.
 */
function adjustCardSize() {
    let width = window.innerWidth;

    // Adjust card size based on window width
    if (width <= 400) {
        document.querySelectorAll(".card").forEach(card => {
            card.style.height = "80px";
            card.style.width = "55px";
        });
    }
    if (width <= 300) {
        document.querySelectorAll(".card").forEach(card => {
            card.style.height = "60px";
            card.style.width = "45px";
        });
    }
    // If the screen width is greater than 600px, reset to default size

}

/**
 * The function shuffles the cards and creates pairs.
 */
function shuffleCards() {
    // This creates two of each card for matching pairs.
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

/**
 * This function sets up and also starts the game board. It also adds the class to cards
 * which gives them the flipping animation. 
 */
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

/**
 * This function handles the card selection when a card is clicked.
 */
function selectCard() {
    // Don't allow selection if the game is over
    if (gameOver) return;

    // Start the timer when the first card is flipped
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    // Ensure the clicked card isn't flipped
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
            }, 500);
        }
    }
}


/**
 * This fuction is to start the timer.
 */
function startTimer() {
    timer = setInterval(() => {
        elapsedTime++;
        document.getElementById("timer").innerText = `${elapsedTime}s`;
    }, 1000); // Update every second
}

/**
 * This function is to check if two selected cards match.
 */
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

/**
 * This function is to update the best time if a new best time is set.
 */
function updateBestTimeDisplay() {
    if (!bestTime || elapsedTime < bestTime) {
        bestTime = elapsedTime;
        document.getElementById("best-time").innerText = `${bestTime}s`;
    }
}

/**
 * This function resets the game to the inital state.
 */
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


