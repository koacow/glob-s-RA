import axios from 'axios';
import config from '../config/config';

import { BRSIResponse } from '../types/brsi';
import { DataOptions } from '../types/DataOptions';


const fetchBRSI:(options: DataOptions) => Promise<BRSIResponse> = async (options) => {
    const { actor1CountryCode, actor2CountryCode, startDate, endDate, aggregateLevel } = options;
    const endpoint = `${config.API_URL}/brsi/${aggregateLevel}?actor1CountryCode=${actor1CountryCode}&actor2CountryCode=${actor2CountryCode}&startDate=${startDate.format('YYYY-MM-DD')}&endDate=${endDate.format('YYYY-MM-DD')}`;
    try {
        const response = await axios.get<BRSIResponse>(endpoint);
        console.log('BRSI latest data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching BRSI latest data:', error);
        throw new Error('Failed to fetch BRSI latest data');
    }
};

export default fetchBRSI;