# Set the directory containing the .rds files
input_dir <- "/Users/koacow/BOSTON UNIVERSITY Dropbox/Ngoc Duy Khoa Cao/Climate Risk and Labor Market/RAIS data/firms and cities/ESTB"

# List all .rds files in the directory
rds_files <- list.files(input_dir, pattern = "\\.rds$", full.names = TRUE)

# Loop through each .rds file and save as .csv with default encoding (original encoding)
for (rds_file in rds_files) {
  # Read the .rds file
  data <- readRDS(rds_file)
  
  # Create the output .csv file path
  csv_file <- sub("\\.rds$", ".csv", rds_file)
  
  # Write to .csv with default encoding (no fileEncoding argument)
  write.csv(data, file = csv_file, row.names = FALSE)
}