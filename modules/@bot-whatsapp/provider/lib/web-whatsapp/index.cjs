/** 
* NO TOCAR ESTE ARCHIVO: Es generado automaticamente, si sabes lo que haces adelante ;)
* de lo contrario mejor ir a la documentacion o al servidor de discord link.codigoencasa.com/DISCORD
*/
'use strict';

var require$$0$1 = require('whatsapp-web.js');
var require$$1$1 = require('@bot-whatsapp/bot');
var require$$2$1 = require('console');
var require$$0 = require('fs');
var require$$1 = require('combine-image');
var require$$2 = require('qr-image');
var require$$3 = require('os');
var require$$4 = require('http');
var require$$5 = require('https');

const { createWriteStream: createWriteStream$1 } = require$$0;
const combineImage = require$$1;
const qr = require$$2;
const { tmpdir } = require$$3;
const http = require$$4;
const https = require$$5;

const wwebCleanNumber$1 = (number, full = false) => {
    number = number.replace('@c.us', '');
    number = !full ? `${number}@c.us` : `${number}`;
    return number
};

const wwebGenerateImage$1 = async (base64, name = 'qr.png') => {
    const PATH_QR = `${process.cwd()}/${name}`;
    let qr_svg = qr.image(base64, { type: 'png', margin: 4 });

    const writeFilePromise = () =>
        new Promise((resolve, reject) => {
            const file = qr_svg.pipe(createWriteStream$1(PATH_QR));
            file.on('finish', () => resolve(true));
            file.on('error', reject);
        });

    await writeFilePromise();

    const cleanImage = await combineImage([PATH_QR], {
        margin: 15,
        color: 0xffffffff,
    });
    cleanImage.write(PATH_QR);
};

const wwebIsValidNumber$1 = (rawNumber) => {
    const regexGroup = /\@g.us\b/gm;
    const exist = rawNumber.match(regexGroup);
    return !exist
};

/**
 * Incompleta
 * Descargar archivo multimedia para enviar
 * @param {*} url
 * @returns
 */
const wwebDownloadMedia$1 = (url) => {
    return new Promise((resolve, reject) => {
        const ext = url.split('.').pop();
        const checkProtocol = url.includes('https:');
        const handleHttp = checkProtocol ? https : http;
        const name = `tmp-${Date.now()}.${ext}`;
        const fullPath = `${tmpdir()}/${name}`;
        const file = createWriteStream$1(fullPath);
        handleHttp.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                resolve(fullPath);
            });
            file.on('error', function () {
                console.log('errro');
                file.close();
                reject(null);
            });
        });
    })
};

var utils = {
    wwebCleanNumber: wwebCleanNumber$1,
    wwebGenerateImage: wwebGenerateImage$1,
    wwebIsValidNumber: wwebIsValidNumber$1,
    wwebDownloadMedia: wwebDownloadMedia$1,
};

const { Client, LocalAuth, MessageMedia, Buttons } = require$$0$1;
const { ProviderClass } = require$$1$1;
const { Console } = require$$2$1;
const { createWriteStream } = require$$0;
const {
    wwebCleanNumber,
    wwebDownloadMedia,
    wwebGenerateImage,
    wwebIsValidNumber,
} = utils;

const logger = new Console({
    stdout: createWriteStream('./log'),
});

/**
 * ⚙️ WebWhatsappProvider: Es una clase tipo adaptor
 * que extiende clases de ProviderClass (la cual es como interfaz para sber que funciones rqueridas)
 * https://github.com/pedroslopez/whatsapp-web.js
 */
