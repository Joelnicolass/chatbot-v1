const { addKeyword } = require("@bot-whatsapp/bot");

const {
  mensajes,
  services,
  getService,
  getServiceKey,
  isFn,
} = require("../core/core");

const flowGatito = addKeyword(["gatito", "pokemon"]).addAnswer(
  "...",
  {},
  async (ctx, { flowDynamic }) => {
    const service = getService(ctx.body, services);

    if (isFn(service))
      return flowDynamic([
        {
          body: "No se encontró lo que buscabas",
        },
      ]);

    const media = await service();

    flowDynamic([
      {
        body: mensajes[getServiceKey(ctx.body, services)] || "Cargando...",
      },
      {
        media,
      },
    ]);
  }
);

module.exports = flowGatito;
