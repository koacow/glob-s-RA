# Latest GDELT Data Pull

March 29, 2025 15:02 EST

## Overview

- Used the Google Cloud client library to pull the latest GDELT data (January 1995 - March 2025)
- The data was pulled individually for each year and then merged into a single file.
- Used `Dask` instead of `Pandas` to handle the large dataset efficiently.
- No errors were encountered during the data pull process and the data seems to be clean.

## Files

- `merged_gdelt_data_20250329_1502.csv`: Merged GDELT data file; contains data monthly GDELT data from **January 1995 to March 2025**. Dataset contains 3066053 non-null rows and 4 columns. Size: 82.56 MB.
- `gdelt_\[YEAR\].csv`: Individual GDELT data files for each year from **January 1995 to March 2025**. Each file contains data for a specific year (12 months per year except for 2025). The files are named in the format `gdelt_YYYY.csv`, where `YYYY` is the year.
- `pull_gdelt_20250329_1502.log`: Log file containing the output of the GDELT data pull process. The log file contains information about the files that were pulled, the description of each dataset (number of rows, non-null values, etc), and any errors that occurred during the process.
- `pull_gdelt.py`: Python script used to pull the GDELT data. The script uses the Google Cloud client library to pull the data and Dask to handle the large dataset efficiently. The script also includes error handling and logging. **Required libraries: `google.cloud`, `dask`, `pandas`. Execute `python pull_gdelt.py -h` for usage instructions. Need to have the following directories in the current working directory: `output`, `logs`, `query-results`.**

## Getting Started

1. Install Google Cloud client library:

    ```bash
    pip install --upgrade google-cloud
    ```

2. Authenticate your Google Cloud account:

    ```bash
    gcloud auth application-default login
    ```

3. Install Script dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Run the script with the -h option to see the usage instructions:

    ```bash
    python3 pull_gdelt.py -h
    ``` 

