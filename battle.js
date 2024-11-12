document.addEventListener("DOMContentLoaded", () => {
    const pokemonDropdown1 = document.getElementById('pokemon1');
    const pokemonDropdown2 = document.getElementById('pokemon2');
    const battleLogs = document.getElementById('battle-logs');
    const battleBtn = document.getElementById('battle-btn');
    let pokemon1Stats, pokemon2Stats;
    let isPokemon1Turn = true;

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
                const option1 = document.createElement('option');
                option1.value = pokemon.name;
                option1.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                pokemonDropdown1.appendChild(option1);
            });

            console.log("Dropdown populated successfully.");
        } catch (error) {
            console.error("Error populating dropdown:", error);
            alert("Failed to load Pokémon list. Please try again later.");
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

    async function displaySelectedPokemon(pokemonName, containerId, imgId, hpBarId) {
        const pokemonData = await fetchPokemon(pokemonName);
        if (pokemonData) {
            const stats = extractBattleStats(pokemonData);

            const nameElem = document.getElementById(containerId);
            const imgElem = document.getElementById(imgId);

            if (nameElem) nameElem.textContent = stats.name;
            if (imgElem) imgElem.src = stats.sprite;

            updateHpBar(hpBarId, stats.hp, stats.maxHp);
            return stats;
        }
        return null;
    }

    function updateHpBar(pokemonId, currentHp, maxHp) {
        const hpBar = document.getElementById(`${pokemonId}-hp`);
        if (!hpBar) {
            console.warn(`HP bar element for ${pokemonId}-hp not found.`);
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

    function logBattleEvent(event) {
        const logEntry = document.createElement('p');
        logEntry.textContent = event;
        battleLogs.appendChild(logEntry);
        battleLogs.scrollTop = battleLogs.scrollHeight;
    }

    pokemonDropdown1.addEventListener('change', async () => {
        const selectedPokemon = pokemonDropdown1.value;
        if (selectedPokemon) {
            // User selects Pokémon 1
            pokemon1Stats = await displaySelectedPokemon(selectedPokemon, 'pokemon1-name', 'pokemon1-img', 'pokemon1');

            // Randomly select Pokémon 2
            await randomizePokemon2();
            checkBothPokemonSelected();
        }
    });

    async function randomizePokemon2() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const pokemonList = data.results;

            // Pick a random Pokémon that is different from Pokémon 1
            let randomPokemon;
            do {
                const randomIndex = Math.floor(Math.random() * pokemonList.length);
                randomPokemon = pokemonList[randomIndex].name;
            } while (randomPokemon === pokemonDropdown1.value.toLowerCase());

            console.log(`Randomly selected Pokémon 2: ${randomPokemon}`);

            // Display the randomly selected Pokémon 2
            pokemon2Stats = await displaySelectedPokemon(randomPokemon, 'pokemon2-name', 'pokemon2-img', 'pokemon2');
        } catch (error) {
            console.error("Error selecting random Pokémon 2:", error);
            alert("Failed to select a random Pokémon. Please try again.");
        }
    }

    function checkBothPokemonSelected() {
        if (pokemon1Stats && pokemon2Stats) {
            battleBtn.disabled = false;
            resetBattle();
        } else {
            battleBtn.disabled = true;
        }
    }

    function resetBattle() {
        isPokemon1Turn = true;
        battleLogs.innerHTML = '';
        battleBtn.disabled = false;

        pokemon1Stats.hp = pokemon1Stats.maxHp;
        pokemon2Stats.hp = pokemon2Stats.maxHp;

        updateHpBar('pokemon1', pokemon1Stats.hp, pokemon1Stats.maxHp);
        updateHpBar('pokemon2', pokemon2Stats.hp, pokemon2Stats.maxHp);
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

    battleBtn.addEventListener('click', playerTurn);

    populateDropdowns();
});

