import { UserModel } from '../schema/user.schema';
import { getPrice } from '../utils/getPrice';
import { checkIfUserExist } from '../utils/checkIsUserExist';
import { createUserWithdata } from '../utils/createNewUser';
import { Coin } from '../models/coin';

export async function checkCoinsValue (UserName: string): Promise<string> {

	const { coins, currency } = await UserModel.findOne({ name: UserName });
	let totalValue = 0;

	for (const coin of coins) {
		const ratio = await getPrice(coin.name);

		totalValue = totalValue + Number(ratio) * coin.value;
	}

	return `${totalValue.toFixed(4)}  ${currency}`;
};

export async function addNewCoin (userName: string, coinName: string, value: number): Promise<string> {

	if (isNaN(value)) return 'Value must be a number';

	const isUserExist = await checkIfUserExist(userName);

	if ( !isUserExist) {
		await createUserWithdata(userName, coinName, value);
		return `new user created:
		new coin: ${coinName} was added`;
	}

	const { coins } = await UserModel.findOne({ name: userName });

	console.log('coin', coins);

	const newCoin: Coin = {
		name: coinName,
		value: value
	};

	for (const coin of coins) {
		if (coin.name === coinName) return 'coin already added';
	}
	const newCoinList = [...coins, newCoin];

	await UserModel.updateOne({ name: userName }, {
		coins: newCoinList
	});

	return `coin ${coinName} have been successfully added with quantity of ${value}.
	If you want to change a quantity, please type: 
	change:coinName=NewValue
	example:
	change:bitcoin=11`;
};

export async function changeCoinQuantity (userName: string, coinName: string, newQuantity: number): Promise<string> {

	if (isNaN(newQuantity)) return 'Value must be a number';
	const filter = { coins: coinName };
	const update = { value: 22 };

	console.log(filter);

	let doc = await UserModel.findOneAndUpdate(filter, update, {
		new: true
	});

	console.log(doc);

	return `coin ${coinName} have been successfully changed with quantity of ${newQuantity}`;
};



