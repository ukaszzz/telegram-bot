import axios from 'axios';

const url = 'https://api.coincap.io/v2';

export const getPrice = async (coin: string): Promise<number | undefined> => {
    try {
        const response = await axios.get(`${url}/rates/${coin}`);
        return response.data.data.rateUsd;
    } catch (err) {
        console.log(err);
        return undefined;
    }
};