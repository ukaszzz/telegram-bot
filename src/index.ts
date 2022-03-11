import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
import {UserModel} from "./schema/user.schema";
import { checkCoinsValue, createUserWithdata} from "./records/user.record";

connectToDb();
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN)

// bot.command('quit', (ctx) => {
//   // Explicit usage
//   ctx.telegram.leaveChat(ctx.message.chat.id)
//
//   // Using context shortcut
//   ctx.leaveChat()
// })

// bot.on('text', (ctx) => {
//   // Explicit usage
//   console.log(ctx.from)
//   // Using context shortcut
//   ctx.reply(`Hello men`);
//   const coins = [
//     {
//       name: 'bitcoin',
//       value: 12
//     },
//     {
//       name: 'bitcoin',
//       value: 10
//     }
//   ]
//
//   createUserWithdata(ctx.from.username, coins, 'USD')
//
// })

bot.start(ctx => {
  ctx.reply('/help')
})

bot.help(ctx => {
  ctx.reply(`
  Welkome in my bot!
  You can check your account - /check 
  add new coint with value - /addNew
  or choose your currency - /chooseCurrency
  `)
})


bot.command('check', async ctx => {

  const totalValue = await checkCoinsValue(ctx.from.username);

  ctx.reply(`
Your cons have value of: ${totalValue} 
  `)
})

bot.command('addNew', async ctx => {

  ctx.reply(`
To add new coin to your tracker, please type: 
AddCoin: FullName amount
example:
addCoin: Bitcoin 0.12
  `)
})

bot.command('chooseCurrency', async ctx => {

  ctx.reply(`
To change your currency, please type: 
currency: CURRENCY
example:
currency: USD`)
})



// bot.on('callback_query', (ctx) => {
//   // Explicit usage
//   ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
//
//   // Using context shortcut
//   ctx.answerCbQuery()
// })
//
// bot.on('inline_query', (ctx) => {
//   const result: [] = []
//   // Explicit usage
//   ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result)
//
//   // Using context shortcut
//   ctx.answerInlineQuery(result)
// })

bot.launch()