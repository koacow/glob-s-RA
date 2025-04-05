import dask.dataframe as dd
from supabase import create_client, Client
from supabase.client import ClientOptions
import os
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(
                                    url,
                                    key,
                                )

def upload_to_supabase():
    df = dd.read_csv(os.path.join(os.path.dirname(__file__), '../output/merged_gdelt_data_20250329_1502.csv'))
    df = df.compute()
    
    chunk_size = 200000
    for i in range(0, len(df), chunk_size):
        chunk = []
        if i + chunk_size <= len(df):
            chunk = df.iloc[i:i + chunk_size]
        else:
            chunk = df.iloc[i:]
        data = chunk.to_dict(orient="records")

        print(f"Uploading chunk {i // chunk_size + 1} with {len(data)} records")
        response = None
        try:
            response = supabase.table("gdelt_monthly").insert(data, returning="minimal").execute()
            
        except Exception as e:
            print(f"An exception occurred while uploading chunk {i // chunk_size + 1}: {e}")
            print(f"Supabase response: {response}")
        else:
            print(f"Chunk {i // chunk_size + 1} uploaded successfully.")

if __name__ == "__main__":
    upload_to_supabase()
    print("Upload completed.")

