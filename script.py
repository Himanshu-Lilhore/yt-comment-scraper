import os
import pandas as pd
from googleapiclient.discovery import build

# Function to get YouTube comments
def get_youtube_comments(api_key, video_id, search_word, max_comments=2000):
    # Build the service
    youtube = build('youtube', 'v3', developerKey=api_key)

    # Get comments from the video
    comments = []
    next_page_token = None
    total_comments = 0

    while True:
        print(f"Fetching comments... {total_comments}/{max_comments} retrieved so far")
        request = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id,
            pageToken=next_page_token,
            maxResults=100,
            textFormat='plainText',
            order='relevance'  # Fetch most popular comments first
        )
        response = request.execute()

        for item in response['items']:
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
            if search_word.lower() in comment.lower():
                comments.append(comment)

        total_comments += len(response['items'])
        if total_comments >= max_comments:
            break

        next_page_token = response.get('nextPageToken')
        if next_page_token is None:
            break

    return comments[:max_comments]

# Main function
def main():
    api_key = 'AIzaSyDom0oduYlrtBQKeUqafkpmEyCurtqCA3I'  # Replace with your API key
    video_url = 'https://www.youtube.com/watch?v=I5Jt8lYJuS4'  # Replace with the YouTube video URL
    search_word = 'song'  # Replace with the word to search for

    # Extract video ID from URL
    video_id = video_url.split('v=')[1]
    ampersand_position = video_id.find('&')
    if ampersand_position != -1:
        video_id = video_id[:ampersand_position]

    # Get comments
    comments = get_youtube_comments(api_key, video_id, search_word)
    print(f"\nTotal comments mentioning '{search_word}': {len(comments)}\n")
    for comment in comments:
        print(comment)

if __name__ == "__main__":
    main()
