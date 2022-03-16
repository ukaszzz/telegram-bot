import { CoinGecoData } from '../model/coinGecoData';

const CoinGecko = require( 'coingecko-api' );

const CoinGeckoClient = new CoinGecko();
export const coinList = async (): Promise<string[]> => {
    try {
        let data = await CoinGeckoClient.coins.all( {
            per_page: 200
        } );
        const coinList = data.data.map( ( el: CoinGecoData ) => el.name );
        console.log( coinList );
        return coinList;
    } catch (err) {
        console.log( err );
        return undefined;
    }
};