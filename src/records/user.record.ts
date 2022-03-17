import { UserModel } from '../schema/user.schema';
import { Coin } from '../model/coin';
import { User } from '../model/user';
import { CoinsList } from '../model/coinsList';
import { getCoinsMarketValue } from '../service/coinGeco';
import { getMarketPriceWithCurrency } from '../utils/getMarketPriceWithCurrency';

export async function checkCoinsValue ( UserName: string ): Promise<string> {
    const { coins, currency } = await UserModel.findOne( { name: UserName } );
    const coinsListNames = coins.map( ( coin: Coin ) => (coin.id) );
    const coinsListValues = coins.map( ( coin: Coin ) => (coin.value) );
    const totMarketValUSD = await getCoinsMarketValue( coinsListNames, coinsListValues );
    const totValOnCurency = await getMarketPriceWithCurrency( totMarketValUSD, currency );

    return `${totValOnCurency.toFixed( 4 )}  ${currency}`;
}

export async function createUserWithdata ( name: string, id: string, coinName: string, symbol: string, coinValue: number
): Promise<void> {

    const user = new UserModel( {
        name,
        coins: {
            id: id,
            name: coinName,
            symbol: symbol,
            value: coinValue
        },
        currency: 'USD'
    } );
    await user.save();
}

export async function checkIfUserExist ( UserName: string ): Promise<boolean> {
    const user = await UserModel.findOne( { name: UserName } );
    return !!user;
}

export async function addNewCoin ( userName: string, coinName: string, value: number ): Promise<string> {
    if ( isNaN( value ) ) return '⛔Value must be a number⛔';

    const isUserExist = await checkIfUserExist( userName );
    const coin = CoinsList.find( coin => coin.name.toLocaleLowerCase() === coinName.toLocaleLowerCase() );

    if ( !isUserExist ) {
        await createUserWithdata( userName, coin.id, coin.name, coin.symbol, value );
        return `👤👤👤 new user created:
		new coin: 💰${coinName}💰 was added`;
    }
    const { coins } = await UserModel.findOne( { name: userName } );

    if ( !coin ) return '⛔unexpected error, please try letter⛔';
    for ( const coin of coins ) {
        if ( coin.name === coinName ) return '⛔coin already added⛔';
    }

    const newCoin: Coin = {
        id: coin.id,
        name: coinName,
        symbol: coin.symbol,
        value: value
    };
    const newCoinList = [ ...coins, newCoin ];

    await UserModel.updateOne( { name: userName }, {
        coins: newCoinList
    } );

    return `coin ${coinName} have been successfully added with quantity: ${value}.
	If you want to change a quantity, please type: 
	
	✏change:coinName=NewValue✏
	
	example:
	change:bitcoin=11`;
}

export async function removeCoin ( userName: string, coinName: string ): Promise<string> {
    const filter = { name: userName, 'coins.name': coinName };
    const update = { $pull: { coins: { name: coinName } } };

    await UserModel.updateOne( filter, update, {
        new: true
    } );

    return `✅ Succesfully removed. ✅`;
}

export async function changeCoinQuantity ( userName: string, coinName: string, newQuantity: number ): Promise<string> {

    if ( isNaN( newQuantity ) ) return '⛔Value must be a number⛔';
    const filter = { name: userName, 'coins.name': coinName };
    const update = { $set: { 'coins.0.value': newQuantity } };

    let doc = await UserModel.findOneAndUpdate( filter, update, {
        new: true
    } );

    if ( !doc ) return `⛔You do not have coin: ${coinName}⛔`;

    return `Quantity od coin: ${coinName} have been successfully changed of ${newQuantity}`;
}

export async function changeCurrency ( userName: string, currency: string ): Promise<string> {

    const filter = { name: userName };
    const update = { $set: { 'currency': currency } };

    await UserModel.findOneAndUpdate( filter, update, {
        new: true
    } );

    return `Currency change at ${currency}`;
}

export async function userDetail ( userName: string ): Promise<User> {
    const result = await UserModel.find( { name: userName } );
    const user: User = {
        name: result[0].name,
        coins: result[0].coins,
        currency: result[0].currency
    };
    return user as User;
}



