
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