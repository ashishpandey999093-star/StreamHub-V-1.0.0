import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

function AppShell({ children }) {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          <span className="signal-dot" />
          <h1>StreamHub</h1>
        </Link>

        <SearchBar />

        <div className="nav-actions">
          {loading ? null : user ? (
            <div className="profile-menu" ref={menuRef}>
              <button
                className="profile-trigger"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <img src={user.avatar} alt={user.username} />
              </button>

              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-name">{user.username}</div>
                  <Link
                    to="/history"
                    className="profile-dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    History
                  </Link>
                  <button
                    className="profile-dropdown-item danger"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}

export default AppShell;