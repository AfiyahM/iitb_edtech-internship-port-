from datetime import datetime

def scrape_mock():
    """Mock scraper that returns test data"""
    internships = [
        {
            "title": "Software Engineering Intern",
            "company": "Tech Corp",
            "location": "Mumbai, India",
            "date_posted": str(datetime.today().date()),
            "scraped_at": str(datetime.now()),
            "source": "Mock",
            "link": "https://example.com/internship1"
        },
        {
            "title": "Data Science Intern",
            "company": "AI Solutions",
            "location": "Bangalore, India",
            "date_posted": str(datetime.today().date()),
            "scraped_at": str(datetime.now()),
            "source": "Mock",
            "link": "https://example.com/internship2"
        },
        {
            "title": "Marketing Intern",
            "company": "Digital Marketing Co",
            "location": "Delhi, India",
            "date_posted": str(datetime.today().date()),
            "scraped_at": str(datetime.now()),
            "source": "Mock",
            "link": "https://example.com/internship3"
        }
    ]
    
    print(f"Mock scraper found {len(internships)} internships")
    return internships 