const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Add dotenv for environment variables

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.API_KEY; // Use environment variable for API key

// Function to get YouTube comments
const getYouTubeComments = async (apiKey, videoId, searchWord, maxComments = 2000) => {
    let comments = [];
    let nextPageToken = null;
    let totalComments = 0;

    while (totalComments < maxComments) {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                params: {
                    part: 'snippet',
                    videoId: videoId,
                    pageToken: nextPageToken,
                    maxResults: 100,
                    textFormat: 'plainText',
                    order: 'relevance',
                    key: apiKey,
                },
            });

            const items = response.data.items;
            for (const item of items) {
                const topComment = item.snippet.topLevelComment.snippet;
                if (topComment.textDisplay.toLowerCase().includes(searchWord.toLowerCase())) {
                    const commentId = item.snippet.topLevelComment.id;
                    const replies = await getCommentReplies(apiKey, commentId);
                    comments.push({
                        commentId: commentId,
                        text: topComment.textDisplay,
                        author: topComment.authorDisplayName,
                        likeCount: topComment.likeCount,
                        replies: replies,
                    });
                }
            }

            totalComments += items.length;
            nextPageToken = response.data.nextPageToken;
            if (!nextPageToken) break;
        } catch (error) {
            console.error('Error fetching comments from YouTube API:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    return comments.slice(0, maxComments);
};

// Function to get replies for a specific comment
const getCommentReplies = async (apiKey, commentId, maxReplies = 10) => {
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/comments', {
            params: {
                part: 'snippet',
                parentId: commentId,
                maxResults: maxReplies,
                textFormat: 'plainText',
                key: apiKey,
            },
        });

        return response.data.items.map(reply => ({
            text: reply.snippet.textDisplay,
            author: reply.snippet.authorDisplayName,
            likeCount: reply.snippet.likeCount,
        }));
    } catch (error) {
        console.error('Error fetching comment replies from YouTube API:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Endpoint to fetch comments
app.post('/fetch_comments', async (req, res) => {
    const { url, word } = req.body;

    if (!url || !word) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    try {
        const videoId = new URLSearchParams(new URL(url).search).get('v');
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const comments = await getYouTubeComments(apiKey, videoId, word);
        res.json({ comments });
    } catch (error) {
        console.error('Server error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// Endpoint to fetch replies for a specific comment
app.post('/fetch_replies', async (req, res) => {
    const { commentId } = req.body;

    if (!commentId) {
        return res.status(400).json({ error: 'Missing commentId parameter' });
    }

    try {
        const replies = await getCommentReplies(apiKey, commentId);
        res.json({ replies });
    } catch (error) {
        console.error('Server error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
