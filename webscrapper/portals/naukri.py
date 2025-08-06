from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

def scrape_naukri():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)

    internships = []
    try:
        driver.get("https://www.naukri.com/internship-jobs")
        time.sleep(5)

        cards = driver.find_elements(By.CSS_SELECTOR, "article.jobTuple")
        for card in cards[:10]:
            try:
                title = card.find_element(By.CLASS_NAME, "title").text.strip()
                link = card.find_element(By.CLASS_NAME, "title").get_attribute("href")
                company = card.find_element(By.CLASS_NAME, "comp-name").text.strip()
                location = card.find_element(By.CSS_SELECTOR, "li.location span").text.strip()
                internships.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "date_posted": str(datetime.today().date()),
                    "scraped_at": str(datetime.now()),
                    "source": "Naukri",
                    "link": link
                })
            except:
                continue
    finally:
        driver.quit()
    return internships
