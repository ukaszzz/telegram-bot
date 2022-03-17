import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import connectToDb from './utils/connectToDb';
import {
    addNewCoin,
    changeCoinQuantity,
    changeCurrency,
    checkCoinsValue,
    checkIfUserExist,
    removeCoin,
    userDetail
} from './records/user.record';
import { CoinsList } from './model/coinsList';
import { CurrenciesAvailable } from './model/currenciesAvailable';
import { DefaultMessages } from './model/defaultMessages';

connectToDb();
dotenv.config();

const bot = new Telegraf( process.env.BOT_TOKEN );

bot.start( async ctx => {
    ctx.reply( `🔥Wellcome in coin bot!🔥
    
	☑️ You can check your account
	☑️ Add new coin with value
	☑️ Delete coin
	☑️ Change coin quantity
	☑️ Check the value of all coins
	☑️ Choose your currency`, {
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
                        'text': '💎 Add new coin',
                        'callback_data': 'addNew'
                    }

                ],
                [
                    {
                        'text': '📉 Check account value',
                        'callback_data': 'check'
                    },
                    {
                        'text': '❌ Remove coin',
                        'callback_data': 'removeCoin'
                    }
                ],
                [
                    {
                        'text': '💵 Choose currency',
                        'callback_data': 'chooseCurrency'
                    },
                    {
                        'text': '✏️ Change coin quantity',
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
                        'text': '👤 Show user details',
                        'callback_data': 'userDetail'
                    }

                ],
                [
                    {
                        'text': '💎 Add new coin',
                        'callback_data': 'addNew'
                    }

                ],
                [
                    {
                        'text': '📉 Check account value',
                        'callback_data': 'check'
                    },
                    {
                        'text': '❌ Remove coin',
                        'callback_data': 'removeCoin'
                    }
                ],
                [
                    {
                        'text': '💵 Choose currency',
                        'callback_data': 'chooseCurrency'
                    },
                    {
                        'text': '✏️ Change coin quantity',
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
    const isUserExist = await checkIfUserExist( ctx.from.username );

    if ( !isUserExist ) {
        return ctx.reply( DefaultMessages.NOT_USER );
    }

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

bot.action( 'removeCoin', async ctx => {
    ctx.reply( `
	To delete coin, please type:
	 
	✏remove:coin✏️
	
	example:
	remove:Bitcoin`,
        {
            'reply_markup': {
                'inline_keyboard': [
                    [
                        {
                            'text': '📖 show yours coinList',
                            'callback_data': 'showUserCoinsList'
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
	
	example:
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
    const coinList = CoinsList.map( el => `🔹${el.name} \n` ).toString().replace( /,/g, '' );
    ctx.reply( `
       ${coinList}
    ` );
} );

bot.action( 'showListCurrency', ctx => {

    const currencies = CurrenciesAvailable.map( el => `🔹${el} \n` ).toString().replace( /,/g, '' );
    ctx.reply( `
       ${currencies}
    ` );
} );

bot.hears( [ /add:(.+)=(.+)/, /Add:(.+)=(.+)/ ], async ( ctx ) => {
        const coinName: string = ctx.match[1];
        const coinValue: number | undefined = Number( ctx.match[2] );

        if ( !CoinsList.some( el => el.name.toLocaleLowerCase() === coinName.toLocaleLowerCase() ) ) {
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
        ctx.reply( success || DefaultMessages.UNEXPECTED_ERROR );
    }
);

bot.hears( [ /remove:(.+)/, /Remove:(.+)/ ], async ( ctx ) => {
        const isUserExist = await checkIfUserExist( ctx.from.username );

        if ( !isUserExist ) {
            return ctx.reply( DefaultMessages.NOT_USER );
        }
        const coinName: string = ctx.match[1];
        const { coins } = await userDetail( ctx.from.username );
        const coinList = (coins.map( coin => coin.name ));
        console.log( coinList );
        if ( !coinList.some( el => el.toLocaleLowerCase() === coinName.toLocaleLowerCase() ) ) {
            return ctx.reply( `⛔Unfortunately, there is no coin with that name⛔\n Would you like to see the list of your coins?`, {
                'reply_markup': {
                    'inline_keyboard': [
                        [
                            {
                                'text': '📖 show yours coinList',
                                'callback_data': 'showUserCoinsList'
                            }
                        ]
                    ]
                }
            } );
        }

        let success = await removeCoin( ctx.from.username, coinName );
        ctx.reply( `${success ? success : DefaultMessages.UNEXPECTED_ERROR}`, {
            'reply_markup': {
                'inline_keyboard': [
                    [
                        {
                            'text': '📖 show yours coinList',
                            'callback_data': 'showUserCoinsList'
                        }
                    ]
                ]
            }
        } );
    }
);

bot.hears( [ /change:(.+)=(.+)/, /Change:(.+)=(.+)/ ], async ( ctx ) => {
        let success = await changeCoinQuantity( ctx.from.username, ctx.match[1], Number( ctx.match[2] ) );
        ctx.reply( success || DefaultMessages.UNEXPECTED_ERROR );
    }
);

bot.hears( [ /currency:(.+)/, /Currency:(.+)/ ], async ( ctx ) => {
        const isUserExist = await checkIfUserExist( ctx.from.username );

        if ( !isUserExist ) {
            return ctx.reply( DefaultMessages.NOT_USER );
        }
        const currency = ctx.match[1];

        if ( !CurrenciesAvailable.some( el => el.toLocaleLowerCase() === currency.toLocaleLowerCase() ) ) {
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
            return ctx.reply( DefaultMessages.NOT_USER );
        }

        const { name, coins, currency } = await userDetail( ctx.from.username );
        const coinList = (coins.map( coin => `             🔸${coin.name} ${coin.value}\n` ))
            .toString().replace( /,/g, '' );
        ctx.reply( `👤user details:👤
        
         👤 name: ${name}
         💎 coins:\n ${coinList}
         💵 currency: ${currency}` );
    }
);

bot.action( 'showUserCoinsList', async ( ctx ) => {
        const isUserExist = await checkIfUserExist( ctx.from.username );

        if ( !isUserExist ) {
            return ctx.reply( DefaultMessages.NOT_USER );
        }

        const { coins } = await userDetail( ctx.from.username );
        const coinList = (coins.map( coin => `     🔸${coin.name}\n` ))
            .toString().replace( /,/g, '' );
        ctx.reply( `user coins:\n${coinList}` );
    }
);

bot.launch();