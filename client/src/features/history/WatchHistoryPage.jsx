import { useState, useEffect } from "react";
import VideoCard from "../../components/video/VideoCard.jsx";
import { api } from "../../lib/api.js";

function WatchHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getWatchHistory()
      .then((response) => {
        setHistory(response.data.data);
      })
      .catch(() => {
        setError("Could not load watch history.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleClear = async () => {
    try {
      await api.clearWatchHistory();
      setHistory([]);
    } catch {
      // silent for now
    }
  };

  if (loading) return <p className="state-text">Loading history...</p>;
  if (error) return <p className="state-text error-text">{error}</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Watch History</h2>
        {history.length > 0 && (
          <button className="btn btn-ghost" onClick={handleClear}>
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="state-text">No watch history yet.</p>
      ) : (
        <div className="video-grid" style={{ marginTop: "20px" }}>
          {history.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchHistoryPage;