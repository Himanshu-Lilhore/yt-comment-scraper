import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [word, setWord] = useState('song');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/fetch_comments', { url, word });
      setComments(response.data.comments);
      console.log('Fetched comments:', response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (commentId) => {
    console.log('Fetching replies for comment ID:', commentId);
    try {
      const response = await axios.post('http://localhost:5000/fetch_replies', { commentId });
      console.log('Fetched replies for comment ID', commentId, ':', response.data.replies);
      const newComments = comments.map(comment => {
        if (comment.commentId === commentId) {
          return { ...comment, replies: response.data.replies, showReplies: true };
        }
        return comment;
      });
      setComments(newComments);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const toggleReplies = (commentId) => {
    console.log('Toggling replies for comment ID:', commentId);
    const newComments = comments.map(comment => {
      if (comment.commentId === commentId) {
        if (comment.showReplies) {
          return { ...comment, showReplies: false };
        } else {
          fetchReplies(commentId);
          return { ...comment, showReplies: true };
        }
      }
      return comment;
    });
    setComments(newComments);
  };

  return (
    <div className="container">
      <h1>YouTube Comment Scraper</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="url">YouTube Video URL:</label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="word">Search Word:</label>
          <input
            type="text"
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button">Fetch Comments</button>
      </form>

      {loading && <p>Loading...</p>}

      {comments.length > 0 && <h2>Comments mentioning the word:</h2>}
      
      <ul className="comments">
        {comments.map((comment, index) => (
          <li key={index} className="comment">
            <p><strong>{comment.author}</strong>: {comment.text}</p>
            {comment.showReplies && comment.replies && (
              <ul className="replies">
                {comment.replies.map((reply, replyIndex) => (
                  <li key={replyIndex} className="reply">
                    <p><strong>{reply.author}</strong>: {reply.text}</p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => toggleReplies(comment.commentId)}
              className="button"
            >
              {comment.showReplies ? 'Hide Replies' : 'Show Replies'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
