import { UserModel } from '../schema/user.schema';

export async function createUserWithdata (name: string, coinName: string, coinValue: number
): Promise<void> {

    const user = new UserModel({
        name,
        coins: {
            name: coinName,
            value: coinValue
        },
        currency: 'USD'
    });
    await user.save();
};