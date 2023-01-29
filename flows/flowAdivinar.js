const fs = require("fs");

const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const { getQuiz } = require("../services/pokemon.services");
const { mensajes, delay } = require("../core/core");

const flowAdivinar = addKeyword(["adivinar"]).addAnswer(
  "Pokegame",
  null,
  async (ctx, { flowDynamic, fallBack }) => {
    const { sprites, names, correctName, correctSprite } = await getQuiz();

    // TODO iniciar sesion para el ctx.from
    // write file
    fs.writeFileSync(`${ctx.from}.txt`, correctName, function (err) {});

    // TODO guardar el nombre del pokemon en la base de datos
    // TODO guardar el nombre del usuario en la base de datos

    flowDynamic([
      {
        media: correctSprite,
      },
      {
        body: mensajes.adivinar,
        capture: true,
        buttons: [
          {
            body: `1 - ${String(names[0]).toUpperCase()}`,
          },
          {
            body: `2 - ${String(names[1]).toUpperCase()}`,
          },
          {
            body: `3 - ${String(names[2]).toUpperCase()}`,
          },
        ],
      },
    ]);

    /*     if (String(ctx.body).toUpperCase() !== correctName) {
      console.log("correcto");
      return fallBack();
    } */
  }
);

const flujoAdivinarResp = addKeyword([
  "1 - ",
  "2 - ",
  "3 - ",
  "4 - ",
]).addAnswer("...", {}, async (ctx, { flowDynamic, fallBack }) => {
  // TODO leer el nombre del pokemon en la base de datos
  // read file

  try {
    const readPokemon = fs.readFileSync(`${ctx.from}.txt`);
    const pokemon = readPokemon.toString().toUpperCase().trim();

    // TODO extraer en funcion
    const format = ctx.body.split(" - ");
    const answer = format[1].toUpperCase().trim();

    // TODO extraer en funcion
    // eliminar archivo
    fs.rmSync(`${ctx.from}.txt`);

    if (answer !== pokemon) {
      flowDynamic([
        {
          body: `😂 ¡Incorrecto!, el pokemon es ${pokemon} 😂`,
        },
      ]);
      return;
    }

    flowDynamic([
      {
        body: `🎉 ¡Correcto!, el pokemon es ${pokemon} 🎉`,
      },
    ]);
  } catch (error) {
    flowDynamic([
      {
        body: `😒 ¡Sesión caducada! 😒`,
      },
    ]);
  }
});

module.exports = {
  flowAdivinar,
  flujoAdivinarResp,
};
