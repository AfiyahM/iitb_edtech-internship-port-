import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def save_to_supabase(internships: list):
    for item in internships:
        existing = supabase.table("internships").select("id").eq("link", item["link"]).execute()
        if not existing.data:
            supabase.table("internships").insert(item).execute()
