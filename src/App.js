import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function SocialMediaApp() {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState('');
  const [newCommentText, setNewCommentText] = useState(''); // State for new comment text

  useEffect(()=>{
    axios.get("http://localhost:3000/getallposts")
    .then(res=>{
      console.log(res)
      // setPosts(posts)
    })
  }, [])

  const handleNewPostChange = (event) => {
    setNewPostText(event.target.value);
  };

  const handleNewPostSubmit = () => {
    if (newPostText.trim() !== '') {
      const newPost = {
        id: Date.now(),
        text: newPostText,
        likes: 0,
        dislikes: 0,
        liked: false,
        disliked: false,
        comments: []
      };
      setPosts([...posts, newPost]);
      setNewPostText('');
    }
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId && !post.liked) {
        return { ...post, likes: post.likes + 1, liked: true, disliked: false };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleDislike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId && !post.disliked) {
        return { ...post, dislikes: post.dislikes + 1, liked: false, disliked: true };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId) => { // Updated handleAddComment function to use newCommentText state
    if (newCommentText.trim() !== '') {
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newCommentText] };
        }
        return post;
      });
      setPosts(updatedPosts);
      setNewCommentText(''); // Clear the comment input field after adding the comment
    }
  };

  return (
    <div className="social-media-app">
      <h1>Social Media App</h1>
      <div>
        <textarea
          value={newPostText}
          onChange={handleNewPostChange}
          placeholder="Write your post..."
          className="post-input"
        />
        <button onClick={handleNewPostSubmit} className="post-button">Post</button>
      </div>
      <div>
        {posts.map(post => (
          <div key={post.id} className="post">
            <p>{post.text}</p>
            <button onClick={() => handleLike(post.id)} className={`like-button ${post.liked ? 'disabled' : ''}`} disabled={post.liked}>Like ({post.likes})</button>
            <button onClick={() => handleDislike(post.id)} className={`dislike-button ${post.disliked ? 'disabled' : ''}`} disabled={post.disliked}>Dislike ({post.dislikes})</button>
            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="comment-input"
                value={newCommentText} // Bind input value to newCommentText state
                onChange={(e) => setNewCommentText(e.target.value)} // Update newCommentText state when input changes
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment(post.id);
                  }
                }}
              />
              <button onClick={() => handleAddComment(post.id)} className="comment-button">Comment</button>
            </div>
            <div className="comments">
              {post.comments.map((comment, index) => (
                <p key={index}>{comment}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SocialMediaApp;
