
let urlPrevEvolution;
let urlNextEvolution;
let urlPrevPokemon;
let urlNextPokemon;
let input = document.getElementById("input");

async function fetchPokemonsList() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/?&limit=964");
    return await response.json();
}

function returnUrlBasedOnIdOrName(input, data) {
    let regex = new RegExp(/\d{1,3}/);
    input.toLowerCase();
    // als input nummer tussen 1-3 karakters is dan kun je meteen op zoek gaan naar de input
    if (regex.test(input) && parseInt(input) < 807) {
        url = data.results[parseInt(input) - 1].url;
    } else {
        var arrayPokemon = data.results;
        //kan geen foreach doen op array van JSON file dus plaats ge alles in array
        arrayPokemon.forEach(function (pokemon) {
            if (pokemon.name === input) {
                url = pokemon.url;
            }
        });
    }
    return url;
}

async function fetchPokemonData(url) {
    let response = await fetch(url);
    return await response.json();
}

function showPokemonData(data) {
    console.log(data);
    var pokemonId = data.id
    document.getElementById("pokemonId").innerText = `ID: ${pokemonId}`;
    var pokemonName = data.name;
    document.getElementById("ID-name").innerText = `Name: ${pokemonName}`;
    var pokemonImgFront = data.sprites.front_default;
    var pokemonImgBack = data.sprites.back_default;
    var pokemonAlt = `No picture found of ${pokemonName}`;
    var idBackImage = document.getElementById("back");
    idBackImage.setAttribute("src", pokemonImgBack);
    idBackImage.setAttribute("alt", pokemonAlt);
    var idFrontImage = document.getElementById("front");
    idFrontImage.setAttribute("src", pokemonImgFront);
    idFrontImage.setAttribute("alt", pokemonAlt);
    var pokemonAllMoves = Array.from(data.moves);
    var pokemonFourMoves = chooseFourMoves(pokemonAllMoves);
    var pokemonFourMovesName = getNamesMovesArray(pokemonFourMoves);
    var classMoves = Array.from(document.getElementsByClassName("moves"));
    pokemonFourMovesName.forEach(function (move, index) {
        document.getElementsByClassName("moves")[index].innerHTML = move;
    });
}

function returnUrlSpecies(data) {
    return data.species.url;
}

function chooseFourMoves(arrayAllMoves) {
    var arrayFourMoves = [];
    var moveNumber = [];
    for (let i = 0; i < 4; i++) {
        let boolCheckNumber;
        do {
            boolCheckNumber = true;
            var randomNumber = Math.floor(Math.random() * arrayAllMoves.length);
            moveNumber.forEach(function (number) {
                if (parseInt(number) === randomNumber) {
                    boolCheckNumber = false;
                }
            })
        } while (boolCheckNumber === false);

        arrayFourMoves.push(arrayAllMoves[randomNumber]);
        moveNumber.push(randomNumber);
    }
    return arrayFourMoves;
}

function getNamesMovesArray(arrayMoves) {
    var names = [];
    arrayMoves.forEach(function (move) {
        names.push(move.move.name);
    });
    return names;
}

async function fetchSpecies(url) {
    let response = await fetch(url);
    return await response.json();
}

async function fetchEvolutionChain(url) {
    let response = await fetch(url);
    return await response.json();
}

function checkPrevNextEvolution(pokemonName, data) {
    switch (pokemonName) {
        case data.chain.species.name:
            urlPrevEvolution = "";
            urlNextEvolution = data.chain.evolves_to[0].species.url.replace("-species","");
            break;
        case data.chain.evolves_to[0].species.name:
            urlPrevEvolution = data.chain.species.url.replace("-species", "");
            urlNextEvolution = data.chain.evolves_to[0].evolves_to[0].species.url.replace("-species","");
            break;
        case data.chain.evolves_to[0].evolves_to[0].species.name:
            urlPrevEvolution = data.chain.evolves_to[0].species.url.replace("-species","");
            urlNextEvolution = "";
            break;
    }
}

function returnPrevPokemonObj(data) {
    var arrayPokemons = data.results;
    var pokemon;
    arrayPokemons.forEach(function (pokemon,index) {
        if (pokemon.name === name){
            return data.results[index-1];
        }
    })
}

function returnUrlPrevPokemon(name) {
    let url = "";
    fetchPokemonsList()
        .then(function (data) {
            console.log(data);
            let pokemonObj = returnPrevPokemonObj(data);
            console.log(pokemonObj.url);
            url = pokemonObj.url;
            return url;
        });
    return url;
}

function checkPrevNextPokemon(data) {
    let nameFirstPokemonInEvolution = data.chain.species.name;
    urlPrevPokemon = returnUrlPrevPokemon(nameFirstPokemonInEvolution);

}

function repeat(urlPokemon){
    fetchPokemonData(urlPokemon)
        .then(function (data) {
            showPokemonData(data);
            let pokemonName = data.name;
            var urlSpecies = returnUrlSpecies(data);
            fetchSpecies(urlSpecies)
                .then(function (data) {
                    let urlEvolutionChain = data.evolution_chain.url;
                    fetchEvolutionChain(urlEvolutionChain)
                        .then(function (data) {
                            checkPrevNextEvolution(pokemonName, data);
                            checkPrevNextPokemon(data);
                        })
                })
        })
}

fetchPokemonsList()
    .then(function (data) {
        var arrayPokemonList = Array.from(data.results);
        arrayPokemonList.forEach(function (pokemon) {
            var option = document.createElement("option");
            option.value = pokemon.name;
            document.getElementById("pokemonList").appendChild(option);
        })
    });


input.addEventListener("keydown",function (event) {
    if (event.keyCode === 13){
        event.preventDefault();
        document.getElementById("go").click();
    }
});

document.getElementById("go").addEventListener("click", function () {
    let inputText = input.value;
    fetchPokemonsList()
        .then(function (data) {
            let urlPokemon = returnUrlBasedOnIdOrName(inputText, data);
            repeat(urlPokemon)
        });
});

document.getElementById("prevev").addEventListener("click", function () {
    repeat(urlPrevEvolution);
});

document.getElementById("nextev").addEventListener("click", function () {
    repeat(urlNextEvolution);
});

document.getElementById("nextmon").addEventListener("click",function () {

});

document.getElementById("prevmon").addEventListener("click",function () {
    repeat(urlPrevPokemon);
});


/*

*/


//list of all pokemon names
//https://pokeapi.co/api/v2/pokemon?&limit=964