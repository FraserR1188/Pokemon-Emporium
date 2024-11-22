//Code for handling the help modal
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


document.addEventListener("DOMContentLoaded", () => {
    const pokemonDropdowns = [document.getElementById('pokemon1'), document.getElementById('pokemon2'), document.getElementById('pokemon3')];
    const pokemonPreviews = [document.getElementById('pokemon1-preview'), document.getElementById('pokemon2-preview'), document.getElementById('pokemon3-preview')];
    const battleLogs = document.getElementById('battle-logs');
    const userMovesContainer = document.getElementById('user-moves');
    const resetButton = document.getElementById('reset-battle-btn');
    let userPokemonQueue = [];
    let opponentPokemonQueue = [];
    let userCurrentPokemon, opponentCurrentPokemon;
    let battleOver = false; // Flag to indicate if the battle is over

    const pokeballImagePath = "./assets/images/pokeball.png"; // Path to the Pokéball image

    /**
    * This function takes the name of a Pokemon as an argument, converts it to lowercase and makes an API call to get its
    * data. If the response is successful, it returns the parsed JSON data. Otherwise , it returns null and logs an error.
    */
    async function fetchPokemon(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (response.ok) {
                return await response.json();
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Failed to fetch data for ${pokemonName}:`, error);
            return null;
        }
    }

    async function populateDropdowns() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const pokemonList = data.results;

            pokemonList.forEach(pokemon => {
                pokemonDropdowns.forEach(dropdown => {
                    const option = document.createElement('option');
                    option.value = pokemon.name;
                    option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                    dropdown.appendChild(option);
                });
            });

            console.log("Dropdown populated successfully.");
        } catch (error) {
            console.error("Error populating dropdown:", error);
        }
    }

    async function handleUserSelection(dropdownIndex) {
        const dropdown = pokemonDropdowns[dropdownIndex];
        const selectedPokemon = dropdown.value;
        const previewImage = pokemonPreviews[dropdownIndex];

        if (selectedPokemon) {
            const pokemonData = await fetchPokemon(selectedPokemon);
            if (pokemonData) {
                previewImage.src = pokemonData.sprites.front_default;
                previewImage.style.display = "block"; // Show the preview image
            }
        } else {
            // If no Pokémon is selected, hide the preview image
            previewImage.style.display = "none";
        }

        // After all selections are made, set up the battle
        await prepareUserPokemonQueue();
        if (userPokemonQueue.length === 3) {
            await randomizeOpponentPokemon();
            startBattle();
        }
    }

    async function prepareUserPokemonQueue() {
        userPokemonQueue = [];
        for (let dropdown of pokemonDropdowns) {
            const selectedPokemon = dropdown.value;
            if (selectedPokemon) {
                const pokemonData = await fetchPokemon(selectedPokemon);
                if (pokemonData) {
                    const battleStats = await extractBattleStats(pokemonData);
                    userPokemonQueue.push(battleStats);
                }
            }
        }
    }

    async function randomizeOpponentPokemon() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const pokemonList = data.results;

            opponentPokemonQueue = [];
            while (opponentPokemonQueue.length < 3) {
                const randomIndex = Math.floor(Math.random() * pokemonList.length);
                const randomPokemonName = pokemonList[randomIndex].name;
                const pokemonData = await fetchPokemon(randomPokemonName);
                if (pokemonData) {
                    const battleStats = await extractBattleStats(pokemonData);
                    opponentPokemonQueue.push(battleStats);
                }
            }

            console.log("Randomized opponent Pokémon:", opponentPokemonQueue);
        } catch (error) {
            console.error("Error selecting random Pokémon:", error);
        }
    }

    async function extractBattleStats(pokemonData) {
        // Filter moves to only include level-up moves
        const levelUpMoves = pokemonData.moves.filter(moveEntry => 
            moveEntry.version_group_details.some(detail => detail.move_learn_method.name === 'level-up')
        );

        // Randomly select four moves from the filtered list
        const selectedMoves = levelUpMoves
            .sort(() => 0.5 - Math.random()) // Shuffle moves
            .slice(0, 4)                     // Take the first four moves
            .map(move => ({
                name: move.move.name.replace('-', ' '),
                url: move.move.url
            }));

        return {
            name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
            hp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat,
            maxHp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat,
            attack: pokemonData.stats.find(s => s.stat.name === 'attack').base_stat,
            defense: pokemonData.stats.find(s => s.stat.name === 'defense').base_stat,
            speed: pokemonData.stats.find(s => s.stat.name === 'speed').base_stat,
            moves: selectedMoves,
            sprite: pokemonData.sprites.front_default || ""
        };
    }

    function startBattle() {
        userCurrentPokemon = userPokemonQueue.shift();
        opponentCurrentPokemon = opponentPokemonQueue.shift();
        updatePokemonDisplay(userCurrentPokemon, 'user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp');
        updatePokemonDisplay(opponentCurrentPokemon, 'opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp');
        displayUserMoves();
    }

    function updatePokemonDisplay(pokemon, nameId, imgId, hpId) {
        const nameElem = document.getElementById(nameId);
        const imgElem = document.getElementById(imgId);
        if (nameElem) nameElem.textContent = pokemon.name;
        if (imgElem) {
            imgElem.src = pokemon.sprite; // Set the Pokémon sprite to replace the Pokéball
            imgElem.classList.remove('pokeball-img'); // Remove the Pokéball styling class once Pokémon is chosen
        }
        updateHpBar(hpId, pokemon.hp, pokemon.maxHp);
    }

    function updateHpBar(pokemonId, currentHp, maxHp) {
        const hpBar = document.getElementById(pokemonId);
        if (!hpBar) {
            console.warn(`HP bar element for ${pokemonId} not found.`);
            return;
        }

        const percentage = Math.max(0, (currentHp / maxHp) * 100);
        hpBar.style.width = `${percentage}%`;
        hpBar.textContent = `${Math.round(percentage)}% HP`;

        if (percentage > 50) {
            hpBar.style.backgroundColor = 'green';
        } else if (percentage > 20) {
            hpBar.style.backgroundColor = 'orange';
        } else {
            hpBar.style.backgroundColor = 'red';
        }
    }

    function displayUserMoves() {
        userMovesContainer.innerHTML = ""; // Clear previous moves
        if (userCurrentPokemon && userCurrentPokemon.moves) {
            userCurrentPokemon.moves.forEach(move => {
                const moveButton = document.createElement('button');
                moveButton.textContent = capitalizeFirstLetter(move.name); // Capitalize the first letter
                moveButton.classList.add('move-button', 'animated'); // Add classes for styling and animation
                moveButton.addEventListener('click', () => playerTurn(move));
                userMovesContainer.appendChild(moveButton);
            });
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function playerTurn(selectedMove) {
        if (battleOver) return; // Prevent any further action if the battle is over

        const attacker = userCurrentPokemon;
        const defender = opponentCurrentPokemon;

        const movePower = await fetchMovePower(selectedMove.url);
        const damage = calculateDamage(attacker, defender, movePower);
        defender.hp -= damage;

        logBattleEvent(`${attacker.name} uses ${selectedMove.name} on ${defender.name}, dealing ${damage} damage!`);
        updateHpBar('opponent-pokemon-hp', defender.hp, defender.maxHp);

        if (defender.hp <= 0) {
            logBattleEvent(`${defender.name} has fainted!`);
            if (opponentPokemonQueue.length > 0) {
                opponentCurrentPokemon = opponentPokemonQueue.shift();
                updatePokemonDisplay(opponentCurrentPokemon, 'opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp');
            } else {
                logBattleEvent("Congratulations! You have defeated all opponent Pokémon!");
                endBattle("User");
                return;
            }
        }

        await opponentTurn();
    }

    async function opponentTurn() {
        if (battleOver) return; // Prevent any further action if the battle is over

        const attacker = opponentCurrentPokemon;
        const defender = userCurrentPokemon;

        const randomMove = attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
        const movePower = await fetchMovePower(randomMove.url);
        const damage = calculateDamage(attacker, defender, movePower);
        defender.hp -= damage;

        logBattleEvent(`${attacker.name} uses ${randomMove.name} on ${defender.name}, dealing ${damage} damage!`);
        updateHpBar('user-pokemon-hp', defender.hp, defender.maxHp);

        if (defender.hp <= 0) {
            logBattleEvent(`${defender.name} has fainted!`);
            if (userPokemonQueue.length > 0) {
                userCurrentPokemon = userPokemonQueue.shift();
                updatePokemonDisplay(userCurrentPokemon, 'user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp');
                displayUserMoves();
            } else {
                logBattleEvent("All your Pokémon have fainted! You lose!");
                endBattle("Opponent");
            }
        }
    }

    function endBattle(winner) {
        battleOver = true;
        logBattleEvent(`${winner} has won the battle!`);
        disableMoveButtons();
    }

    function disableMoveButtons() {
        const moveButtons = userMovesContainer.querySelectorAll('button');
        moveButtons.forEach(button => {
            button.disabled = true;
        });
    }

    async function fetchMovePower(moveUrl) {
        try {
            const response = await fetch(moveUrl);
            const moveData = await response.json();
            return moveData.power || 50;
        } catch (error) {
            console.error("Failed to fetch move data:", error);
            return 50;
        }
    }

    function calculateDamage(attacker, defender, movePower) {
        const baseDamage = ((2 * 50 / 5 + 2) * movePower * (attacker.attack / defender.defense)) / 50 + 2;
        const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;
        return Math.max(1, Math.floor(baseDamage * randomFactor));
    }

    function logBattleEvent(event) {
        const logEntry = document.createElement('p');
        logEntry.textContent = event;
        battleLogs.appendChild(logEntry);
        battleLogs.scrollTop = battleLogs.scrollHeight;
    }

    function resetBattle() {
        // Reset dropdowns
        pokemonDropdowns.forEach(dropdown => {
            dropdown.value = "";
        });

        // Clear Pokémon queues
        userPokemonQueue = [];
        opponentPokemonQueue = [];
        battleOver = false; // Reset the battle over flag

        // Clear Pokémon displays and set them to Pokéball
        clearPokemonDisplay('user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp', "User Pokémon");
        clearPokemonDisplay('opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp', "Opponent Pokémon");

        // Clear moves
        userMovesContainer.innerHTML = "";

        // Clear battle logs
        battleLogs.innerHTML = "";

        // Hide Pokémon preview images
        pokemonPreviews.forEach(preview => {
            preview.src = "";
            preview.style.display = "none";
        });
    }

    function clearPokemonDisplay(nameId, imgId, hpId, defaultName) {
        // Set default text for name
        const nameElem = document.getElementById(nameId);
        if (nameElem) nameElem.textContent = defaultName;

        // Set image back to Pokéball
        const imgElem = document.getElementById(imgId);
        if (imgElem) {
            imgElem.src = pokeballImagePath; // Set back to Pokéball placeholder
            imgElem.classList.add('pokeball-img'); // Add the Pokéball styling class back
        }

        // Clear HP bar
        const hpBar = document.getElementById(hpId);
        if (hpBar) {
            hpBar.style.width = "100%";
            hpBar.textContent = "100% HP";
            hpBar.style.backgroundColor = "#008000"; // Set back to default gray color
        }
    }

    resetButton.addEventListener('click', resetBattle);
    pokemonDropdowns.forEach((dropdown, index) => dropdown.addEventListener('change', () => handleUserSelection(index)));
    populateDropdowns();
});

