# Grid Panel for Radical Innovation and Disasters

## Overview

This Jupyter Notebook constructs a 0.25° × 0.25° grid over the contiguous U.S. and assigns:

- Binary and count-based disaster exposure per grid-year
- Inventor counts from PatentsView data by grid-year

Buffer distances:

- 25 km for flood, storm, tropical cyclone
- 100 km for earthquake and volcanic activity

Grid cell range:

- Latitude: 25 to 50 degrees (inclusive)
- Longitude: -130 to -65 degrees (inclusive)

Year range:

- 1995 - 2018 (inclusive)

Data:

Coordinate Reference System (CRS): EPSG:4326  
Disaster source: GDIS/EM-DAT  
Inventor data: PatentsView (1980–2022)

## Output

All outputs are stored in the `data/` directory:

1. Grid cells in GeoJSON format (`grid.geojson`)
    - Each cell is a rectangular polygon with a unique `grid_id`.
    - Each cell is 0.25° × 0.25° in size.
    - Only includes cells within the lower 48 states of the U.S.
    - Number of rows: 15,438

2. Grid-disaster exposure panel in Parquet format (`grid_disaster_panel.parquet`)
    - Each row represents a grid cell-year that intersected with a disaster (radius specified above).
    - Columns:
        - `grid_id`: Unique identifier for each grid cell
        - `year`: Year of the disaster exposure
        - `hit`: Binary indicator of disaster exposure (1 if exposed, 0 otherwise)
        - `count`: Number of disasters in that grid-year
    - Number of rows: 13,555

3. Grid-inventor panel in Parquet format (`grid_inventors_panel.parquet`)
    - Each row represents a grid cell-year with the number of inventors that filed patents in that grid-year.
    - Columns:
        - `grid_id`: Unique identifier for each grid cell
        - `year`: Year of the inventor count
        - `n_inventors`: Number of unique inventors in that grid-year
    - Number of rows: 119,308

4. Merged grid-disaster-inventor panel in Parquet format (`merged_grid_inventors_panel.parquet`)
    - Each row represents a grid cell-year combination with disaster exposure and inventor counts (grid cell and year ranges specified above).
    - Combines disaster exposure and inventor counts (outputs 2 and 3) by grid-year.
    - Columns:
        - `grid_id`: Unique identifier for each grid cell
        - `year`: Year of the inventor count
        - `hit`: Binary indicator of disaster exposure (1 if exposed, 0 otherwise)
        - `count`: Number of disasters in that grid-year
        - `n_inventors`: Number of unique inventors in that grid-year
    - Number of rows: 370,512