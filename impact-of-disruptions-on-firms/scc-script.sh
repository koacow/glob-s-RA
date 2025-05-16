#!/bin/bash -l

#$ -P glob-s
#$ -l h_rt=06:00:00
#$ -N geolocating-brazilian-addresses
#$ -l mem_per_core=8G
#$ -j y

module load python3/3.8.10
pip install unidecode pandas 

python geolocate.py | tee -a geolocate.log