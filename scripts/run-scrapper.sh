#!/bin/bash
# Where to run: Save this file in your project root

# Navigate to project directory
cd /path/to/your/project

# Activate virtual environment if using one
# source venv/bin/activate

# Run the scraper
python lib/enhanced_youtube_scraper.py >> logs/scraper.log 2>&1

# Optional: Send notification on completion
echo "YouTube scraper completed at $(date)" >> logs/scraper.log
