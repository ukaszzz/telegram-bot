const CoinGecko = require( 'coingecko-api' );
const CoinGeckoClient = new CoinGecko();

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