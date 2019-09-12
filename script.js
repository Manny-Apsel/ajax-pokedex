function returnUrlBasedOnIdOrName(input) {
    var url = "not passed";
    input = input.toLowerCase();
    let regex = new RegExp(/\d{1,3}/);
    // als input nummer tussen 1-3 karakters is dan kun je meteen op zoek gaan naar de input
    if (regex.test(input) && parseInt(input) < 964) {
        url = `https://pokeapi.co/api/v2/pokemon/${input}/`
    } else {
        fetch("https://pokeapi.co/api/v2/pokemon?&limit=964")
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                //kan geen foreach doen op array van JSON file dus plaats ge alles in array
                var arrayPokemon = data.results;
                arrayPokemon.forEach(function (pokemon) {
                    if (pokemon.name === input) {
                        url = pokemon.url;
                    }
                });
            })
    }
    return url;
}
function chooseFourMoves(arrayAllMoves){
    var arrayFourMoves = [];
    var moveNumber = [];
    for (let i = 0; i < 4; i++){
        let boolCheckNumber;
        do {
            boolCheckNumber = true;
            var randomNumber = Math.floor(Math.random() * arrayAllMoves.length);
            moveNumber.forEach(function (number) {
                if (parseInt(number) === randomNumber){
                    boolCheckNumber = false;
                }
            })
        }while (boolCheckNumber === false);

        arrayFourMoves.push(arrayAllMoves[randomNumber]);
        moveNumber.push(randomNumber);
    }
    return arrayFourMoves;
}

function getNamesMovesArray(arrayMoves) {
    var names = [];
    arrayMoves.forEach(function (move) {
        names.push(move.name);
    });
    return names;
}

function fetchSpecies(url){
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            let urlEvolutionChain = data.evolution_chain.url;
            document.getElementById("button1").addEventListener("click", function () {
                fetchEvolutionChain(urlEvolutionChain);
            })})
}

function fetchEvolutionChain(url){
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

let urlPokemon = "https://pokeapi.co/api/v2/pokemon/1/";


fetch(urlPokemon)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var pokemonId = data.id;
        var pokemonName = data.name;
        var pokemonImgFront = data.sprites.front_default;
        var pokemonImgBack = data.sprites.back_default;
        var pokemonAlt = `No picture found of ${pokemonName}`;
        var pokemonAllMoves = Array.from(data.moves);
        var pokemonFourMoves = chooseFourMoves(pokemonAllMoves);
        var pokemonFourMovesName = getNamesMovesArray(pokemonFourMoves);
        var urlSpecies = data.species.url;

        var self = this;
        document.getElementById("button").addEventListener("click", function () {
            fetchSpecies(urlSpecies);
        });

    });

/*

*/







//list of all pokemon names
//https://pokeapi.co/api/v2/pokemon?&limit=964