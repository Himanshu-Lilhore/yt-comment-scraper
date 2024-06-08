import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [word, setWord] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/fetch_comments', { url, word });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>YouTube Comment Scraper</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>YouTube Video URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Search Word:</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>
        <button type="submit">Fetch Comments</button>
      </form>
      {loading && <p>Loading...</p>}
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>
            <p><strong>{comment.author}</strong>: {comment.text} ({comment.likeCount} likes)</p>
            {comment.replies && (
              <ul>
                {comment.replies.map((reply, replyIndex) => (
                  <li key={replyIndex}>
                    <p><strong>{reply.author}</strong>: {reply.text} ({reply.likeCount} likes)</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
