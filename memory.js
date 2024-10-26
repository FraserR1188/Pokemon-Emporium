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

windown.onload = function() {
    shuffleCards();
    startGame();
}

function shuffleCards() {
    cardSet = cardList.concat(cardList);
    console.log(cardSet);
}