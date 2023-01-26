const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowAdivinar = require("./flows/flowAdivinar");
const flowGatito = require("./flows/flowGatito");
const multiThread = require("./core/multithread");

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([flowGatito, flowAdivinar]);
  const adapterProvider = createProvider(WebWhatsappProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main()
