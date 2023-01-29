const { default: axios } = require("axios");

const getAllPokemon = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000");
  return res.data.results;
};

const getPokemonData = async (pokemon) => {
  const res = await axios.get(pokemon.url);
  return res.data;
};

const getRandomPokemon = async (pokemons) => {
  const pokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  return pokemon;
};

const getSprite = async (pokemon) => {
  const sprite = pokemon.sprites.front_default;
  return sprite;
};

const getRandomSprite = async () => {
  const pokemons = await getAllPokemon();
  const pokemon = await getRandomPokemon(pokemons);
  const dataPokemon = await getPokemonData(pokemon);
  const sprite = await getSprite(dataPokemon);

  return sprite;
};

getRandomFromArr = (arr, quantity) => {
  const newArr = [];

  for (let i = 0; i < quantity; i++) {
    const random = Math.floor(Math.random() * arr.length);
    newArr.push(arr[random]);
  }

  return newArr;
};

const getQuiz = async () => {
  const pokemons = await getAllPokemon();
  const randomPokemons = getRandomFromArr(pokemons, 3);

  const dataPokemons = await Promise.all(
    randomPokemons.map((pokemon) => getPokemonData(pokemon))
  );

  const sprites = await Promise.all(
    dataPokemons.map((pokemon) => getSprite(pokemon))
  );

  const names = dataPokemons.map((pokemon) => pokemon.name);
  const correctName = names[Math.floor(Math.random() * names.length)];
  const correctSprite = sprites[names.indexOf(correctName)];

  return { sprites, names, correctName, correctSprite };
};

module.exports = { getRandomSprite, getQuiz };
