export interface CoinGecoData {
    id: string,
    symbol: string,
    name: string,
    block_time_in_minutes: null | number,
    image: object,
    market_data: object,
    last_updated: string,
    localization: object
}