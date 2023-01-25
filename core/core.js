const { getCat } = require("../services/getCat");
const { getRandomSprite } = require("../services/pokemon.services");

const services = {
  gatito: getCat,
  pokemon: getRandomSprite,
};

const mensajes = {
  gatito: "Secuestrando un gatito...",
  pokemon: "Capturando pokemon...",
  adivinar: "Que pokemon es?...",
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getWords = (body) => {
  const words = body.split(" ");

  return words.map((word) => word.toLowerCase());
};

const getServiceKey = (body, services) => {
  const keys = Object.keys(services);
  const words = getWords(body);
  const servicekey = keys.find((key) => words.includes(key));

  return servicekey;
};

const getService = (body, services) => {
  const key = getServiceKey(body, services);
  const service = services[key];

  return service;
};

const isFn = (any) => {
  return typeof any !== "function";
};

module.exports = {
  services,
  mensajes,
  getWords,
  getServiceKey,
  getService,
  isFn,
  delay,
};
