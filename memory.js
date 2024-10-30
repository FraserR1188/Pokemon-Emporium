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
    // creating the board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let cardImage = cardSet.pop();
            row.push(cardImage);
            console.log(cardImage)

            //creates the img, class and gives it a source
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = `assets/images/playing-cards/${cardImage}.avif`;
            card.onerror = () => {
                console.error(`Failed to load image at ${card.src}`);
            };
            card.classList.add("card");
            card.addEventListener("click", selectCard);
            document.getElementById("game-board").append(card);
        }
        board.push(row);
    }
    //once the game board has been created the hidecard function will be called at the same
    //to show the back of the cards.
    hideCards();
}

// this goes through the board to create the back of the card
function hideCards() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let card = document.getElementById(r.toString() + "-" + c.toString());
            card.src = "assets/images/back-card/pokemon-card-back-1.avif";
        }
    }
}

function selectCard() {
    
    if(this.src.includes("assets/images/back-card/pokemon-card-back-1.avif")) {
        if (!card1Selected) {
            card1Selected = this;

            let coords = card1Selected.id.split("-");
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            card1Selected.src = board[r][c] + ".avif"
        }
    }
}