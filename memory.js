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
    "snorlax"
]

var cardSet;
var board = [];
var rows = 4;
var columns = 5;

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

            //creates the img, class and gives it a source
            let card = document.createElement("img");
            card.id = r.toString() + "-" + c.toString();
            card.src = cardImage + ".avif";
            card.classList("card");
            document.getElementById("game-board").append(card);
        }
    }
}