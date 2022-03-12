import { UserModel } from '../schema/user.schema';
import { Coin, Currencies } from '../models/coin';
import { getPrice } from '../utils/getPrice';

export async function createUserWithdata (name: string, coins: Coin[], currency: Currencies
): Promise<void> {

	const user = new UserModel({
		name,
		coins,
		currency
	});
	await user.save();

	console.log(user.name, user.currency, user.coins
	);
};

export async function checkCoinsValue (UserName: string): Promise<string> {

	const { coins, currency } = await UserModel.findOne({ name: UserName });
	let totalValue = 0;

	for (const coin of coins) {
		const ratio = await getPrice(coin.name);

		totalValue = totalValue + Number(ratio) * coin.value;
	}

	return `${totalValue.toFixed(4)}  ${currency}`;
};

export async function addNewCoin (UserName: string, coinName: string, value: number): Promise<string> {

	if (isNaN(value)) return 'Value must be a number';

	const { coins } = await UserModel.findOne({ name: UserName });

	const newCoin: Coin = {
		name: coinName,
		value: value
	};

	for (const coin of coins) {
		if (coin.name === coinName) return 'coin already added';
	}
	const newCoinList = [...coins, newCoin];

	await UserModel.updateOne({ name: UserName }, {
		coins: newCoinList
	});

	return `coin ${coinName} have been succesfully added with quantity of ${value}.
	If you want to change a quantity, please type: 
	change:coinName=NewValue
	example:
	change:bitcoin=11`;

};



