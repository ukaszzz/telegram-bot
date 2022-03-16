import {Coin, Currencies} from "./coin";

export interface User {
    name: string,
    coins: Coin,
    currency: Currencies
}

