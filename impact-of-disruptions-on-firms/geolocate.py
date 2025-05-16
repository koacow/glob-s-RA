#!/usr/bin/env python
# coding: utf-8

# In[26]:


encoding = 'ISO-8859-1'  # Default encoding
file_path = 'data/raw/firm_ids_and_cities.csv'

import pandas as pd
import unidecode
import re

dtypes = {
    "cnpj_cei": "string",
    "city_code": "float64",
    "end_logradouro": "string",
    "city": "string",
    "year": "int64",
}

# 1.1 Read the full panel (CSV or feather/pkl)
df = pd.read_csv(file_path, encoding=encoding, dtype=dtypes)
# or: df = pd.read_pickle("rais_data.pkl")

print(df.shape)
print(df.columns)
print(df.head())

fill_na_values = {
    "cnpj_cei": "",
    "city_code": 0,
    "end_logradouro": "",
    "city": "",
    "year": 0,
}

print(f"Number of null values in each column: \n{df.isna().sum()}")

# Fill null values with empty strings
df.fillna(value=fill_na_values, inplace=True)

# 1.2 Normalize & build full_address
def clean_text(s):
    s = str(s).strip()                        # trim whitespace
    s = re.sub(r"\s+", " ", s)               # collapse spaces
    return s

df["municipio"], df["uf"] = zip(*df["city"]
    .str.split(",", n=1)
    .apply(lambda parts: (clean_text(parts[0]), clean_text(parts[1]) if len(parts)>1 else "")))

df["pais"] = "BR"
df["end_logradouro"] = df["end_logradouro"].apply(clean_text)

# Upper-case, remove accents
df["full_address"] = (
    df["end_logradouro"] + ", " +
    df["municipio"]     + ", " +
    df["uf"]            + ", " +
    df["pais"]
)
df["full_address"] = (
    df["full_address"]
      .str.upper()
      .apply(unidecode.unidecode)
) 

# 1.3 Extract unique addresses lookup
lookup = pd.DataFrame(df["full_address"].unique(), columns=["full_address"])
print(lookup.head())
print(f"Lookup shape: {lookup.shape}")
print(f"Number of null values: {lookup.isna().sum().sum()}")


import requests
import time
from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()

# 3.1 Load or initialize cache
cache_file = Path("geocode_cache.csv")
if cache_file.exists():
    cache = pd.read_csv(cache_file)
else:
    cache = pd.DataFrame(columns=[
        "full_address", "lat", "lng", "status", "location_type"
    ])

# 3.2 Geocoding loop
API_KEY = os.getenv("GOOGLE_GEOCODING_API_KEY")
base_url = "https://maps.googleapis.com/maps/api/geocode/json"
new_rows = []

MAX_RATE_LIMIT_RETRIES = 5

CHECKPOINT = 1000


for i, addr in enumerate(lookup["full_address"]):
    retry_count = 0
    try:
        if addr in cache["full_address"].values:
            continue  # already geocoded

        params = {
            "address": addr,
            "components": "country:BR",
            "key": API_KEY
        }
        resp = requests.get(base_url, params=params).json()
        status = resp.get("status")

        if status == "OK" and resp["results"]:
            res = resp["results"][0]
            loc = res["geometry"]["location"]
            loc_type = res["geometry"]["location_type"]
            new_rows.append({
                "full_address": addr,
                "lat": loc["lat"],
                "lng": loc["lng"],
                "status": status,
                "location_type": loc_type
            })
        else:
            new_rows.append({
                "full_address": addr,
                "lat": None,
                "lng": None,
                "status": status,
                "location_type": None
            })

        # Rate-limit + backoff
        time.sleep(0.01) # ~100 requests/sec
        if status == "OVER_QUERY_LIMIT":
            retry_count += 1
            if retry_count > MAX_RATE_LIMIT_RETRIES:
                print("Max retries exceeded. Exiting.")
                exit(1)
            print("Rate limit exceeded. Waiting for 5 seconds.")
            time.sleep(5)
    except KeyboardInterrupt:
        print("Geocoding interrupted. Saving cache and exiting.")
        if new_rows:
            cache = pd.concat([cache, pd.DataFrame(new_rows)], ignore_index=True)
            cache.to_csv(cache_file, index=False)
        exit(0)
    except Exception as e:
        print(f"Error processing address {addr}: {e}")
        exit(1)
    finally:
        if i % CHECKPOINT == 0:
            print(f"Processed {i} addresses. Cache size: {cache.shape[0]}")
            if new_rows:
                cache = pd.concat([cache, pd.DataFrame(new_rows)], ignore_index=True)
                cache.to_csv(cache_file, index=False)
                new_rows = []
                cache = pd.read_csv(cache_file)

# 3.3 Append & save cache
if new_rows:
    cache = pd.concat([cache, pd.DataFrame(new_rows)], ignore_index=True)
    cache.to_csv(cache_file, index=False)


# 4.1 Merge lat/lng into full panel
df_geocoded = df.merge(cache, on="full_address", how="left")

# 4.2 Keep only high-precision hits if desired
high_prec = ["ROOFTOP", "RANGE_INTERPOLATED"]
df_high = df_geocoded[df_geocoded["location_type"].isin(high_prec)]

# 4.3 Spot-check a random sample on a map (e.g. with folium)
import folium
m = folium.Map(location=[-15, -55], zoom_start=4)
for _, row in df_high.sample(100).iterrows():
    folium.CircleMarker(
        [row.lat, row.lng], radius=2, color="blue"
    ).add_to(m)
m.save("spotcheck.html")

