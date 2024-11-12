document.addEventListener("DOMContentLoaded", () => {
    const pokemonDropdowns = [document.getElementById('pokemon1'), document.getElementById('pokemon2'), document.getElementById('pokemon3')];
    const battleLogs = document.getElementById('battle-logs');
    const userMovesContainer = document.getElementById('user-moves');
    const resetButton = document.getElementById('reset-battle-btn');
    let userPokemonQueue = [];
    let opponentPokemonQueue = [];
    let userCurrentPokemon, opponentCurrentPokemon;

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
            alert("Failed to load Pokémon list. Please try again later.");
        }
    }

    async function handleUserSelection() {
        userPokemonQueue = [];
        for (let dropdown of pokemonDropdowns) {
            const selectedPokemon = dropdown.value;
            if (selectedPokemon) {
                const pokemonData = await fetchPokemon(selectedPokemon);
                if (pokemonData) {
                    userPokemonQueue.push(extractBattleStats(pokemonData));
                }
            }
        }

        if (userPokemonQueue.length === 3) {
            await randomizeOpponentPokemon();
            startBattle();
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
                    opponentPokemonQueue.push(extractBattleStats(pokemonData));
                }
            }

            console.log("Randomized opponent Pokémon:", opponentPokemonQueue);
        } catch (error) {
            console.error("Error selecting random Pokémon:", error);
            alert("Failed to select random Pokémon. Please try again.");
        }
    }

    function extractBattleStats(pokemonData) {
        return {
            name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
            hp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat,
            maxHp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat,
            attack: pokemonData.stats.find(s => s.stat.name === 'attack').base_stat,
            defense: pokemonData.stats.find(s => s.stat.name === 'defense').base_stat,
            speed: pokemonData.stats.find(s => s.stat.name === 'speed').base_stat,
            moves: pokemonData.moves.slice(0, 4).map(move => ({
                name: move.move.name.replace('-', ' '),
                url: move.move.url
            })),
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
        if (imgElem) imgElem.src = pokemon.sprite;
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
                moveButton.textContent = move.name;
                moveButton.classList.add('move-button');
                moveButton.addEventListener('click', () => playerTurn(move));
                userMovesContainer.appendChild(moveButton);
            });
        }
    }

    async function playerTurn(selectedMove) {
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
                return;
            }
        }

        await opponentTurn();
    }

    async function opponentTurn() {
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
            }
        }
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
    
        // Clear Pokémon displays
        clearPokemonDisplay('user-pokemon-name', 'user-pokemon-img', 'user-pokemon-hp');
        clearPokemonDisplay('opponent-pokemon-name', 'opponent-pokemon-img', 'opponent-pokemon-hp');
    
        // Clear moves
        userMovesContainer.innerHTML = "";
    
        // Clear battle logs
        battleLogs.innerHTML = "";
    }
    
    function clearPokemonDisplay(nameId, imgId, hpId) {
        // Set default text for name
        const nameElem = document.getElementById(nameId);
        if (nameElem) nameElem.textContent = "Pokémon";
    
        // Clear image
        const imgElem = document.getElementById(imgId);
        if (imgElem) imgElem.src = "";
    
        // Clear HP bar
        const hpBar = document.getElementById(hpId);
        if (hpBar) {
            hpBar.style.width = "0%";
            hpBar.textContent = "HP";
            hpBar.style.backgroundColor = "#ccc"; // Set back to default gray color
        }
    }
    

    resetButton.addEventListener('click', resetBattle);
    pokemonDropdowns.forEach(dropdown => dropdown.addEventListener('change', handleUserSelection));
    populateDropdowns();
});


