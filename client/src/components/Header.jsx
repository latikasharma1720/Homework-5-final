import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleReserveClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login", { 
        state: { message: "Please log in to make reservations!", from: "/reserve" }
      });
    }
  };

  return (
    <header className="site-header">
      <NavLink to="/" className="site-logo">
        <img src="/assets/images/kitchen.png" alt="The Great Indian Kitchen" className="logo-image" />
      </NavLink>

      <nav className="header-nav">
        <ul className="site-nav">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink></li>
          <li>
            <NavLink to="/reserve" onClick={handleReserveClick} className={({ isActive }) => isActive ? 'active' : ''}>
              Reserve a Table
            </NavLink>
          </li>
          <li>
            <a href="https://www.foodsafety.gov/" target="_blank" rel="noopener noreferrer"
               className={location.pathname === '/food-safety' ? 'active' : ''}>
              Food Safety
            </a>
          </li>
          {user && (
            <li className="mobile-only">
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>My Favorites</NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="auth-buttons">
        {user ? (
          <ul className="auth-nav">
            <li><NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>My Favorites</NavLink></li>
            <li><span className="user-greeting">Hi, {user.name}!</span></li>
            <li><button onClick={handleLogout} className="nav-button logout-btn">Sign Out</button></li>
          </ul>
        ) : (
          <ul className="auth-nav">
            <li><NavLink to="/signup" className={({ isActive }) => isActive ? 'active' : ''}>Sign Up</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Log In</NavLink></li>
          </ul>
        )}
      </div>
    </header>
  );
}
