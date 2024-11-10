document.addEventListener("DOMContentLoaded", () => {
    const pokemonDropdown1 = document.getElementById('pokemon1');
    const pokemonDropdown2 = document.getElementById('pokemon2');
    const battleLogs = document.getElementById('battle-logs');
    const battleBtn = document.getElementById('battle-btn');
    let pokemon1Stats, pokemon2Stats;
    let isPokemon1Turn = true;

    // Fetch Pokémon data by name
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

    // Populate dropdowns with a list of Pokémon
    async function populateDropdowns() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const pokemonList = data.results;

            pokemonList.forEach(pokemon => {
                const option1 = document.createElement('option');
                option1.value = pokemon.name;
                option1.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                pokemonDropdown1.appendChild(option1);

                const option2 = option1.cloneNode(true);
                pokemonDropdown2.appendChild(option2);
            });

            console.log("Dropdowns populated successfully.");
        } catch (error) {
            console.error("Error populating dropdowns:", error);
            alert("Failed to load Pokémon list. Please try again later.");
        }
    }

    // Extract battle stats from Pokémon data
    function extractBattleStats(pokemonData) {
        return {
            name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
            hp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat,
            maxHp: pokemonData.stats.find(s => s.stat.name === 'hp').base_stat, // Keep track of max HP
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

    // Display selected Pokémon data on screen
    async function displaySelectedPokemon(pokemonName, containerId, imgId, hpBarId) {
        const pokemonData = await fetchPokemon(pokemonName);
        if (pokemonData) {
            const stats = extractBattleStats(pokemonData);

            const nameElem = document.getElementById(containerId);
            const imgElem = document.getElementById(imgId);

            if (nameElem) nameElem.textContent = stats.name;
            if (imgElem) imgElem.src = stats.sprite;

            console.log(`Setting initial HP for ${hpBarId}: ${stats.hp}`);
            updateHpBar(hpBarId, stats.hp, stats.maxHp);

            return stats;
        }
        return null;
    }

    // Update HP bar in the DOM
    function updateHpBar(pokemonId, currentHp, maxHp) {
        console.log(`Updating HP bar for ${pokemonId}: Current HP = ${currentHp}, Max HP = ${maxHp}`);

        const hpBar = document.getElementById(`${pokemonId}-hp`);
        if (!hpBar) {
            console.warn(`HP bar element for ${pokemonId}-hp not found.`);
            return;
        }

        const percentage = Math.max(0, (currentHp / maxHp) * 100);
        console.log(`Setting width of ${pokemonId}-hp to ${percentage}%`);
        hpBar.style.width = `${percentage}%`;
        hpBar.textContent = `${Math.round(percentage)}% HP`;

        // Change HP bar color based on percentage
        if (percentage > 50) {
            hpBar.style.backgroundColor = 'green';
        } else if (percentage > 20) {
            hpBar.style.backgroundColor = 'orange';
        } else {
            hpBar.style.backgroundColor = 'red';
        }
    }

    // Log battle events
    function logBattleEvent(event) {
        const logEntry = document.createElement('p');
        logEntry.textContent = event;
        battleLogs.appendChild(logEntry);
        battleLogs.scrollTop = battleLogs.scrollHeight; // Auto-scroll to bottom
    }

    // Handle dropdown selection to display Pokémon
    pokemonDropdown1.addEventListener('change', async () => {
        const selectedPokemon = pokemonDropdown1.value;
        if (selectedPokemon) {
            pokemon1Stats = await displaySelectedPokemon(selectedPokemon, 'pokemon1-name', 'pokemon1-img', 'pokemon1');
            checkBothPokemonSelected();
        }
    });

    pokemonDropdown2.addEventListener('change', async () => {
        const selectedPokemon = pokemonDropdown2.value;
        if (selectedPokemon) {
            pokemon2Stats = await displaySelectedPokemon(selectedPokemon, 'pokemon2-name', 'pokemon2-img', 'pokemon2');
            checkBothPokemonSelected();
        }
    });

    // Check if both Pokémon are selected to enable the battle button
    function checkBothPokemonSelected() {
        if (pokemon1Stats && pokemon2Stats) {
            battleBtn.disabled = false;
            resetBattle();
        } else {
            battleBtn.disabled = true;
        }
    }

    // Reset battle state
    function resetBattle() {
        isPokemon1Turn = true;
        battleLogs.innerHTML = '';
        battleBtn.disabled = false;

        // Reset HP to max HP
        pokemon1Stats.hp = pokemon1Stats.maxHp;
        pokemon2Stats.hp = pokemon2Stats.maxHp;

        updateHpBar('pokemon1', pokemon1Stats.hp, pokemon1Stats.maxHp);
        updateHpBar('pokemon2', pokemon2Stats.hp, pokemon2Stats.maxHp);
    }

    // Fetch move power from API
    async function fetchMovePower(moveUrl) {
        try {
            const response = await fetch(moveUrl);
            const moveData = await response.json();
            return moveData.power || 50; // Default power if none available
        } catch (error) {
            console.error("Failed to fetch move data:", error);
            return 50; // Default power
        }
    }

    // Calculate damage
    function calculateDamage(attacker, defender, movePower) {
        const baseDamage = ((2 * 50 / 5 + 2) * movePower * (attacker.attack / defender.defense)) / 50 + 2;
        const randomFactor = (Math.floor(Math.random() * 16) + 85) / 100; // Random factor between 0.85 and 1
        return Math.max(1, Math.floor(baseDamage * randomFactor)); // Ensure at least 1 damage
    }

    // Player Turn
    async function playerTurn() {
        if (!pokemon1Stats || !pokemon2Stats) {
            alert("Please select two Pokémon to battle!");
            return;
        }

        const attacker = isPokemon1Turn ? pokemon1Stats : pokemon2Stats;
        const defender = isPokemon1Turn ? pokemon2Stats : pokemon1Stats;

        const randomMove = attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
        const movePower = await fetchMovePower(randomMove.url);

        const damage = calculateDamage(attacker, defender, movePower);
        defender.hp -= damage;

        logBattleEvent(`${attacker.name} uses ${randomMove.name} on ${defender.name}, dealing ${damage} damage!`);

        if (isPokemon1Turn) {
            updateHpBar('pokemon2', defender.hp, defender.maxHp);
        } else {
            updateHpBar('pokemon1', defender.hp, defender.maxHp);
        }

        if (defender.hp <= 0) {
            logBattleEvent(`${defender.name} has fainted! ${attacker.name} wins!`);
            battleBtn.disabled = true;
            return;
        }

        isPokemon1Turn = !isPokemon1Turn;
    }

    // Battle Button
    battleBtn.addEventListener('click', playerTurn);

    // Populate dropdowns when the page loads
    populateDropdowns();
});
