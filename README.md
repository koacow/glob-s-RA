# glob-s-RA

## Projects

### GDELT 1.0 Data Pull

Stored in the `pull-gdelt` directory.

Includes a script pulls GDELT 1.0 data using the Google BigQuery Python client library. It pulls aggregated monthly data for a specified year range and saves it to a single CSV file. The script uses the `dask DataFrame` library to handle large datasets efficiently. The script also includes error handling and logging. The script is designed to be run from the command line. 

### Automation of Bilateral Relations Data Pull

Stored in the `brsi-automation` directory.

A tool that automates the process of pulling bilateral relations data from the GDELT 1.0 database, displaying it to a user-friendly dashboard, and exposes an API layer for users to request data on their behalf. It aims to be updated daily with the latest data from the GDELT database. Will be integrated with the GLOB~S Lab website.

### Radical Innovation Measures using Patents

Stored in the `patents` directory.

I engineered three radical innovation measures using Cooperative Patent Classification (CPC) codes to assess the level of innovation in different U.S. geographical regions.

### Callaway Sant'Anna (2021) Difference in Differences Analysis

Stored in the `patents` and `firms-and-disasters` directories.

Used the dynamic Difference in Differences analysis method outlined in Callaway Sant'Anna (2021) to assess the impact of disasters on firm strategy. This analysis is ued in two projects:

1. U.S. Geographical Grid Innovation in the face of Shocks (1980 - 2022): uses the Radical Innovation Measures, census data from various U.S. bureaus, and U.S. geographical grids to assess how natural disasters affect the level of innovation in the U.S.
2. Brazilian Firm Wage Structure in the face of Shocks (2003 - 2017): uses Brazilian firms' financial data (wage structure) to assess how natural disasters affect the wage disparity between vulnerable and non-vulnerable groups.
