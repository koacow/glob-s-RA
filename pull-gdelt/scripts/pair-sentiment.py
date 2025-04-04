from google.cloud import bigquery
from datetime import datetime
import dask.dataframe as dd
import matplotlib.pyplot as plt
import pandas as pd

def getGDELTDataForCountry(partnerCountry, startYear, endYear):
    client = bigquery.Client()
    print(f"Fetching GDELT for {partnerCountry} from {startYear} to {endYear}...")
    # Define the SQL query to fetch data
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
                cp.Actor2CountryCode = '{partnerCountry}' AND
                e.Year BETWEEN {startYear} AND {endYear}
            GROUP BY
                Country,
                PartnerCountry,
                EventMonth,
                EventYear
        )
        SELECT 
            Country AS Actor1CountryCode,
            PartnerCountry AS Actor2CountryCode,
            CAST(EventYear AS INT64) AS YYYY,
            CAST(EventMonth AS INT64) AS MM, 
            AvgGoldsteinScale
        FROM 
            CalculatedAverages
    """
    rows = client.query_and_wait(query)
    rows_df = rows.to_dataframe()
    print(f"Fetched {len(rows_df)} rows for year {startYear} to {endYear}.")
    # Write the DataFrame to a CSV file
    rows_df.to_csv(f'./query-results/gdelt_{partnerCountry}_{startYear}_{endYear}.csv', index=False)
    return 


def plotAverageSentimentTowardsUSA():
    df = dd.read_csv('./query-results/gdelt_USA_2024_2025.csv')
    df = df.compute()
    
    # Filter for rows where Actor2CountryCode is 'USA' 
    usa_df = df[(df['Actor2CountryCode'] == 'USA') & (df['Actor1CountryCode'] == 'ISR')]
    
    # Group by year and month, then calculate the average sentiment
    usa_df['Date'] = dd.to_datetime(usa_df['YYYY'].astype(str) + '-' + usa_df['MM'].astype(str) + '-01')
    avg_sentiment = usa_df.groupby('Date')['AvgGoldsteinScale'].mean().reset_index()
    
    # Plot the average sentiment over time
    plt.figure(figsize=(10, 6)) 
    plt.plot(avg_sentiment['Date'], avg_sentiment['AvgGoldsteinScale'], marker='o', linestyle='-')
    plt.title('Average Monthly Sentiment of Israel Towards USA')
    plt.xlabel('Date')
    plt.ylabel('Average Goldstein Scale')
    plt.grid(True)
    plt.show()


if __name__ == "__main__":
    # Example usage
    plotAverageSentimentTowardsUSA()