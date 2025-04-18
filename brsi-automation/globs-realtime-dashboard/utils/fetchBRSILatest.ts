import axios from 'axios';
import config from '../config/config';



export type BRSILatestResponse = {
    actor1CountryCode: string;
    actor2CountryCode: string;
    range: '5D' | '1M' | '1M' | '3M' | '1Y' | '5Y' | 'MAX';
    numRecords: number;
    records: {
        Actor1CountryCode: string;
        Actor2CountryCode: string;
        AvgGoldsteinScale: number;
        created_at: string;
        Day: number;
        Month: number;
        Year: number;  
        Date: Date;     
    }[];
};

const fetchBRSILatest: (actor1CountryCode: string, actor2CountryCode: string, range: '5D' | '1M' | '3M' | '1Y' | '5Y' | 'MAX') => Promise<BRSILatestResponse> = async (actor1CountryCode, actor2CountryCode, range) => {
    const endpoint = `${config.API_URL}/brsi/latest?actor1CountryCode=${actor1CountryCode}&actor2CountryCode=${actor2CountryCode}&range=${range}`;
    try {
        const response = await axios.get<BRSILatestResponse>(endpoint);
        response.data.records = response.data.records.map((record) => ({
            ...record,
            Date: new Date(`${record.Year}-${record.Month}-${record.Day}`),
        }));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching BRSI latest data:', error);
        throw new Error('Failed to fetch BRSI latest data');
    }
};

export default fetchBRSILatest;