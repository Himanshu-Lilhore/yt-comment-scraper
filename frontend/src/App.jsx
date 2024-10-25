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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/fetch_comments`, { url, word });
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
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/fetch_replies`, { commentId });
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
    <div className="relative max-w-[53rem] m-6 p-8 bg-white/20 border border-white/30 rounded-lg shadow-xl shadow-black/50">

      <div className='github absolute top-4 right-4'>
        <a href='https://github.com/Himanshu-Lilhore/yt-comment-scraper' target="top">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">    <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z" /></svg>
        </a>
      </div>

      <h1 className='font-bold my-6 text-black text-center'>YouTube Comment Scraper</h1>
      <form onSubmit={handleSubmit} className="form flex flex-col">
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

      {comments.length > 0 && <div className='text-xl my-4 font-bold'>Comments mentioning the string: "{word}"</div>}

      <ul className="comments">
        {comments.map((comment, index) => (
          <li key={index} className="comment shadow-lg hover:shadow-black/50 transition-all duration-300">
            <div>
              <strong>{comment.author}</strong>:
              <div className='flex flex-row flex-wrap whitespace-pre mt-2'>
                  {comment.text.slice(0, comment.text.toLowerCase().indexOf(word.toLowerCase())).replace(/\n/g, '. ').split(" ").map((eachWord, index, arr) => {
                    return <p key={index} className=''>{`${eachWord}${arr.length !== index+1 ? " " : ""}`}</p>
                  })}
                <p className="bg-yellow-400">
                  {comment.text.slice(comment.text.toLowerCase().indexOf(word.toLowerCase()), comment.text.toLowerCase().indexOf(word.toLowerCase()) + word.length)}
                </p>
                {comment.text.slice(comment.text.toLowerCase().indexOf(word.toLowerCase()) + word.length,).replace(/\n/g, '. ').split(" ").map((eachWord, index, arr) => {
                  return <p key={index} className=''>{`${eachWord}${arr.length !== index+1 ? " " : ""}`}</p>
                })}
              </div>
            </div>
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
