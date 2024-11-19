//Code for handling the help modal
function setupModalHandlers() {
    const modal = document.getElementById("help-modal");
    const btn = document.getElementById("help-button");
    const span = document.getElementsByClassName("close")[0];

    btn.onclick = () => modal.style.display = "block";
    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

document.addEventListener("DOMContentLoaded", () => {
    const pokemonDropdowns = [
        document.getElementById('pokemon1'),
        document.getElementById('pokemon2'),
        document.getElementById('pokemon3')
    ];
    const pokemonPreviews = [
        document.getElementById('pokemon1-preview'),
        document.getElementById('pokemon2-preview'),
        document.getElementById('pokemon3-preview')
    ];
    const battleLogs = document.getElementById('battle-logs');
    const userMovesContainer = document.getElementById('user-moves');
    const resetButton = document.getElementById('reset-battle-btn');
    let userPokemonQueue = [];
    let opponentPokemonQueue = [];
    let userCurrentPokemon, opponentCurrentPokemon;
    let battleOver = false; // Flag to indicate if the battle is over

    setupModalHandlers();
    populateDropdowns();

    async function fetchPokemon(pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (response.ok) {
                return await response.json();
            } else {
                alert(`Error: Pokémon "${pokemonName}" not found.`);
                return null;
            }
        } catch (error) {
            console.error(`Failed to fetch data for ${pokemonName}:`, error);
            alert("Failed to fetch Pokémon data. Please try again later.");
            return null;
        }
    }

    async function fetchAndExtractPokemonData(pokemonName) {
        const pokemonData = await fetchPokemon(pokemonName);
        if (!pokemonData) return null;
        return await extractBattleStats(pokemonData);
    }

    async function populateDropdowns() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const pokemonList = data.results;

            pokemonList.forEach(pokemon => {
                const option = document.createElement('option');
                option.value = pokemon.name;
                option.textContent = capitalizeFirstLetter(pokemon.name);
                pokemonDropdowns.forEach(dropdown => dropdown.appendChild(option.cloneNode(true)));
            });

            console.log("Dropdown populated successfully.");
        } catch (error) {
            console.error("Error populating dropdown:", error);
            alert("Failed to load Pokémon list. Please try again later.");
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
                previewImage.classList.add('visible');
                previewImage.classList.remove('hidden');
            }
        } else {
            // If no Pokémon is selected, hide the preview image
            previewImage.classList.add('hidden');
            previewImage.classList.remove('visible');
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
                const battleStats = await fetchAndExtractPokemonData(selectedPokemon);
                if (battleStats) {
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
                const battleStats = await fetchAndExtractPokemonData(randomPokemonName);
                if (battleStats) {
                    opponentPokemonQueue.push(battleStats);
                }
            }

            console.log("Randomized opponent Pokémon:", opponentPokemonQueue);
        } catch (error) {
            console.error("Error selecting random Pokémon:", error);
            alert("Failed to select random Pokémon. Please try again.");
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
            name: capitalizeFirstLetter(pokemonData.name),
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
        updatePokemonDisplay(userCurrentPokemon, 'user');
        updatePokemonDisplay(opponentCurrentPokemon, 'opponent');
        displayUserMoves();
    }

    function updatePokemonDisplay(pokemon, containerPrefix) {
        const nameElem = document.getElementById(`${containerPrefix}-pokemon-name`);
        const imgElem = document.getElementById(`${containerPrefix}-pokemon-img`);
        const hpBarElem = document.getElementById(`${containerPrefix}-pokemon-hp`);

        if (nameElem) nameElem.textContent = pokemon.name;
        if (imgElem) {
            imgElem.src = pokemon.sprite;
            imgElem.classList.remove('pokeball-img');
        }
        updateHpBar(hpBarElem, pokemon.hp, pokemon.maxHp);
    }

    function updateHpBar(hpBarElem, currentHp, maxHp) {
        if (!hpBarElem) {
            console.warn(`HP bar element not found.`);
            return;
        }

        const percentage = Math.max(0, (currentHp / maxHp) * 100);
        hpBarElem.style.width = `${percentage}%`;
        hpBarElem.textContent = `${Math.round(percentage)}% HP`;

        if (percentage > 50) {
            hpBarElem.style.backgroundColor = 'green';
        } else if (percentage > 20) {
            hpBarElem.style.backgroundColor = 'orange';
        } else {
            hpBarElem.style.backgroundColor = 'red';
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

    async function takeTurn(attacker, defender, move, hpBarId) {
        const movePower = await fetchMovePower(move.url);
        const damage = calculateDamage(attacker, defender, movePower);
        defender.hp -= damage;

        logBattleEvent(`${attacker.name} uses ${move.name} on ${defender.name}, dealing ${damage} damage!`);
        updateHpBar(document.getElementById(hpBarId), defender.hp, defender.maxHp);

        if (defender.hp <= 0) {
            logBattleEvent(`${defender.name} has fainted!`);
            return true; // Defender has fainted
        }
        return false;
    }

    //This function processes the user's turn, applying the selected move to the opponent and checking if the battle is over.
    async function playerTurn(selectedMove) {
        if (battleOver) return;

        const battleEnded = await takeTurn(userCurrentPokemon, opponentCurrentPokemon, selectedMove, 'opponent-pokemon-hp');
        if (battleEnded) {
            if (opponentPokemonQueue.length > 0) {
                opponentCurrentPokemon = opponentPokemonQueue.shift();
                updatePokemonDisplay(opponentCurrentPokemon, 'opponent');
            } else {
                endBattle("User");
                return;
            }
        }

        await opponentTurn();
    }

    //This function handles the opponent's turn, selecting a random move and applying it to the user's Pokémon
    async function opponentTurn() {
        if (battleOver) return;

        const randomMove = opponentCurrentPokemon.moves[Math.floor(Math.random() * opponentCurrentPokemon.moves.length)];
        const battleEnded = await takeTurn(opponentCurrentPokemon, userCurrentPokemon, randomMove, 'user-pokemon-hp');
        if (battleEnded) {
            if (userPokemonQueue.length > 0) {
                userCurrentPokemon = userPokemonQueue.shift();
                updatePokemonDisplay(userCurrentPokemon, 'user');
                displayUserMoves();
            } else {
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

    // This function logs battle events to the battle log container, keeping a running history of the actions taken.
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
    
        // Clear Pokémon displays
        clearPokemonDisplay('user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp', "User Pokémon");
        clearPokemonDisplay('opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp', "Opponent Pokémon");
    
        // Clear moves
        userMovesContainer.innerHTML = "";
    
        // Clear battle logs
        battleLogs.innerHTML = "";
    
        // Hide Pokémon preview images
        pokemonPreviews.forEach(preview => {
            preview.src = "";
            preview.classList.add('hidden');
            preview.classList.remove('visible');
        });
    }
    
    function clearPokemonDisplay(nameId, imgId, hpId, defaultName) {
        // Set default text for name
        const nameElem = document.getElementById(nameId);
        if (nameElem) nameElem.textContent = defaultName;
    
        // Set image back to Pokéball
        const imgElem = document.getElementById(imgId);
        if (imgElem) {
            imgElem.src = "./assets/images/pokeball.png"; // Set back to Pokéball placeholder
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
});



