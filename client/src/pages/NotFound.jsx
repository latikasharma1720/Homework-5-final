import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main className="page not-found-page">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="home-link">Return to Home</Link>
      </div>
    </main>
  );
}
