import dask.dataframe as dd
from supabase import create_client, Client
from supabase.client import ClientOptions
import os
from dotenv import load_dotenv
from google.cloud import bigquery

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(
                                    url,
                                    key,
                                )

def fetch_gdelt_data_for_year_and_month(year, month):
    if not isinstance(year, int):
        raise ValueError("Year must be an integer")
    if year < 1995 or year > 2025:
        raise ValueError("Year must be between 1995 and 2025")
    if not isinstance(month, int):
        raise ValueError("Month must be an integer")
    if month < 1 or month > 12:
        raise ValueError("Month must be between 1 and 12")
    client = bigquery.Client()
    print(f"Fetching GDELT data for {year}-{month:02d}...")
    query = f'''
    WITH DailyAverages AS (
        SELECT
            cp.Actor1CountryCode AS Country,
            cp.Actor2CountryCode AS PartnerCountry,
            EXTRACT(MONTH FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventMonth,
            EXTRACT(YEAR FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventYear,
            EXTRACT(DAY FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventDay,
            AVG(e.GoldsteinScale) AS AvgGoldsteinScale
        FROM
            `218_Countries.Pairs` cp  -- Use the correct dataset and table name here
        JOIN
            `gdelt-bq.full.events` e
        ON cp.Actor1CountryCode = e.Actor1CountryCode AND cp.Actor2CountryCode = e.Actor2CountryCode
        WHERE
            e.MonthYear = {year}{month:02d}
        GROUP BY
            Country,
            PartnerCountry,
            EventMonth,
            EventYear,
            EventDay
    )
    SELECT 
        Country AS Actor1CountryCode,
        PartnerCountry AS Actor2CountryCode,
        EventDay AS Day,
        EventMonth AS Month,
        EventYear AS Year,
        AvgGoldsteinScale
    FROM 
        DailyAverages
    '''
    try:
        rows = client.query_and_wait(query)
    except Exception as e:
        print(f"Error fetching data for {year}-{month:02d}: {e}")
        raise
    
    try:
        rows = rows.to_dataframe()
        sizeBefore = rows.shape[0]
        rows.dropna(inplace=True)
        sizeAfter = rows.shape[0]
        print(f"Removed {sizeBefore - sizeAfter} rows with NaN values.")
        rows = rows.to_dict(orient="records")
    except Exception as e:
        print(f"Error converting rows to DataFrame: {e} for {year}-{month:02d}")
        raise

    print("Fetched %d rows for year %d.", len(rows), year)
    return rows
    

def upload_to_supabase(rows):
    """
    Upload the fetched GDELT data to Supabase.
    """
    if not rows or not isinstance(rows, list):
        raise ValueError("Rows must be a non-empty list")
    print(f"Uploading {len(rows)} rows to Supabase...")
    supabase.table("gdelt_daily").insert(rows).execute()
    print("Data upload completed.")


if __name__ == "__main__":
    # Database currently contains data up to December 2012.
    startYear = 2012
    endYear = 2026
    print(f"Fetching and uploading GDELT data from {startYear} to {endYear - 1}...")
    for year in range(startYear + 1, endYear):
        for month in range (1, 13):
            try:
                rows = fetch_gdelt_data_for_year_and_month(year, month)
                upload_to_supabase(rows)
            except Exception as e:
                print(f"Error processing year {year} month {month}: {e}, aborting.")

    print("Done.")

