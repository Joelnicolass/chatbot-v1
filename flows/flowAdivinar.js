const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
} = require("@bot-whatsapp/bot");

const { getQuiz } = require("../services/pokemon.services");
const { mensajes, delay } = require("../core/core");

const flowAdivinar = addKeyword(["adivinar"]).addAnswer(
  mensajes.adivinar,
  {},
  async (ctx, { flowDynamic, fallBack }) => {
    const { sprites, names, correctName, correctSprite } = await getQuiz();

    flowDynamic([
      {
        body: {
          media: correctSprite,
        },
      },
      {
        body: `${String(names[0]).toUpperCase()} - ${String(
          names[1]
        ).toUpperCase()} - ${String(names[2]).toUpperCase()} - ${String(
          names[3]
        ).toUpperCase()}`,
      },
    ]);

    await delay(8000);

    flowDynamic([
      {
        body: "🕔",
      },
    ]);

    await delay(2000);

    flowDynamic([
      {
        body: "🕓",
      },
    ]);

    await delay(2000);

    flowDynamic([
      {
        body: "🕒",
      },
    ]);

    await delay(2000);

    flowDynamic([
      {
        body: "🕑",
      },
    ]);

    await delay(2000);

    flowDynamic([
      {
        body: "🕐",
      },
    ]);

    await delay(5000);

    flowDynamic([
      {
        body: `El Pokémon es: *${String(correctName).toUpperCase()}*`,
      },
    ]);

    return;
  }
);

module.exports = flowAdivinar;
