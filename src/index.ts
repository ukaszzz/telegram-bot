import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
import { addNewCoin, changeCoinQuantity, changeCurrency, checkCoinsValue, userDetail } from './records/user.record';
import { coinList } from './service/coinGeco';
import { coinsList } from './model/coinsList';
import { Currencies } from './model/currencies';
import { checkIfUserExist } from './utils/checkIsUserExist';

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
                        'text': '👤 Show user details',
                        'callback_data': 'userDetail'
                    }

                ],
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
                        'text': '👤 Show user details',
                        'callback_data': 'userDetail'
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
	Your coins have value of: ${totalValue} 
  	` );
} );

bot.action( 'addNew', async ctx => {
    ctx.reply( `
	To add new coin to your tracker, please type:
	 
	✏add:coin=amount✏️
	
	example:
	add:Bitcoin=0.12
 	`,
        {
            'reply_markup': {
                'inline_keyboard': [
                    [
                        {
                            'text': '📉 Check account value',
                            'callback_data': 'check'
                        }
                    ]
                ]
            }
        } );
} );

bot.action( 'chooseCurrency', async ctx => {
    ctx.reply( `
	To change your currency, please type: 
	
	✏️currency:CURRENCY✏️
	
	example: s
	currency: USD
	` );
} );

bot.action( 'changeCoin', async ctx => {
    ctx.reply( `
	To change your coin quantity, please type:
	 
	✏️change:coin=value✏️
	
	example: 
	change:bitcoin=1
	` );
} );

bot.action( 'coinList', async ctx => {
    ctx.reply( `
	To change your coin quantity, please type: 
	
	✏️change:coin=value✏️
	
	example: 
	change:bitcoin=1
	` );
} );

bot.action( 'showListCoins', ctx => {
    const coinList = coinsList.map( el => `🔹${el} \n` ).toString().replace( /,/g, '' );
    ctx.reply( `
       ${coinList}
    ` );
} );

bot.action( 'showListCurrency', ctx => {

    const currencies = Currencies.map( el => `🔹${el} \n` ).toString().replace( /,/g, '' );
    ctx.reply( `
       ${currencies}
    ` );
} );

bot.hears( [ /add:(.+)=(.+)/, /Add:(.+)=(.+)/ ], async ( ctx ) => {
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

bot.hears( [ /change:(.+)=(.+)/, /Change:(.+)=(.+)/ ], async ( ctx ) => {
        let success = await changeCoinQuantity( ctx.from.username, ctx.match[1], Number( ctx.match[2] ) );
        ctx.reply( success || '' );
    }
);

bot.hears( [ /currency:(.+)/, /Currency:(.+)/ ], async ( ctx ) => {
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

bot.action( 'userDetail', async ( ctx ) => {
        const isUserExist = await checkIfUserExist( ctx.from.username );

        if ( !isUserExist ) {
            return ctx.reply( `⛔You are not user.⛔
            If you would like to be one, add your first coin.` );
        }

        const { name, coins, currency } = await userDetail( ctx.from.username );
        const coinList = (coins.map( coin => `             🔸${coin.name} ${coin.value}\n` ))
            .toString().replace( /,/g, '' );
        ctx.reply( `👤user details:👤
        
         👤 name: ${name}
         💎 coins:\n ${coinList}
         💵 currency: ${currency}` );
    }
)
;

bot.launch();