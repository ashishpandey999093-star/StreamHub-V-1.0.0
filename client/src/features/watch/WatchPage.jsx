/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../lib/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

function WatchPage() {
  const { videoId } = useParams();
  const { user } = useAuth();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getVideoById(videoId)
      .then((response) => setVideo(response.data.data))
      .catch(() => setError("Could not load this video."))
      .finally(() => setLoading(false));
  }, [videoId]);

  useEffect(() => {
    if (!user) return;
    api.getLikedVideos()
      .then((response) => {
        const isLiked = response.data.data.some((entry) => entry.video?._id === videoId);
        setLiked(isLiked);
      })
      .catch(() => { });
  }, [videoId, user]);

  // eslint-disable-next-line no-unused-vars
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!user || !video?.owner?._id) return;
    api.getSubscribedChannels(user._id)
      .then((response) => {
        const isSubscribed = response.data.data.some(
          (entry) => entry.subscribedChannels?._id === video.owner._id
        );
        setSubscribed(isSubscribed);
      })
      .catch(() => { });
  }, [user, video]);


  useEffect(() => {
    setCommentsLoading(true);
    api.getComments(videoId)
      .then((response) => setComments(response.data.data.docs))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [videoId]);

  const showSignInToast = (message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLikeClick = async () => {
    if (!user) {
      showSignInToast("Sign in to like this video");
      return;
    }
    setLiked((prev) => !prev);
    try {
      await api.toggleVideoLike(videoId);
    } catch {
      setLiked((prev) => !prev);
    }
  };

  const handleSubscribeClick = async () => {
    if (!user) {
      showSignInToast("Sign in to subscribe");
      return;
    }
    setSubscribed((prev) => !prev);
    try {
      await api.toggleSubscribe(video.owner._id);
    } catch {
      setSubscribed((prev) => !prev);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showSignInToast("Sign in to comment");
      return;
    }
    if (!newComment.trim()) return;
    try {
      const response = await api.addComment(videoId, newComment);
      setComments((prev) => [response.data.data, ...prev]);
      setNewComment("");
    } catch {
      // silent for now
    }
  };

  if (loading) return <p className="state-text">Loading video...</p>;
  if (error) return <p className="state-text error-text">{error}</p>;
  if (!video) return null;

  return (
    <div className="watch-wrap">
      <video src={video.videoFile} controls />
      <h2>{video.title}</h2>

      <div className="watch-actions">
        <button
          className={liked ? "btn btn-primary like-btn" : "btn btn-ghost like-btn"}
          onClick={handleLikeClick}
          aria-label={liked ? "Unlike this video" : "Like this video"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
          </svg>
          <span>{liked ? "Liked" : "Like"}</span>
        </button>
      </div>

      <div
        className="description-box"
        onClick={() => setDescExpanded((prev) => !prev)}
      >
        <div className="description-meta">
          {video.views ?? 0} views
        </div>
        <p className={descExpanded ? "description-text expanded" : "description-text"}>
          {video.description}
        </p>
        <div className="description-toggle">
          {descExpanded ? "Show less" : "Show more"}
        </div>
      </div>
      <div className="channel-row">
        <img
          src={video.owner?.avatar}
          alt={video.owner?.username}
          className="channel-avatar"
        />
        <span className="channel-name">{video.owner?.fullName}</span>
        <button
          className={subscribed ? "btn btn-ghost" : "btn btn-primary"}
          onClick={handleSubscribeClick}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      <div>
        <h3>Comments</h3>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Post</button>
        </form>

        {commentsLoading ? (
          <p className="state-text">Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-owner">{comment.owner?.fullName || "Unknown"}</div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {toastMessage && (
        <div className="toast">
          <span>{toastMessage}</span>
          <Link to="/login" className="btn btn-primary">Sign in</Link>
        </div>
      )}
    </div>
  );
}

export default WatchPage;