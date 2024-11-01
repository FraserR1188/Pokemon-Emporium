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
    "pikachu",
]

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

var card1Selected;
var card2Selected;

window.onload = function() {
    shuffleCards();
    startGame();
}

function shuffleCards() {
    //this creates two of each card
    cardSet = cardList.concat(cardList);
    console.log(cardSet);
    //this then shuffles the cards
    for (let i = 0; i < cardSet.length; i++) {
        let c = Math.floor(Math.random() * cardSet.length);
        // we then swap the cards around
        let swap = cardSet[i];
        cardSet[i] = cardSet[c];
        cardSet[c] = swap;
    }
    console.log(cardSet);
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
                update();
            }, 1000);
        }
    }
}


function update() {
    if (card1Selected && card2Selected) {
        // If they don't match, flip them back
        if (card1Selected.querySelector(".card-back").style.backgroundImage !== card2Selected.querySelector(".card-back").style.backgroundImage) {
            card1Selected.classList.remove("flipped");
            card2Selected.classList.remove("flipped");
        }
        
        // Reset the selected cards
        card1Selected = null;
        card2Selected = null;
    }
}
