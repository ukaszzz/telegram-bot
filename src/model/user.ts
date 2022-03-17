import { Coin } from './coin';
import { CurrenciesAvailable } from './currenciesAvailable';

export interface User {
    name: string,
    coins: Coin[],
    currency: CurrenciesAvailable
}

