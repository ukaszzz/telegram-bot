import { CurrenciesNames } from '../model/currenciesNames';
import { Currencies } from '../model/currencies';
import config from '../config/default';
import axios from 'axios';

export const getMarketPriceWithCurrency = async ( totalValue: number, currency: Currencies ): Promise<number | undefined> => {
    const curreny = CurrenciesNames[currency];
    try {
        const response = await axios.get( `${config.urlToCheckRatio}/rates/${curreny}` );
        return totalValue / response.data.data.rateUsd;
    } catch (err) {
        console.log( err );
        return undefined;
    }
};