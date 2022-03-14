import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
import { addNewCoin, changeCoinQuantity, checkCoinsValue } from './records/user.record';

connectToDb();
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

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
	ctx.reply('/help');
	bot.on('callback_query', async (ctx) => {
		ctx.reply(`Your answer was: `);
	});
});

bot.hears(/add:(.+)=(.+)/, async (ctx) => {
		let success = await addNewCoin(ctx.from.username, ctx.match[1], Number(ctx.match[2]));
		ctx.reply(success || '');
	}
);

bot.hears(/change:(.+)=(.+)/, async (ctx) => {
		let success = await changeCoinQuantity(ctx.from.username, ctx.match[1], Number(ctx.match[2]));
		ctx.reply(success || '');
	}
);

bot.help(ctx => {
	ctx.reply(`
  Welkome in my bot!
  You can check your account - /check 
  add new coint with value - /addNew
  or choose your currency - /chooseCurrency
  `);
});

bot.command('check', async ctx => {

	const totalValue = await checkCoinsValue(ctx.from.username);

	ctx.reply(`
Your cons have value of: ${totalValue} 
  `);
});

bot.command('addNew', async ctx => {

	ctx.reply(`
To add new coin to your tracker, please type: 
AddCoin: FullName amount
example:
addCoin: Bitcoin 0.12
  `);
});

bot.command('chooseCurrency', async ctx => {

	ctx.reply(`
To change your currency, please type: 
currency: CURRENCY
example:
currency: USD`);
});

bot.launch();