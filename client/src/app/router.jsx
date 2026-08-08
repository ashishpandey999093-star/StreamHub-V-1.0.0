import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import RegisterPage from "../features/auth/RegisterPage.jsx";
import HomePage from "../features/home/HomePage.jsx";
import WatchPage from "../features/watch/WatchPage.jsx";
import WatchHistoryPage from "../features/history/WatchHistoryPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "watch/:videoId", element: <WatchPage /> },
      { path: "history", element: <WatchHistoryPage /> }
    ]
  }
]);