class WebWhatsappProvider extends ProviderClass {
    globalVendorArgs = { name: `bot` }
    vendor
    constructor(args) {
        super();
        this.globalVendorArgs = { ...this.globalVendorArgs, ...args };
        this.vendor = new Client({
            authStrategy: new LocalAuth({
                clientId: `${this.globalVendorArgs.name}_sessions`,
            }),
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--unhandled-rejections=strict',
                ],
            },
        });

        const listEvents = this.busEvents();

        for (const { event, func } of listEvents) {
            this.vendor.on(event, func);
        }

        this.vendor.emit('preinit');
        this.vendor.initialize().catch((e) => {
            logger.log(e);
            this.emit('require_action', {
                instructions: [
                    `(Opcion 1): Debes eliminar la carpeta .wwebjs_auth y reiniciar nuevamente el bot. `,
                    `(Opcion 2): Intenta actualizar el paquete [npm install whatsapp-web.js] `,
                    `(Opcion 3): Ir FORO de discord https://link.codigoencasa.com/DISCORD `,
                ],
            });
        });
    }

    /**
     * Mapeamos los eventos nativos de  whatsapp-web.js a los que la clase Provider espera
     * para tener un standar de eventos
     * @returns
     */
    busEvents = () => [
        {
            event: 'auth_failure',
            func: (payload) => this.emit('error', payload),
        },
        {
            event: 'qr',
            func: async (qr) => {
                this.emit('require_action', {
                    instructions: [
                        `Debes escanear el QR Code para iniciar ${this.globalVendorArgs.name}.qr.png`,
                        `Recuerda que el QR se actualiza cada minuto `,
                        `Necesitas ayuda: https://link.codigoencasa.com/DISCORD`,
                    ],
                });
                await wwebGenerateImage(
                    qr,
                    `${this.globalVendorArgs.name}.qr.png`
                );
            },
        },
        {
            event: 'ready',
            func: () => this.emit('ready', true),
        },
        {
            event: 'message',
            func: (payload) => {
                if (payload.from === 'status@broadcast') {
                    return
                }

                if (!wwebIsValidNumber(payload.from)) {
                    return
                }
                payload.from = wwebCleanNumber(payload.from, true);
                this.emit('message', payload);
            },
        },
    ]

    /**
     * Enviar un archivo multimedia
     * https://docs.wwebjs.dev/MessageMedia.html
     * @private
     * @param {*} number
     * @param {*} mediaInput
     * @returns
     */
    sendMedia = async (number, mediaInput = null) => {
        if (!mediaInput) throw new Error(`NO_SE_ENCONTRO: ${mediaInput}`)
        const fileDownloaded = await wwebDownloadMedia(mediaInput);
        const media = MessageMedia.fromFilePath(fileDownloaded);
        return this.vendor.sendMessage(number, media, {
            sendAudioAsVoice: true,
        })
    }

    /**
     * Enviar botones
     * https://docs.wwebjs.dev/Buttons.html
     * @private
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    sendButtons = async (number, message, buttons = []) => {
        const buttonMessage = new Buttons(message, buttons, '', '');
        return this.vendor.sendMessage(number, buttonMessage)
    }

    /**
     * Enviar lista
     * https://docs.wwebjs.dev/List.html
     * @private
     * @alpha No funciona en whatsapp bussines
     * @param {*} number
     * @param {*} message
     * @param {*} buttons []
     * @returns
     */
    // sendList = async (number, message, listInput = []) => {
    //     let sections = [
    //         {
    //             title: 'sectionTitle',
    //             rows: [
    //                 { title: 'ListItem1', description: 'desc' },
    //                 { title: 'ListItem2' },
    //             ],
    //         },
    //     ]
    //     let list = new List('List body', 'btnText', sections, 'Title', 'footer')
    //     return this.vendor.sendMessage(number, list)
    // }

    /**
     * Enviar un mensaje solo texto
     * https://docs.wwebjs.dev/Message.html
     * @private
     * @param {*} number
     * @param {*} message
     * @returns
     */
    sendText = async (number, message) => {
        return this.vendor.sendMessage(number, message)
    }

    /**
     *
     * @param {*} userId
     * @param {*} message
     * @param {*} param2
     * @returns
     */
    sendMessage = async (userId, message, { options }) => {
        const number = wwebCleanNumber(userId);
        if (options?.buttons?.length)
            return this.sendButtons(number, message, options.buttons)
        if (options?.media) return this.sendMedia(number, options.media)
        return this.sendText(number, message)
    }
}

var webWhatsapp = WebWhatsappProvider;

module.exports = webWhatsapp;
