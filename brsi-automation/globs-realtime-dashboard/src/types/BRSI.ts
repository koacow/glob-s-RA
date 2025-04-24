import { Database } from "./database.supabase";

export interface BRSIQueryParams {
    actor1CountryCode: string | null;
    actor2CountryCode: string | null;
    startDate: string | null;
    endDate: string | null;
}

export interface BRSIResponse {
    actor1CountryCode: string;
    actor2CountryCode: string;
    startDate: string;
    endDate: string;
    aggregateLevel: 'daily' | 'monthly' | 'yearly';
    numRecords: number;
    records: {
        actor1CountryCode: string;
        actor2CountryCode: string;
        year: number;
        month?: number;
        day?: number;
        avgGoldsteinScale: number;
    }[];
}

export interface BRSIData {
    actor1CountryCode: string;
    actor2CountryCode: string;
    startDate: string;
    endDate: string;
    aggregateLevel: 'daily' | 'monthly' | 'yearly';
    numRecords: number;
    records: {
        actor1CountryCode: string;
        actor2CountryCode: string;
        date: Date;
        avgGoldsteinScale: number;
        day?: number;
        month?: number;
        year: number;
    }[];
}