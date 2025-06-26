# Grid Panel for Radical Innovation and Disasters

This Jupyter Notebook constructs a 0.25° × 0.25° grid over the contiguous U.S. and assigns:

- Binary and count-based disaster exposure per grid-year
- Inventor counts from PatentsView data by grid-year

Buffer distances:

- 25 km for flood, storm, tropical cyclone
- 100 km for earthquake and volcanic activity

CRS: EPSG:4326  
Disaster source: GDIS/EM-DAT  
Inventor data: PatentsView (1980–2022)

## Output

All outputs are stored in the `data/` directory:

1. Grid cells in GeoJSON format (`grid.geojson`)
    - Each cell is a rectangular polygon with a unique `grid_id`.
    - Each cell is 0.25° × 0.25° in size.
    - Only includes cells within the lower 48 states of the U.S.
    - Number of cells: 15,438

2. Grid-disaster exposure panel in Parquet format (`grid_disaster_panel.parquet`)
    - Contains columns:
        - `grid_id`: Unique identifier for each grid cell
        - `year`: Year of the disaster exposure
        - `hit`: Binary indicator of disaster exposure (1 if exposed, 0 otherwise)
        - `count`: Number of disasters in that grid-year
        - `n_inventors`: Number of unique inventors in that grid-year

- 