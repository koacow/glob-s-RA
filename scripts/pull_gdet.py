from google.cloud import bigquery
from datetime import datetime
import dask.dataframe as dd
import pandas as pd
import os
import sys

def getGDELTData(year):
    """
    Fetch GDELT data for a specific year and write it to a CSV file.
    """
    if not isinstance(year, int):
        raise ValueError("Year must be an integer")
    if year < 1995 or year > 2025:
        raise ValueError("Year must be between 1995 and 2025")
    client = bigquery.Client()
    print(f"Fetching GDELT data for year {year}...")
    query = f"""
        WITH CalculatedAverages AS (
            SELECT
                cp.Actor1CountryCode AS Country,
                cp.Actor2CountryCode AS PartnerCountry,
                EXTRACT(MONTH FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventMonth,
                EXTRACT(YEAR FROM PARSE_DATE('%Y%m%d', CAST(e.SQLDATE AS STRING))) AS EventYear,
                AVG(e.GoldsteinScale) AS AvgGoldsteinScale
            FROM
                `218_Countries.Pairs` cp  -- Use the correct dataset and table name here
            JOIN
                `gdelt-bq.full.events` e
            ON cp.Actor1CountryCode = e.Actor1CountryCode AND cp.Actor2CountryCode = e.Actor2CountryCode
            WHERE
                e.Year = {year}  -- Adjust this to the specific year you're interested in
            GROUP BY
                Country,
                PartnerCountry,
                EventMonth,
                EventYear
        )
        SELECT 
            Country AS Actor1CountryCode,
            PartnerCountry AS Actor2CountryCode,
            FORMAT('%04d/%02d', EventYear, EventMonth) AS YYYYMM,
            AvgGoldsteinScale
        FROM 
            CalculatedAverages
    """
    rows = client.query_and_wait(query)
    rows_df = rows.to_dataframe()
    print(f"Fetched {len(rows_df)} rows for year {year}.")
    rows_df.to_csv(f'./query-results/gdelt_{year}.csv', index=False)
    return 

def processSampleData():
    """
    Process all files in the './sample-data' directory, merge them into one DataFrame, and write to a CSV file.
    """
    sample_data_dir = './sample-data'
    output_file = './merged_sample_data.csv'
    
    if not os.path.exists(sample_data_dir):
        raise FileNotFoundError(f"The directory {sample_data_dir} does not exist.")
    
    # List all CSV files in the directory
    csv_files = [os.path.join(sample_data_dir, f) for f in os.listdir(sample_data_dir) if f.endswith('.csv')]
    
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in the directory {sample_data_dir}.")
    
    # Read and concatenate all CSV files using Dask
    ddf = dd.read_csv(csv_files)
    merged_df = ddf.compute()
    
    # Write the merged DataFrame to a CSV file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    merged_df.to_csv(output_file, index=False)
    return

def processGDELTData(start_year=1995, end_year=2025):
    """
    Process GDELT data for a range of years, save individual year results, 
    and merge them into a single CSV file.
    """
    if not isinstance(start_year, int) or not isinstance(end_year, int):
        raise ValueError("Start year and end year must be integers")
    if start_year < 1995 or end_year > 2025:
        raise ValueError("Years must be between 1995 and 2025")
    if start_year > end_year:
        raise ValueError("Start year must be less than or equal to end year")
    
    print(f"Fetching GDELT data from {start_year} to {end_year}...")
    query_results_dir = './query-results'
    output_dir = './output'
    merged_output_file = os.path.join(output_dir, 'merged_gdelt_data.csv')
    
    # Ensure directories exist
    os.makedirs(query_results_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)
    
    # Query data for each year and save to CSV
    for year in range(start_year, end_year + 1):
        getGDELTData(year)
    
    # List all CSV files in the query-results directory
    csv_files = [os.path.join(query_results_dir, f) for f in os.listdir(query_results_dir) if f.endswith('.csv')]
    
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in the directory {query_results_dir}.")
    
    # Merge all CSV files into a single Dask DataFrame
    ddf = dd.read_csv(csv_files)
    merged_df = ddf.compute()
    
    # Write the merged DataFrame to a CSV file
    merged_df.to_csv(merged_output_file, index=False)
    print(f"Merged GDELT data saved to {merged_output_file}.")
    print("Done.")
    return

def printHelp():
    """
    Print help message.
    """
    print("Usage: python pull_gdet.py [start_year] [end_year]")
    print("Fetch GDELT data for the specified range of years.")
    print("Default range is from 1995 to the current year.")
    print("Options:")
    print("  -h, --help    Show this help message and exit.")
    print("Example:")
    print("python3 pull_gdet.py 2000 2020")
    return

def main():
    args = sys.argv[1:]
    if len(args) == 0 or '-h' in args or '--help' in args:
        printHelp()
        return
    for arg in args:
        if not arg.isdigit():
            print(f"Invalid argument: {arg}. Arguments must be integers.")
            print("Use -h or --help for usage information.")
            return

    start_year = sys.argv[1] if len(sys.argv) > 1 else 1995
    end_year = sys.argv[2] if len(sys.argv) > 2 else datetime.now().year
    start_year = int(start_year)
    end_year = int(end_year)
    processGDELTData(start_year, end_year)

if __name__ == "__main__":
    main()