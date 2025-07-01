# Building a Panel Dataset of control variables for U.S. Counties

## Overview

This repository contains code to clean raw data from various sources and create a panel dataset of control variables for all counties in the United States, including Puerto Rico and the U.S. Virgin Islands. The data spans
from 1980 to 2022, with the highest availability from 2012 onwards.

Variables include:

- FIPS code
- Year
- Total population
- Demographic percentages (White, Black, Asian, and Other)
- Bachelor's degree or higher percentage
- Median household income
- Total personal income
- Unemployment rate
- Real GDP (in chained 2017 dollars)
- 2013 Rural-Urban Continuum Codes (RUCC)

Working directory: `GLOB~S/Data/U.S. County Data/county_controls`

## Data Sources

All downloaded raw data files are stored in the `./data` directory. The following sources are used:

- **American Community Survey (ACS) Detailed 5-year tables**: 
    - [ACS 5-Year Detailed Tables](https://www.census.gov/programs-surveys/acs/data.html)
    - Tables used:
        - `B01003`: Total population
        - `B02001`: Demographic-specific population
        - `B15003`: Educational attainment counts
        - `B19013`: Median household income
    - Availability: all counties.
        - `B01003`: 2010 - 2022
        - `B02001`: 2010 - 2022
        - `B15003`: 2012 - 2022
        - `B19013`: 2010 - 2022
    - Merged dataset: `./data/ACSDT5Y_2010_2022/acs_2010_2022.csv`
    - Note: the raw data is downloaded as separate CSV files for each year and variable. The data is then concatenated into a single CSV file for each variable, and finally all variables are merged into a single dataset using FIPS codes and year. 
- **Decennial Census**
    - [Decennial Census Summary File 1](https://data2.nhgis.org/main)
    - Variables used:
        - Total population
        - Demographic-specific population
    - Tables used:
        - `1980 STF 1 - 100% Data`
        - `1990 STF 1 - 100% Data`
        - `2000 Census SF1a - 100% Data [Areas Larger than Block Groups]`
        - `2010 Census SF1a - P & H Tables [Blocks & Larger Areas]`
        - `2020 Census PL 94-171 Redistricting Data Summary File`
    - Availability: all counties. 1980, 1990, 2000, 2010, 2020.
    - Merged dataset: `./data/NHGIS_RACE_BY_COUNTY_1980_2020/sf1_1980_2020.csv`
    - Note: each table is a separate CSV file. Then, all tables are concatenated into a single CSV file.
- **Bureau of Economic Analysis (BEA)**
    - [BEA County GDP Data](https://www.bea.gov/data/gdp/gdp-county-metro-and-other-areas)
    - Tables used:
        - `CAGDP1`: GDP by county
        - `CAINC1`: Personal income by county
    - Availability: all counties.
        - `CAGDP1`: 2001 - 2022
        - `CAINC1`: 1980 - 2022
    - Merged dataset: `./data/BEA_COUNTY_1969_2022/bea_county_income_gdp_1980_2022.csv`
    - Note: each table is a separate CSV file, containing data for all counties for all years. The data is then merged into a single dataset using FIPS codes and year.
- **Bureau of Labor Statistics (BLS)**
    - [BLS Local Area Unemployment Statistics (LAUS)](https://www.bls.gov/lau/data.htm)
    - Variables used:
        - Unemployment rate (%)
    - Availability: all counties. 1990 - 2022.
    - Merged dataset: `./data/BLSLAUCN_1990_2022/bls_county_unemployment_1990_2022.csv`
    - Note: the raw data is downloaded as a single CSV file for each year. The data is then concatenated into a single CSV file for all years.
- **U.S. Department of Agriculture (USDA)**
    - [USDA Rural-Urban Continuum Codes (RUCC)](https://www.ers.usda.gov/data-products/rural-urban-continuum-codes/)
    - Variables used:
        - 2013 RUCC
    - Availability: all counties. 2013.
    - Merged dataset: `./data/USDA_ERS_RUCC_2013/usda_rural_urban_codes.csv`

## Creating the Panel Dataset

The `create_county_panel.ipynb` notebook contains the code to create the panel dataset. The steps are as follows:

1. Left join the ACS data with the Decennial Census data to get median household income, total population, and demographic-specific population for all years. Overwrite the ACS population and demographic counts with the Decennial Census values for 1980, 1990, 2000, 2010, and 2020.
2. Compute the percentage of bachelor's or higher degree holders and percentages of each demographic group (White, Black, Asian, and Other). Drop the raw counts.
3. Create a dataframe with all FIPS code x year combinations for all unique FIPS code in the ACS/SF1 dataset and all years from 1980 to 2022.
4. Left join the dataframe from (2) with the ACS data using FIPS code and year as keys.
5. Left join the dataframe from (3) with the BEA County GDP and Personal Income data using FIPS code and year as keys.
6. Left join the dataframe from (4) with the BLS Unemployment data using FIPS code and year as keys.
7. Left join the dataframe from (5) with the USDA Rural-Urban Continuum Codes data using FIPS code as the key.
8. Use pandas linear interpolation to fill in missing values for the ACS/SF1 data in both directions (foward a nd backward) for each FIPS code.
9. Use pandas linear interpolation to fill in missing values for the BEA and BLS data in both directions (foward and backward) for each FIPS code. Leave gaps of more than 2 years as NaN.
10. Save the final panel dataset as a Parquet file: `./data/county_controls_1980_2022.parquet`.

## Data Dictionary

| Variable Name            | Description | Data Type | Units |
|--------------------------|-------------|-----------|-------|
| `FIPS5`                  | 5-digit FIPS code for the county | Non-null String | |
| `year`                   | Year of the observation | Non-null Integer | year (YYYY) |
| `total_population`       | Total population of the county | Nullable Integer |
| `white_pct`              | Percentage of population that is White-only | Nullable Float | % |
| `black_pct`              | Percentage of population that is Black-only | Nullable Float | % |
| `asian_pct`              | Percentage of population that is Asian-only | Nullable Float | % |
| `other_pct`              | Percentage of population of other races| Nullable Float | % |
| `bachelors_pct`         | Percentage of population with a bachelor's degree or higher | Nullable Float | % |
| `median_household_income` | Median household income in the county | Nullable Integer | 2010 Inflation-adjusted USD |
| `personal_income`       | Total personal income in the county | Nullable Integer | Thousands of USD |
| `rgdp`                  | Real GDP in the county | Nullable Integer | Thousands of chained 2017 USD |
| `unemployment_rate`     | Unemployment rate in the county | Nullable Float | % |
| `RUCC_2013`                  | 2013 Rural-Urban Continuum Code | Nullable Integer | |

## Data Availability

### Availability before Interpolation

|            Variable     |   Missing (%) |   Non-Missing (%) |   Null Count |   Non-Null Count |
|:------------------------|--------------:|------------------:|-------------:|-----------------:|
| FIPS5                   |      0        |          100      |            0 |           139492 |
| year                    |      0        |          100      |            0 |           139492 |
| median_household_income |     69.9868   |           30.0132 |        97626 |            41866 |
| total_pop               |     63.2409   |           36.7591 |        88216 |            51276 |
| white_pct               |     63.2409   |           36.7591 |        88216 |            51276 |
| black_pct               |     63.2409   |           36.7591 |        88216 |            51276 |
| asian_pct               |     63.2409   |           36.7591 |        88216 |            51276 |
| other_pct               |     63.2409   |           36.7591 |        88216 |            51276 |
| bachelors_pct           |     67.8663   |           32.1337 |        94668 |            44824 |
| rgdp                    |     51.2911   |           48.7089 |        71547 |            67945 |
| personal_income         |      4.87985  |           95.1202 |         6807 |           132685 |
| unemployment_rate       |     23.9189   |           76.0811 |        33365 |           106127 |
| RUCC_2013               |      0.709001 |           99.291  |          989 |           138503 |

### Availability after Interpolation

|                         |   Missing (%) |   Non-Missing (%) |   Null Count |   Non-Null Count |
|:------------------------|--------------:|------------------:|-------------:|-----------------:|
| FIPS5                   |     0         |          100      |            0 |           139492 |
| year                    |     0         |          100      |            0 |           139492 |
| median_household_income |    69.9868    |           30.0132 |        97626 |            41866 |
| total_pop               |     0         |          100      |            0 |           139492 |
| white_pct               |     0         |          100      |            0 |           139492 |
| black_pct               |     0         |          100      |            0 |           139492 |
| asian_pct               |     0         |          100      |            0 |           139492 |
| other_pct               |     0         |          100      |            0 |           139492 |
| bachelors_pct           |     0.0924784 |           99.9075 |          129 |           139363 |
| rgdp                    |    46.8493    |           53.1507 |        65351 |            74141 |
| personal_income         |     4.84544   |           95.1546 |         6759 |           132733 |
| unemployment_rate       |    19.2233    |           80.7767 |        26815 |           112677 |
| RUCC_2013               |     0.709001  |           99.291  |          989 |           138503 |

### Availability after Interpolation (2012 and after) 

This table shows the availability of data for years 2012 and after, for which all datasets are available.

|                         |   Missing (%) |   Non-Missing (%) |   Null Count |   Non-Null Count |
|:------------------------|--------------:|------------------:|-------------:|-----------------:|
| FIPS5                   |     0         |          100      |            0 |            35684 |
| year                    |     0         |          100      |            0 |            35684 |
| median_household_income |     0.728618  |           99.2714 |          260 |            35424 |
| total_pop               |     0         |          100      |            0 |            35684 |
| white_pct               |     0         |          100      |            0 |            35684 |
| black_pct               |     0         |          100      |            0 |            35684 |
| asian_pct               |     0         |          100      |            0 |            35684 |
| other_pct               |     0         |          100      |            0 |            35684 |
| bachelors_pct           |     0.0924784 |           99.9075 |           33 |            35651 |
| rgdp                    |     4.75283   |           95.2472 |         1696 |            33988 |
| personal_income         |     4.75283   |           95.2472 |         1696 |            33988 |
| unemployment_rate       |     0.714606  |           99.2854 |          255 |            35429 |
| RUCC_2013               |     0.709001  |           99.291  |          253 |            35431 |

## Summary Statistics

- Number of counties represented: 3,244
- Number of years represented: 43 (1980 - 2022)
- Total number of observations: 139,492

|       |        total_pop |     white_pct |       black_pct |       asian_pct |      other_pct |   bachelors_pct |             rgdp |   personal_income |   unemployment_rate |
|:------|-----------------:|--------------:|----------------:|----------------:|---------------:|----------------:|-----------------:|------------------:|--------------------:|
| count | 139492           | 139492        | 139492          | 139492          | 139492         |  139363         |  74141           |  132733           |        112677       |
| mean  |  89528.2         |      0.842537 |      0.0879585  |      0.00933523 |      0.0601692 |       0.111278  |      5.57419e+06 |       3.09899e+06 |             6.17772 |
| std   | 290338           |      0.168518 |      0.142941   |      0.0257914  |      0.101001  |       0.0585555 |      2.42152e+07 |       1.30613e+07 |             3.19747 |
| min   |     48           |      0.020674 |      0          |      0          |      0         |       0         |   5420           |    1610           |             0.4     |
| 25%   |  10884           |      0.768208 |      0.00348889 |      0.00171484 |      0.0106701 |       0.0708442 | 345137           |  207846           |             4       |
| 50%   |  24494.4         |      0.907982 |      0.0193369  |      0.00349578 |      0.0264425 |       0.0973605 | 895466           |  532756           |             5.4     |
| 75%   |  60426.2         |      0.966772 |      0.102698   |      0.00782079 |      0.0656371 |       0.135398  |      2.63214e+06 |       1.58027e+06 |             7.5     |
| max   |      1.01057e+07 |      1        |      0.874548   |      0.798611   |      0.974665  |       2.08537   |      7.93717e+08 |       7.22936e+08 |            40.6     |

