import { BigQuery } from '@google-cloud/bigquery';
import { Database } from '../models/supabase';
import supabase from '../config/supabase';

type GDELTRowUpdate = Database['public']['Tables']['gdelt_monthly']['Insert']


async function pullGdeltData(): Promise<GDELTRowUpdate[]> {
    const bigqueryClient = new BigQuery();
    const year = new Date().getFullYear();
    const query = (
        `WITH CalculatedAverages AS (
            SELECT
                cp.Actor1CountryCode AS Country,
                cp.Actor2CountryCode AS PartnerCountry,
                EXTRACT(MONTH FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventMonth,
                EXTRACT(YEAR FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventYear,
                AVG(e.GoldsteinScale) AS AvgGoldsteinScale
            FROM
                \`218_Countries.Pairs\` cp  -- Use the correct dataset and table name here
            JOIN
                \`gdelt-bq.full.events\` e
            ON cp.Actor1CountryCode = e.Actor1CountryCode AND cp.Actor2CountryCode = e.Actor2CountryCode
            WHERE
                e.Year = ${year}  -- Adjust this to the specific year you're interested in
            GROUP BY
                Country,
                PartnerCountry,
                EventMonth,
                EventYear
        )
        SELECT 
            Country AS Actor1CountryCode,
            PartnerCountry AS Actor2CountryCode,
            CAST(EventYear AS INT64) AS Year,
            CAST(EventMonth AS INT64) AS Month, 
            AvgGoldsteinScale
        FROM 
            CalculatedAverages`
    );
    const options = {
        query: query,
        location: 'US',
    };
    try {
        const [job] = await bigqueryClient.createQueryJob(options);
        console.log(`Job ${job.id} started. Querying new GDELT data on ${new Date().toISOString()}`);
        const [rows] = await job.getQueryResults();
        console.log(`Job ${job.id} completed. Retrieved ${rows.length} rows.`);
        return rows as GDELTRowUpdate[];
    } catch (error) {
        console.log(`Error executing query: ${error}`);
        return [];
    }
}

async function updateSupabaseGdeltData(rows: GDELTRowUpdate[]) {

    try {
        const { data, error } = await supabase
            .from('gdelt_monthly')
            .upsert(rows, { 
                onConflict: 'Actor1CountryCode, Actor2CountryCode, Year, Month',
                count: 'exact',
                ignoreDuplicates: false, 
            })
            .select();
        if (error) {
            console.log(`Error inserting/updating data in Supabase: ${error.message}`);
        } else {
            console.log(`Inserted/updated ${data.length} rows in Supabase.`);
        }
    } catch (error) {
        console.log(`Error updating Supabase: ${error}`);
    }
}
// Uncomment the following line to run the test function
// async function test() {
//     const rows = await pullGdeltData();
//     if (rows.length > 0) {
//         console.log('Test: Retrieved GDELT data:', rows);
//         await updateSupabaseGdeltData(rows);
//         console.log('Test: Updated Supabase with GDELT data.');
//     } else {
//         console.log('Test: No new GDELT data to update.');
//     }
// }

export default async function runJob() {
    const rows = await pullGdeltData();
    if (rows.length > 0) {
        await updateSupabaseGdeltData(rows);
    } else {
        console.log('No new GDELT data to update.');
    }
}
