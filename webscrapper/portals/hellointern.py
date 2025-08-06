import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_hellointern():
    url = "https://www.hellointern.com/internships"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")
    internships = []
    for card in soup.select(".internship_listing"):
        title = card.find("h3").text.strip()
        company = card.find("h4").text.strip()
        location = card.select_one(".location").text.strip()
        link = card.find("a")["href"]
        internships.append({
            "title": title,
            "company": company,
            "location": location,
            "date_posted": str(datetime.today().date()),
            "scraped_at": str(datetime.now()),
            "source": "HelloIntern",
            "link": f"https://www.hellointern.com{link}"
        })
    return internships
