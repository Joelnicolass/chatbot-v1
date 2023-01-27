const { addKeyword } = require("@bot-whatsapp/bot");

const flowJuegoRol = addKeyword(["rolgame"]).addAnswer(
  "inicializando...",
  {},
  async (ctx, { flowDynamic, fallBack }) => {
    console.log(ctx);
    console.log(ctx.body);
  }
);

module.exports = flowJuegoRol;
