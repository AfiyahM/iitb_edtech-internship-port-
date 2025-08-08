import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json

def scrape_linkedin():
    url = "https://www.linkedin.com/jobs/search/?keywords=internship&location=India&f_TPR=r86400"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        internships = []
        
        # Look for job cards
        job_cards = soup.find_all("div", class_="base-card")
        
        for card in job_cards[:10]:  # Limit to 10 for testing
            try:
                title_elem = card.find("h3", class_="base-search-card__title")
                company_elem = card.find("h4", class_="base-search-card__subtitle")
                location_elem = card.find("span", class_="job-search-card__location")
                link_elem = card.find("a", class_="base-card__full-link")
                
                if title_elem and company_elem:
                    title = title_elem.text.strip()
                    company = company_elem.text.strip()
                    location = location_elem.text.strip() if location_elem else "Remote"
                    link = link_elem.get("href") if link_elem else ""
                    
                    internships.append({
                        "title": title,
                        "company": company,
                        "location": location,
                        "date_posted": str(datetime.today().date()),
                        "scraped_at": str(datetime.now()),
                        "source": "LinkedIn",
                        "link": link
                    })
            except Exception as e:
                print(f"Error parsing card: {e}")
                continue
                
    except Exception as e:
        print(f"Error scraping LinkedIn: {e}")
        
    print(f"Found {len(internships)} internships from LinkedIn")
    return internships 