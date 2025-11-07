import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Reserve from "./pages/Reserve.jsx";
import SignUp from "./pages/SignUp.jsx";
import LogIn from "./pages/LogIn.jsx";
import Favorites from "./pages/Favorites.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { SpecialsContext } from "./context/SpecialsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecials() {
      try {
        const response = await fetch("/assets/data/specials.json");
        if (!response.ok) throw new Error("Failed to fetch specials");
        const data = await response.json();
        setSpecials(data);
      } catch (err) {
        console.error("Error loading specials:", err);
        setSpecials([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSpecials();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <AuthProvider>
      <SpecialsContext.Provider value={specials}>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reserve" element={<ProtectedRoute><Reserve /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SpecialsContext.Provider>
    </AuthProvider>
  );
}
