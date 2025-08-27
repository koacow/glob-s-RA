# U.S. Geographic Grids Panel Dataset

## Overview

This document outlines the final process of merging various datasets to create a comprehensive panel dataset of Contiguous U.S. Geographic Grids. This dataset contains information on grid-level characteristics: demographics, population, economic indicators, educational attainment, patent innovation measures, and natural disaster exposure. 

**Time Period**: 1980 - 2022

**Grid Dimension**: 0.25 x 0.25 degrees

**Geographic Coverage**: Contiguous U.S. only (excluding Alaska and Hawaii)

**Grid Count**: 13,721

**Variables**:

- Demographics:
    - white_pct, black_pct, asian_pct, other_pct
- Population:
    - total_pop
- Economic: 
    - rgdp, median_household_income, personal_income, unemployment_rate, RUCC_2013
- Education:
    - bachelors_pct
- Innovation: 
    - num_patents, mean_atypicality_score, mean_impact_score, mean_entropy_score
- Disaster Exposure:
    - hit, count, total_deaths, total_damage_adj

*For more information on the data sources, processing steps, and variable definitions, refer to the README.md files associated with the intermediate datasets.*

**Number of Observations**: 590,003

## Converting County-level observations to Grid-level

The conversion from county-level to grid-level observations involves several key steps:

1. **Spatial Join**: Each county is associated with multiple grid cells. We perform a spatial join to link county-level data to the corresponding grid cells. For point-level data (patents, disasters), we assign the values to the grid cells they fall within.

2. **Aggregation**: For variables that are not inherently grid-based (e.g., population, income), we aggregate county-level data to the grid level. This involved:
   - Using area-weighted averages to evenly distribute values across grid cells.

3. **Validation**: Finally, we validate the grid-level data by visually and statistically comparing it against known benchmarks or aggregate statistics at larger geographic scales.

- Validation steps:
    - Visually verified that all grids are located in the contiguous U.S.
    - Cross-checked county control variables with other sources (FRED) to verify that they match within 5%
    - Verified that county control variables are correctly assigned to grids based on the area of the overlap
    - Visually verified that county control variables are correctly distributed - RGDP, median income, and population are higher in metropolitan areas
    - Verified that disaster data is correctly assigned to grids (correct number of disasters per year; spot-checked for specific counties in major disasters such as Hurrican Sandy)
    - Verified that patent & inventor counts make sense - patents and inventors are concentrated in metropolitant areas and in high-innovation states such as MA and CA
    - Visually verified that patents are correctly assigned to grids
