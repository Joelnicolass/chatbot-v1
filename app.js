const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addAnswer,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const provider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const { flowAdivinar, flujoAdivinarResp } = require("./flows/flowAdivinar");
const flowGatito = require("./flows/flowGatito");
const flowJuegoRol = require("./flows/rolGame/flowJuegoRol");

const multiThread = require("./core/multithread");

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowGatito,
    flowAdivinar,
    flujoAdivinarResp,
    flowJuegoRol,
  ]);
  const adapterProvider = createProvider(provider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
