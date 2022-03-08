
import * as TelegramBot from "node-telegram-bot-api";
import * as dotenv from 'dotenv';

dotenv.config();

const authToken: string = process.env.API_KEY;

const bot = new TelegramBot(authToken, {
    polling: true
});

bot.on('message', (message: TelegramBot.Message) => {
    let chat_id = message.from.id;
    

    if (message.text === "hej utuś") {
        bot.sendMessage(chat_id, 'hej dziamdziuś <3')

    }

})

