import { Dayjs } from "dayjs";

export interface DataOptions {
    actor1CountryCode: string;
    actor2CountryCode: string;
    startDate: Dayjs;
    endDate: Dayjs;
    aggregateLevel: 'daily' | 'monthly' | 'yearly';
}