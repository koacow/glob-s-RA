# glob-s-RA

## Scripts

### `pull-gdelt.py`

This script pulls GDELT 1.0 data using the Google BigQuery Python client library. It pulls aggregated monthly data for a specified year range and saves it to a single CSV file. The script uses the `dask DataFrame` library to handle large datasets efficiently.