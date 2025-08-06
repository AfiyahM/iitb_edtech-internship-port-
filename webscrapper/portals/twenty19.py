import requests
from bs4 import BeautifulSoup
from datetime import datetime
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def scrape_twenty19():
    url = "https://www.twenty19.com/internships"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, verify=False)
    soup = BeautifulSoup(response.text, "html.parser")
    internships = []
    for card in soup.select(".internship-info"):
        title = card.find("a").text.strip()
        link = "https://www.twenty19.com" + card.find("a")["href"]
        company = card.select_one(".company-name").text.strip()
        location = card.select_one(".internship-location").text.strip()
        internships.append({
            "title": title,
            "company": company,
            "location": location,
            "date_posted": str(datetime.today().date()),
            "scraped_at": str(datetime.now()),
            "source": "Twenty19",
            "link": link
        })
    return internships
