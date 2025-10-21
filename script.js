document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded!");

    const pokemonInput = document.getElementById("pokemonInput");
    const addBtn = document.getElementById("addBtn");
    const teamDisplay = document.getElementById("teamDisplay");
    const clearBtn = document.getElementById("clearBtn");
    const errorMsg = document.getElementById("errorMsg");

    if (!pokemonInput || !addBtn || !teamDisplay || !clearBtn || !errorMsg) {
        console.error("One or more elements are missing in the HTML.");
        return;
    }

    let team = [];

    async function fetchPokemon(pokemonName) {
        console.log(`Fetching Pokémon: ${pokemonName}...`);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            if (!response.ok) throw new Error("Pokémon not found");
            
            const data = await response.json();
            return {
                name: data.name,
                sprite: data.sprites.front_default,
                types: data.types.map(type => type.type.name)
            };
        } catch (error) {
            console.error("Error fetching Pokémon:", error.message);
            return null;
        }
    }

    async function addPokemon() {
        const pokemonName = pokemonInput.value.trim();
        errorMsg.textContent = "";

        if (!pokemonName) {
            errorMsg.textContent = "Please enter a Pokémon name!";
            return;
        }

        if (team.length >= 6) {
            errorMsg.textContent = "Your team is full!";
            return;
        }

        const pokemon = await fetchPokemon(pokemonName);
        if (!pokemon) {
            errorMsg.textContent = "Pokémon not found!";
            return;
        }

        team.push(pokemon);
        updateTeamDisplay();
        pokemonInput.value = "";
        console.log("Updated team:", team);
    }

    function removePokemon(index) {
        team.splice(index, 1);
        updateTeamDisplay();
    }

    function updateTeamDisplay() {
        console.log("Updating team display...");
        teamDisplay.innerHTML = "";

        team.forEach((pokemon, index) => {
            const pokemonCard = document.createElement("div");
            pokemonCard.classList.add("pokemon-card");
            pokemonCard.innerHTML = `
                <img src="${pokemon.sprite}" alt="${pokemon.name}">
                <p class="pokemon-name">${pokemon.name}</p>
                <div>${pokemon.types.map(type => `<span class="pokemon-type" style="background-color:${getTypeColor(type)};">${type}</span>`).join("")}</div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            teamDisplay.appendChild(pokemonCard);
        });

        for (let i = team.length; i < 6; i++) {
            const emptySlot = document.createElement("div");
            emptySlot.classList.add("empty-slot");
            emptySlot.textContent = "Empty Slot";
            teamDisplay.appendChild(emptySlot);
        }
    }

    function clearTeam() {
        team = [];
        updateTeamDisplay();
    }

    function getTypeColor(type) {
        const colors = {
            normal: "#A8A878",
            fire: "#F08030",
            water: "#6890F0",
            electric: "#F8D030",
            grass: "#78C850",
            ice: "#98D8D8",
            fighting: "#C03028",
            poison: "#A040A0",
            ground: "#E0C068",
            flying: "#A890F0",
            psychic: "#F85888",
            bug: "#A8B820",
            rock: "#B8A038",
            ghost: "#705898",
            dragon: "#7038F8",
            dark: "#705848",
            steel: "#B8B8D0",
            fairy: "#EE99AC"
        };
        return colors[type] || "#AAA";
    }

    addBtn.addEventListener("click", addPokemon);
    clearBtn.addEventListener("click", clearTeam);

    teamDisplay.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const index = event.target.getAttribute("data-index");
            removePokemon(parseInt(index));
        }
    });

    updateTeamDisplay();
});
