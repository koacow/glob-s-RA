# glob-s-RA

## Projects

### GDELT 1.0 Data Pull

Stored in the `pull-gdelt` directory.

Includes a script pulls GDELT 1.0 data using the Google BigQuery Python client library. It pulls aggregated monthly data for a specified year range and saves it to a single CSV file. The script uses the `dask DataFrame` library to handle large datasets efficiently. The script also includes error handling and logging. The script is designed to be run from the command line. 

### Automation of Bilateral Relations Data Pull

Stored in the `brsi-automation` directory.

A tool that automates the process of pulling bilateral relations data from the GDELT 1.0 database, displaying it to a user-friendly dashboard, and exposes an API layer for users to request data on their behalf. It aims to be updated daily with the latest data from the GDELT database. Will be integrated with the GLOB~S Lab website.