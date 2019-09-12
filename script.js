function returnUrlBasedOnIdOrName(input) {
    var url = "test";
    input = input.toLowerCase();
    fetch("https://pokeapi.co/api/v2/pokemon/?&limit=964")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results);
            console.log(data.results[parseInt(input)-1]);
            console.log(data.results[parseInt(input)-1].url);
            let regex = new RegExp(/\d{1,3}/);
            // als input nummer tussen 1-3 karakters is dan kun je meteen op zoek gaan naar de input
            if (regex.test(input) && parseInt(input) < 807) {
                url = data.results[parseInt(input)-1].url;
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
        });
    console.log(url);
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

function fetchSpecies(url) {
    fetch(url)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            let urlEvolutionChain = data.evolution_chain.url;
            document.getElementById("button1").addEventListener("click", function () {
                fetchEvolutionChain(urlEvolutionChain);
            })
        })
}

function fetchEvolutionChain(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        })
}

function fetchPokemon(url) {
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
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
            console.log(pokemonFourMovesName);
            pokemonFourMovesName.forEach(function (move, index) {
                console.log(index, move);
                document.getElementsByClassName("moves")[index].innerHTML = move;
            });
            var urlSpecies = data.species.url;
            document.getElementById("prevev").addEventListener("click", function () {
                fetchSpecies(urlSpecies);
            });
            document.getElementById("nextev").addEventListener("click", function () {
                fetchSpecies(urlspecies);
            });
            document.getElementById("prevmon").addEventListener("click", function () {
                //code to go to prev pokemon
            });
            document.getElementById("nextmon").addEventListener("click", function () {
                //code to go to next pokemon
            })

        });
}

document.getElementById("go").addEventListener("click", function () {
    var input = document.getElementById("input").value;
    var urlPokemon = "";
    input = input.toLowerCase();
    fetch("https://pokeapi.co/api/v2/pokemon/?&limit=964")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            console.log(data.results);
            console.log(data.results[parseInt(input)-1]);
            console.log(data.results[parseInt(input)-1].url);
            let regex = new RegExp(/\d{1,3}/);
            // als input nummer tussen 1-3 karakters is dan kun je meteen op zoek gaan naar de input
            if (regex.test(input) && parseInt(input) < 807) {
                urlPokemon = data.results[parseInt(input)-1].url;
            } else {
                var arrayPokemon = data.results;
                //kan geen foreach doen op array van JSON file dus plaats ge alles in array
                arrayPokemon.forEach(function (pokemon) {
                    if (pokemon.name === input) {
                        urlPokemon = pokemon.url;
                    }
                });
            }
        });
    fetchPokemon(urlPokemon);
});


/*

*/


//list of all pokemon names
//https://pokeapi.co/api/v2/pokemon?&limit=964