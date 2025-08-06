from portals.hellointern import scrape_hellointern
from portals.twenty19 import scrape_twenty19
from portals.internshala import scrape_internshala
from portals.naukri import scrape_naukri
from common.database import save_to_supabase

def run_all_scrapers():
    all_data = []
    for scraper in [scrape_internshala, scrape_naukri]:
        try:
            data = scraper()
            all_data.extend(data)
        except Exception as e:
            print(f"Error in {scraper.__name__}: {e}")
    print(f"Scraped {len(all_data)} internships.")
    save_to_supabase(all_data)

if __name__ == "__main__":
    run_all_scrapers()
