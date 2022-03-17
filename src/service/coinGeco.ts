const CoinGecko = require( 'coingecko-api' );

const CoinGeckoClient = new CoinGecko();

// export const coinList = async (): Promise<string[]> => {
//     try {
//         let data = await CoinGeckoClient.coins.all( {
//             per_page: 200
//         } );
//         const coinList = data.data.map( ( el: CoinGecoData ) => console.log( {
//             id: el.id,
//             name: el.name,
//             symbol: el.symbol
//         } ) );
//         // console.log( coinList );
//         // return coinList;
//     } catch (err) {
//         console.log( err );
//         return undefined;
//     }
// };

export const getCoinsMarketValue = async ( coinNamesList: string[], coinsListValues: number[] ): Promise<number> => {
    let totalValue = 0;
    try {
        let { data } = await CoinGeckoClient.simple.price( {
            ids: coinNamesList
        } );

        coinNamesList.forEach( ( el, i ) => {
            totalValue += data[el].usd * coinsListValues[i];
            console.log( totalValue );
        } );
        return totalValue;
    } catch (err) {
        console.log( err );
        return undefined;
    }
};