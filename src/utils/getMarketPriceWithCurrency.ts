import { CurrenciesName } from '../model/currencies';
import { Currencies } from '../model/coin';
import axios from 'axios';

const url = 'https://api.coincap.io/v2';

export const getMarketPriceWithCurrency = async ( totalValue: number, currency: Currencies ): Promise<number | undefined> => {
    const curreny = CurrenciesName[currency];
    try {
        const response = await axios.get( `${url}/rates/${curreny}` );
        return totalValue / response.data.data.rateUsd;
    } catch (err) {
        console.log( err );
        return undefined;
    }
};