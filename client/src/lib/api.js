import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  register(formData) {
    return apiClient.post("/users/register", formData);
  },
  login(payload) {
    return apiClient.post("/users/login", payload);
  },
  logout() {
    return apiClient.post("/users/logout");
  },
  getCurrentUser() {
    return apiClient.get("/users/current-user");
  },
  // Videos
  getVideos(search = "") {
    const query = search ? `?query=${encodeURIComponent(search)}` : "";
    return apiClient.get(`/videos${query}`);
  },
  getVideoById(videoId) {
    return apiClient.get(`/videos/getVideo/${videoId}`);
  },
  // Comments
  getComments(videoId) {
    return apiClient.get(`/comments/v/${videoId}`);
  },
  addComment(videoId, content) {
    return apiClient.post(`/comments/v/${videoId}`, { content });
  },
  updateComment(commentId, content) {
    return apiClient.patch(`/comments/c/${commentId}`, { content });
  },
  deleteComment(commentId) {
    return apiClient.delete(`/comments/c/${commentId}`);
  },

  // Likes
  getLikedVideos() {
    return apiClient.get(`/likes`);
  },
  toggleVideoLike(videoId) {
    return apiClient.post(`/likes/v/${videoId}`);
  },
  toggleCommentLike(commentId) {
    return apiClient.post(`/likes/c/${commentId}`);
  },

  // Subscriptions
  toggleSubscribe(channelId) {
    return apiClient.post(`/subscriptions/c/${channelId}`);
  },
  getSubscribedChannels(subscriberId) {
    return apiClient.get(`/subscriptions/u/${subscriberId}`);
  },

  // Watch history
  getWatchHistory() {
    return apiClient.get(`/users/history`);
  },
  clearWatchHistory() {
    return apiClient.post(`/users/history/clear`);
  }
};