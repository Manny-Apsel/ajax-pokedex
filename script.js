
let urlLinkPokemonPrev;
let urlLinkPokemonNext;

async function fetchPokemonsList() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/?&limit=964");
    return await response.json();
}

function returnUrlBasedOnIdOrName(input, data) {
    console.log(data);
    console.log(data.results);
    console.log(data.results[parseInt(input) - 1]);
    console.log(data.results[parseInt(input) - 1].url);
    let regex = new RegExp(/\d{1,3}/);
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
    console.log(url);
    return url;
}

async function fetchPokemonData(url) {
    let response = await fetch(url);
    return await response.json();
}

function showPokemonData(data) {
    console.log(data);
    var pokemonId = data.id;
    var pokemonName = data.name;
    document.getElementById("ID-name").innerText = pokemonName;
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
                            if (pokemonName === data.chain.species.name){
                                urlLinkPokemonPrev = "";
                                urlLinkPokemonNext = data.chain.evolves_to[0].species.url.replace("-species","");
                            }
                            if (pokemonName === data.chain.evolves_to[0].species.name){
                                urlLinkPokemonPrev = data.chain.species.url.replace("-species", "");
                                urlLinkPokemonNext = data.chain.evolves_to[0].evolves_to[0].species.url.replace("-species","");
                            }
                            if (pokemonName === data.chain.evolves_to[0].evolves_to[0].species.name){
                                urlLinkPokemonPrev = data.chain.evolves_to[0].species.url.replace("-species","");
                                urlLinkPokemonNext = "";
                            }
                        })
                })
        })
}


document.getElementById("go").addEventListener("click", function () {
    var input = document.getElementById("input").value;
    fetchPokemonsList()
        .then(function (data) {
            let urlPokemon = returnUrlBasedOnIdOrName(input, data);
            repeat(urlPokemon)
        });
});

document.getElementById("prevev").addEventListener("click", function () {
    repeat(urlLinkPokemonPrev);
});

document.getElementById("nextev").addEventListener("click", function () {
    repeat(urlLinkPokemonNext);
});


/*

*/


//list of all pokemon names
//https://pokeapi.co/api/v2/pokemon?&limit=964