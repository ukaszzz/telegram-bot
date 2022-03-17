import { UserModel } from '../schema/user.schema';

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
};