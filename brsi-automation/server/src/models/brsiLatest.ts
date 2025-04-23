import { Database } from "./database.supabase";

export interface BRSILatestQueryParams {
    actor1CountryCode: string | null;
    actor2CountryCode: string | null;
    startDate: string | null;
    endDate: string | null;
}

export interface BRSILatestResponse {
    actor1CountryCode: string;
    actor2CountryCode: string;
    startDate: string;
    endDate: string;
    aggregateLevel: string;
    numRecords: number;
    records: Database["public"]["Functions"]["getbrsirecordsaggregatedbyday"]["Returns"] | Database["public"]["Functions"]["getbrsirecordsaggregatedbymonth"]["Returns"] | Database["public"]["Functions"]["getbrsirecordsaggregatedbyyear"]["Returns"];
}