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

// Code for the Email Modal
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

    /**
     * This function populates the dropdown menu with a list of Pokémon by fetching the list of the first 150 Pokémon
     * from the PokeAPI. It loops through each Pokémon and adds an <option> element to eeach dropdown. The dropdown allows
     * users to select which Pokémon they want to use in battle.
     */
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

    /**
     * This function handles user selection of a Pokémon. When the user selects a Pokémon from the dropdown, this function fetches the 
     * Pokémon data, displays its sprite in the preview and prepares the Pokémon queue for battle. If all three user Pokémon are selected,
     * the opponent Pokémon are also randomised and the battle is initiated.
     */
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

    /**
     * This function prepares the user's selected Pokémon for battle. It clears the user's Pokémon queue and the iterates through each 
     * dropdown to fecth the selected Pokémon data. For each selected Pokémon, it calls extractBattleStats() to obtain the battle-relevant
     * information (stats and moves) and then adds this data to the userPokemonQueue.
     */
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

    /**
     * This function randomly selects three Pokémon for the opponent from the list of Pokémon from the PokéAPI. For each selected Pokémon,
     * it fetches their data and extracts their battle stats by calling extractBattleStats(). These Pokémon are then addedd to the 
     * opponentPokemonQueue.
     */
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

    /**
     * This function extracts battle-relevant statistics from Pokémon data e.g. HP, attack, defense and speed. It also selects up to four
     * random level-up moves from the Pokémon data. It returns an object containing thw Pokémon's name, HP, stats, moves, and sprite URL,
     * this is then used in battle.
     */
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

    /**
     * This function initialises the battle by displaying the current Pokémon for each side. The first Pokémon from both user and opponenet
     * queues are selected for battle. The function then calls updatePokemonDisplay() to display the Pokémon names, images, and HP bars for
     * both the user and opponent Pokémon and then calls displayUserMoves() to show the moves for the user's current Pokémon.
     */
    function startBattle() {
        userCurrentPokemon = userPokemonQueue.shift();
        opponentCurrentPokemon = opponentPokemonQueue.shift();
        updatePokemonDisplay(userCurrentPokemon, 'user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp');
        updatePokemonDisplay(opponentCurrentPokemon, 'opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp');
        displayUserMoves();
    }

    /**
     * This function updates the DOM tro display the details of a given Pokémon. It also replaces a placeholder (Pokéball image) with the
     * actual sprite of the Pokémon.
     */
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

    /**
     * This function updates the HP bar for a given Pokémon by calculating the percentage of HP remaining and updates the width accordingly
     * The colour also changes based on percentage remaining: green (>50%), orange (20-50%), or red (<20%).
     */
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

    /**
     * This function displays the user's Pokémon moves as buttons. Clears any existing move buttons and iterates through the moves of the user's
     * current Pokémon to create buttons for each move.
     */
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

    /**
     * This function capitlises the first letter of a string which is used for move names or Pokémon names for display purposes.
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * This function handles the players turn in battle. If the battle is not over, the player's selected move is to attack the opponent's
     * Pokémon. The damage is dealt and the oppponent's HP is reduced. It then goes on to check if the opponents Pokémon has fainted and if
     * so switches to the next opponent Pokémon or ends the battle if no more Pokémon remain.
     */
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

    /**
     * This function handles the opponent's turn where by it selects a random move and attacks the user's Pokémon. Damage is calculated, 
     * and the user's HP is reduced. If the user's Pokémon faints, the next one in the queue is selected, or the battle ends if no Pokémon 
     * remain.
     */
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

    /**
     * This function ends the battle and announces the winner.  Sets battleOver to true, logs the winner in the battle log, and 
     * disables all move buttons to prevent further interactions.
     */
    function endBattle(winner) {
        battleOver = true;
        logBattleEvent(`${winner} has won the battle!`);
        disableMoveButtons();
    }

    /**
     * This function disables all user move buttons once the battle over. It iterates through all move buttons and sets their 
     * disabled property to true.
     */
    function disableMoveButtons() {
        const moveButtons = userMovesContainer.querySelectorAll('button');
        moveButtons.forEach(button => {
            button.disabled = true;
        });
    }

    /**
     * This function fetches the power of a given Pokémon move. Takes a URL pointing to move data in the PokéAPI and fetches
     * the power of that move. If no power is available or an error occurs, it defaults to 50.
     */
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

    /**
     * This function calculates the damage dealth by an attack. Uses a formula to calculate base damage considering the move
     *  power, attacker attack, and defender defense. Adds a random factor (between 85% and 100%) to simulate variability in 
     * damage. The function ensures at least 1 HP of damage is dealt.
     */
    function calculateDamage(attacker, defender, movePower) {
        const baseDamage = ((2 * 50 / 5 + 2) * movePower * (attacker.attack / defender.defense)) / 50 + 2;
        const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100;
        return Math.max(1, Math.floor(baseDamage * randomFactor));
    }

    /**
     * This function logs battle in the UI. Creates a new paragraph element with the provided text (e.g., move used, Pokémon 
     * fainting) and appends it to the battleLogs container. This is used to provide feedback to the player about the battle's 
     * progress.
     */
    function logBattleEvent(event) {
        const logEntry = document.createElement('p');
        logEntry.textContent = event;
        battleLogs.appendChild(logEntry);
        battleLogs.scrollTop = battleLogs.scrollHeight;
    }

    /**
     * This function resets the game to its initial state. Clears dropdown selections, resets Pokémon queues, hides images, 
     * and sets them back to the default Pokéball image. Clears battle logs, resets HP bars, and moves so that the player 
     * can start over.
     */
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

    /**
     * This function clears the display information for a given Pokémon. Resets the Pokémon name, sets the image back to 
     * a Pokéball, and resets the HP bar to 100%. This is called when resetting the battle.
     */
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

