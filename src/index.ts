import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
import { addNewCoin, changeCoinQuantity, changeCurrency, checkCoinsValue } from './records/user.record';
import { coinList } from './service/coinGeco';
import { coinsList } from './model/coinsList';
import { Currencies } from './model/currencies';

connectToDb();
dotenv.config();

const bot = new Telegraf( process.env.BOT_TOKEN );

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

bot.start( async ctx => {
    ctx.reply( `🔥Wellcome in coin bot!🔥
    
	☑️ You can check your account,
	☑️ add new coin with value
	☑️ or choose your currency`, {
        'reply_markup': {
            'inline_keyboard': [
                [
                    {
                        'text': '📉 Check account value',
                        'callback_data': 'check'
                    },
                    {
                        'text': '💎 Add new coin',
                        'callback_data': 'addNew'
                    }
                ],
                [
                    {
                        'text': '💵 Choose currency',
                        'callback_data': 'chooseCurrency'
                    },
                    {
                        'text': '✏️ Check coin value',
                        'callback_data': 'changeCoin'
                    }
                ]
            ]
        }
    } );
} );

bot.help( async ctx => {
    ctx.reply( `📜Available options:📜`, {
        'reply_markup': {
            'inline_keyboard': [
                [
                    {
                        'text': '📉 Check account value',
                        'callback_data': 'check'
                    },
                    {
                        'text': '💎 Add new coin',
                        'callback_data': 'addNew'
                    }
                ],
                [
                    {
                        'text': '💵 Choose currency',
                        'callback_data': 'chooseCurrency'
                    },
                    {
                        'text': '✏️ Check coin value',
                        'callback_data': 'changeCoin'
                    }
                ],
                [
                    {
                        'text': '💵 Available coins list',
                        'callback_data': 'showListCoins'
                    }

                ]
            ]
        }
    } );
} );

bot.action( 'check', async ctx => {
    const totalValue = await checkCoinsValue( ctx.from.username );

    ctx.reply( `
	Your cons have value of: ${totalValue} 
  	` );
} );

bot.action( 'addNew', async ctx => {
    ctx.reply( `
	To add new coin to your tracker, please type: 
	AddCoin: FullName amount
	example:
	addCoin: Bitcoin 0.12
 	` );
} );

bot.action( 'chooseCurrency', async ctx => {
    ctx.reply( `
	To change your currency, please type: 
	currency: CURRENCY
	example: 
	currency: USD
	` );
} );

bot.action( 'changeCoin', async ctx => {
    ctx.reply( `
	To change your coin quantity, please type: 
	change:coin=value
	example: 
	change:bitcoin=1
	` );
} );

bot.action( 'coinList', async ctx => {
    ctx.reply( `
	To change your coin quantity, please type: 
	change:coin=value
	example: 
	change:bitcoin=1
	` );
} );

bot.action( 'showListCoins', ctx => {
    ctx.reply( `
       ${coinsList.map( el => `🔹${el} \n`.slice( 0, -1 ) )}
    ` );
} );

bot.action( 'showListCurrency', ctx => {
    ctx.reply( `
       ${Currencies.map( el => `🔹${el} \n`.slice( 0, -1 ) )}
    ` );
} );

bot.hears( /add:(.+)=(.+)/, async ( ctx ) => {
        const coinName: string = ctx.match[1];
        const coinValue: number | undefined = Number( ctx.match[2] );

        if ( !coinsList.some( el => el.toLocaleLowerCase() === coinName.toLocaleLowerCase() ) ) {
            return ctx.reply( `⛔Unfortunately, there is no coin with that name⛔
            Would you like to see the list of available?`, {
                'reply_markup': {
                    'inline_keyboard': [
                        [
                            {
                                'text': '📖 show list',
                                'callback_data': 'showListCoins'
                            }
                        ]
                    ]
                }
            } );
        }

        let success = await addNewCoin( ctx.from.username, coinName, coinValue );
        ctx.reply( success || '⛔unexpected error⛔' );
    }
);

bot.hears( /change:(.+)=(.+)/, async ( ctx ) => {
        let success = await changeCoinQuantity( ctx.from.username, ctx.match[1], Number( ctx.match[2] ) );
        ctx.reply( success || '' );
    }
);

bot.hears( /currency:(.+)/, async ( ctx ) => {
        const currency = ctx.match[1];

        if ( !Currencies.some( el => el.toLocaleLowerCase() === currency.toLocaleLowerCase() ) ) {
            return ctx.reply( `⛔Unfortunately, passed currency is not available⛔
            Would you like to see the list of available?`, {
                'reply_markup': {
                    'inline_keyboard': [
                        [
                            {
                                'text': '📖 show list',
                                'callback_data': 'showListCurrency'
                            }
                        ]
                    ]
                }
            } );
        }
        const success = await changeCurrency( ctx.from.username, currency );
        ctx.reply( success );
    }
);

bot.launch();