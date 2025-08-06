from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time

def scrape_internshala():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    driver = webdriver.Chrome(options=options)

    internships = []
    try:
        driver.get("https://internshala.com/internships")
        time.sleep(5)

        cards = driver.find_elements(By.CLASS_NAME, "individual_internship")
        print(f"Found {len(cards)} cards")

        for card in cards[:15]:
            try:
                title_elem = card.find_element(By.CSS_SELECTOR, "div.heading_4_5 a")
                title = title_elem.text.strip()
                link = title_elem.get_attribute("href")

                company = card.find_element(By.CSS_SELECTOR, "a.link_display_like_text").text.strip()
                location = card.find_element(By.CSS_SELECTOR, "a.location_link").text.strip()

                internships.append({
                    "title": title,
                    "company": company,
                    "location": location,
                    "date_posted": str(datetime.today().date()),
                    "scraped_at": str(datetime.now()),
                    "source": "Internshala",
                    "link": link
                })

            except Exception as e:
                print("❌ Skipping one card due to error:", e)

    except Exception as e:
        print("🚨 Failed to scrape Internshala:", e)
    finally:
        driver.quit()

    print(f"✅ Scraped {len(internships)} internships from Internshala")
    return internships
