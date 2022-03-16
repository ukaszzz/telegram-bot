import { UserModel } from '../schema/user.schema';
import { checkIfUserExist } from '../utils/checkIsUserExist';
import { createUserWithdata } from '../utils/createNewUser';
import { Coin } from '../model/coin';
import { User } from '../model/user';
import { portfolioValue } from '../service/coinGeco';

export async function checkCoinsValue ( UserName: string ): Promise<string> {

    const { coins, currency } = await UserModel.findOne( { name: UserName } );
    let totalValue = 0;

    for ( const coin of coins ) {
        const ratio = await portfolioValue( coin.name );

        totalValue = totalValue + Number( ratio ) * coin.value;
    }

    return `${totalValue.toFixed( 4 )}  ${currency}`;
};

export async function addNewCoin ( userName: string, coinName: string, value: number ): Promise<string> {

    if ( isNaN( value ) ) return '⛔Value must be a number⛔';

    const isUserExist = await checkIfUserExist( userName );

    if ( !isUserExist ) {
        await createUserWithdata( userName, coinName, value );
        return `👤👤👤 new user created:
		new coin: 💰${coinName}💰 was added`;
    }

    const { coins } = await UserModel.findOne( { name: userName } );

    console.log( 'coin', coins );

    const newCoin: Coin = {
        name: coinName,
        value: value
    };

    for ( const coin of coins ) {
        if ( coin.name === coinName ) return '⛔coin already added⛔';
    }
    const newCoinList = [ ...coins, newCoin ];

    await UserModel.updateOne( { name: userName }, {
        coins: newCoinList
    } );

    return `💰 coin ${coinName} have been successfully added with quantity: ${value}.
    💸💸💸💸
	If you want to change a quantity, please type: 
	change:coinName=NewValue
	example:
	change:bitcoin=11`;
};

export async function changeCoinQuantity ( userName: string, coinName: string, newQuantity: number ): Promise<string> {

    if ( isNaN( newQuantity ) ) return '⛔Value must be a number⛔';
    const filter = { name: userName, 'coins.name': coinName };
    const update = { $set: { 'coins.0.value': newQuantity } };

    let doc = await UserModel.findOneAndUpdate( filter, update, {
        new: true
    } );

    if ( !doc ) return `⛔You do not have coin: ${coinName}⛔`;

    return `Quantity od coin: ${coinName} have been successfully changed of ${newQuantity}`;
};

export async function changeCurrency ( userName: string, currency: string ): Promise<string> {

    const filter = { name: userName };
    const update = { $set: { 'currency': currency } };

    await UserModel.findOneAndUpdate( filter, update, {
        new: true
    } );

    return `Currency change at ${currency}`;
};

export async function userDetail ( userName: string ): Promise<User> {
    const result = await UserModel.find( { name: userName } );
    const user: User = {
        name: result[0].name,
        coins: result[0].coins,
        currency: result[0].currency
    };
    return user as User;
};



