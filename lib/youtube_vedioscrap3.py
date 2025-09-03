import asyncio
import datetime
import logging
import json
import os
import math
import re
from typing import List, Dict
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from supabase import create_client

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedYouTubeScraper:
    def __init__(self):
        # Supabase connection with your actual credentials
        self.supabase_url = "https://zooismbsebfafvyvcmbu.supabase.co"
        self.supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvb2lzbWJzZWJmYWZ2eXZjbWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDg2MTMyOCwiZXhwIjoyMDY2NDM3MzI4fQ.n529MSZ-BfflAqnOCBROyCo0gMRMmJkFQ6nYDQfykTY"
        
        # Initialize Supabase client
        try:
            self.supabase = create_client(self.supabase_url, self.supabase_key)
            logger.info("✅ Supabase connected successfully")
        except Exception as e:
            self.supabase = None
            logger.warning(f"⚠️ Supabase connection failed: {e}")
        
        # YouTube API setup
        self.API_KEY = "AIzaSyDphgi5I1bCNIIochC2bT-LhHJHGhd6TlM"
        self.youtube = build('youtube', 'v3', developerKey=self.API_KEY)
        
        # Your channel IDs
        self.CHANNEL_IDS = [
            "UC0RhatS1pyxInC00YKjjBqQ",  # GeeksforGeeks
            "UC29ju8bIPH5as8OGnQzwJyA",  # Traversy Media
            "UC8butISFwT-Wl7EV0hUK0BQ",  # freeCodeCamp
            "UCWv7vMbMWH4-V0ZXdmDpPBA",  # Programming with Mosh
            "UC4JX40jDee_tINbkjycV4Sg",  # Tech With Tim
        ]
        
        # Educational keywords for filtering
        self.EDUCATIONAL_KEYWORDS = [
            'tutorial', 'course', 'learn', 'guide', 'how to', 'beginner',
            'introduction', 'basics', 'fundamentals', 'explained'
        ]

    def is_educational_content(self, video: Dict) -> bool:
        """Filter for educational content"""
        title = video.get('title', '').lower()
        description = video.get('description', '').lower()
        
        # Check for educational keywords
        has_educational_content = any(
            keyword in title or keyword in description 
            for keyword in self.EDUCATIONAL_KEYWORDS
        )
        
        # Exclude non-educational content
        exclude_keywords = ['music', 'song', 'comedy', 'funny', 'meme', 'gaming']
        has_excluded_content = any(keyword in title for keyword in exclude_keywords)
        
        return has_educational_content and not has_excluded_content

    def parse_duration_to_seconds(self, duration_str: str) -> int:
        """Parse ISO 8601 duration to seconds"""
        # Fixed regex pattern with raw string
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration_str)
        if not match:
            return 900  # Default 15 minutes
        
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        
        return hours * 3600 + minutes * 60 + seconds

    async def fetch_channel_videos(self, channel_id: str, max_results: int = 15) -> List[Dict]:
        """Fetch quality videos from a channel"""
        try:
            # Get channel's uploads playlist
            channel_response = self.youtube.channels().list(
                part='contentDetails,snippet',
                id=channel_id
            ).execute()
            
            if not channel_response['items']:
                logger.warning(f"Channel {channel_id} not found")
                return []
            
            channel_title = channel_response['items'][0]['snippet']['title']
            uploads_playlist_id = channel_response['items'][0]['contentDetails']['relatedPlaylists']['uploads']
            
            # Get recent videos
            playlist_response = self.youtube.playlistItems().list(
                part='snippet',
                playlistId=uploads_playlist_id,
                maxResults=max_results
            ).execute()
            
            video_ids = [item['snippet']['resourceId']['videoId'] for item in playlist_response['items']]
            
            if not video_ids:
                return []
            
            # Get detailed video information
            videos_response = self.youtube.videos().list(
                part='snippet,statistics,contentDetails',
                id=','.join(video_ids)
            ).execute()
            
            videos = []
            for item in videos_response['items']:
                try:
                    view_count = int(item['statistics'].get('viewCount', 0))
                    
                    video_data = {
                        'videoId': item['id'],
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'][:500],
                        'publishedAt': item['snippet']['publishedAt'],
                        'channelId': channel_id,
                        'channelTitle': channel_title,
                        'viewCount': view_count,
                        'duration': item['contentDetails']['duration'],
                        'url': f"https://www.youtube.com/watch?v={item['id']}"
                    }
                    
                    # Apply filters: minimum 1000 views and educational content
                    if view_count >= 1000 and self.is_educational_content(video_data):
                        videos.append(video_data)
                        
                except (KeyError, ValueError) as e:
                    continue
            
            logger.info(f"✅ Fetched {len(videos)} quality videos from {channel_title}")
            return videos
            
        except HttpError as e:
            logger.error(f"❌ YouTube API error for channel {channel_id}: {e}")
            return []

    async def scrape_all_channels(self) -> List[Dict]:
        """Scrape videos from all channels"""
        logger.info("🚀 Starting enhanced video scraping...")
        
        all_videos = []
        for channel_id in self.CHANNEL_IDS:
            videos = await self.fetch_channel_videos(channel_id)
            all_videos.extend(videos)
            # Add delay to respect rate limits
            await asyncio.sleep(1)
        
        # Remove duplicates
        unique_videos = {video['videoId']: video for video in all_videos}
        unique_videos_list = list(unique_videos.values())
        
        # Sort by view count
        unique_videos_list.sort(key=lambda x: x['viewCount'], reverse=True)
        
        logger.info(f"✅ Total unique quality videos: {len(unique_videos_list)}")
        return unique_videos_list

    def categorize_video(self, video: Dict) -> str:
        """Categorize video based on content"""
        title = video['title'].lower()
        description = video['description'].lower()
        
        if any(term in title + description for term in ['react', 'frontend', 'css', 'html', 'javascript']):
            return 'Frontend Development'
        elif any(term in title + description for term in ['backend', 'server', 'api', 'database']):
            return 'Backend Development'
        elif any(term in title + description for term in ['python', 'data science', 'machine learning']):
            return 'Data Science'
        else:
            return 'General Programming'

    def extract_skills_from_category(self, category: str) -> List[str]:
        """Extract skills based on category"""
        skill_map = {
            'Frontend Development': ['JavaScript', 'React', 'CSS', 'HTML'],
            'Backend Development': ['Node.js', 'Python', 'API', 'Database'], 
            'Data Science': ['Python', 'Machine Learning', 'Statistics'],
            'General Programming': ['Programming', 'Problem Solving']
        }
        return skill_map.get(category, ['Programming'])

    def get_category_color(self, category: str) -> str:
        """Get color for category"""
        colors = {
            'Frontend Development': 'bg-blue-500',
            'Backend Development': 'bg-green-500',
            'Data Science': 'bg-purple-500',
            'General Programming': 'bg-gray-500'
        }
        return colors.get(category, 'bg-gray-500')

    def save_to_database(self, videos: List[Dict]) -> None:
        """Save videos to Supabase database"""
        if not self.supabase:
            logger.warning("⚠️ No Supabase connection - skipping database save")
            return
            
        logger.info("💾 Saving videos to database...")
        
        try:
            # Group videos by category to create learning paths
            categorized_videos = {}
            for video in videos:
                category = self.categorize_video(video)
                if category not in categorized_videos:
                    categorized_videos[category] = []
                categorized_videos[category].append(video)
            
            # Process each category
            for category, category_videos in categorized_videos.items():
                try:
                    # Create or get learning path
                    path_response = self.supabase.table('learning_paths').select('id').eq('title', category).execute()
                    
                    if path_response.data and len(path_response.data) > 0:
                        learning_path_id = path_response.data[0]['id']
                        logger.info(f"📁 Using existing learning path: {category}")
                    else:
                        # Create new learning path
                        new_path = {
                            'title': category,
                            'description': f'Master {category.lower()} with curated video tutorials',
                            'category': category,
                            'difficulty': 'Beginner',
                            'estimated_time': f'{math.ceil(len(category_videos) / 7)} weeks',
                            'skills': self.extract_skills_from_category(category),
                            'color': self.get_category_color(category),
                            'icon': 'Video',
                            'instructor': 'Expert Instructors',
                            'rating': 4.5,
                            'is_active': True
                        }
                        
                        path_response = self.supabase.table('learning_paths').insert(new_path).execute()
                        if path_response.data and len(path_response.data) > 0:
                            learning_path_id = path_response.data[0]['id']
                            logger.info(f"✅ Created new learning path: {category}")
                        else:
                            logger.error(f"❌ Failed to create learning path {category}")
                            continue
                    
                    # Prepare resources data
                    resources_data = []
                    for i, video in enumerate(category_videos):
                        resource = {
                            'learning_path_id': learning_path_id,
                            'title': video['title'],
                            'description': video['description'][:500],  # Limit description length
                            'video_id': video['videoId'],
                            'youtube_url': video['url'],
                            'duration': self.parse_duration_to_seconds(video.get('duration', 'PT15M')),
                            'order_index': i + 1,
                            'points': min(100 + (video['viewCount'] // 10000), 300)  # Points based on popularity
                        }
                        resources_data.append(resource)
                    
                    # Batch insert resources with upsert (handles duplicates)
                    if resources_data:
                        resources_response = self.supabase.table('resources').upsert(
                            resources_data, 
                            on_conflict='video_id'
                        ).execute()
                        
                        if resources_response.data:
                            logger.info(f"✅ Saved {len(resources_data)} videos for {category}")
                        else:
                            logger.error(f"❌ Failed to save resources for {category}")
                            
                except Exception as e:
                    logger.error(f"❌ Error processing category {category}: {e}")
                    continue
            
            logger.info("✅ Successfully saved all videos to database")
            
        except Exception as e:
            logger.error(f"❌ Database save failed: {e}")


    def save_json_output(self, videos: List[Dict]) -> None:
        """Save structured JSON output"""
        try:
            # Group by category
            categorized_videos = {}
            for video in videos:
                category = self.categorize_video(video)
                if category not in categorized_videos:
                    categorized_videos[category] = {
                        "courseTitle": category,
                        "channelId": "mixed",
                        "videos": []
                    }
                categorized_videos[category]["videos"].append(video)
            
            output_data = list(categorized_videos.values())
            
            # Create webscrapper directory if it doesn't exist
            os.makedirs('webscrapper', exist_ok=True)
            
            # Save timestamped version
            timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"webscrapper/enhanced_youtube_resources_{timestamp}.json"
            
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            
            # Also save current version (for your existing API)
            with open("webscrapper/youtube_resources.json", "w", encoding="utf-8") as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ Saved to {filename} and youtube_resources.json")
            
        except Exception as e:
            logger.error(f"❌ Error saving JSON: {e}")

# Main execution
async def main():
    scraper = EnhancedYouTubeScraper()
    
    try:
        # Scrape videos
        videos = await scraper.scrape_all_channels()
        
        if not videos:
            logger.warning("⚠️ No videos scraped!")
            return
        
        # Save JSON backup (existing functionality)
        scraper.save_json_output(videos)
        
        # Save to database
        scraper.save_to_database(videos)
        
        logger.info("🎉 Enhanced scraping completed successfully!")
        print(f"Scraped {len(videos)} high-quality educational videos")
        print("Data saved to both JSON files and database")
        
    except Exception as e:
        logger.error(f"❌ Scraping failed: {e}")
        raise

if __name__ == "__main__":
    asyncio.run(main())
