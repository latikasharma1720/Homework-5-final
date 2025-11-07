import { useState, useEffect, useMemo } from "react";
import { useSpecials } from "../context/SpecialsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Favorites() {
  const { user } = useAuth();
  const allSpecials = useSpecials();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  async function jsonFetch(url, options = {}) {
    const res = await fetch(url, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  useEffect(() => {
    (async () => {
      if (!user) { setFavorites([]); setLoading(false); return; }
      try {
        const data = await jsonFetch("/api/favorites");
        setFavorites(Array.isArray(data) ? data : []);
      } catch { setFavorites([]); }
      finally { setLoading(false); }
    })();
  }, [user]);

  const availableItems = useMemo(() => {
    const favSet = new Set(favorites.map(f => String(f.item_id)));
    return allSpecials.filter(item => !favSet.has(String(item.id ?? item.name)));
  }, [favorites, allSpecials]);

  const addToFavorites = async (item) => {
    try {
      const payload = {
        item_id: String(item.id ?? item.name),
        item_name: item.name,
        price: item.price,
        image: item.image
      };
      const newFav = await jsonFetch("/api/favorites", { method: "POST", body: JSON.stringify(payload) });
      setFavorites(prev => [newFav, ...prev]);
    } catch (err) { alert(err.message || "Could not add to favorites"); }
  };

  const removeFromFavorites = async (itemId) => {
    try {
      await jsonFetch(`/api/favorites/${encodeURIComponent(itemId)}`, { method: "DELETE" });
      setFavorites(prev => prev.filter(f => String(f.item_id) !== String(itemId)));
    } catch (err) { alert(err.message || "Could not remove favorite"); }
  };

  if (!user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Please log in to manage favorites.</div>;
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading favorites…</div>;

  return (
    <main className="page favorites-page">
      <h1>My Favorite Dishes</h1>
      <p className="subtitle">Click the ❤️ button to add dishes to your favorites</p>

      <div className="favorites-container">
        <section className="available-dishes">
          <h2>Available Dishes ({availableItems.length})</h2>
          <div className="dishes-grid">
            {availableItems.map(item => (
              <div key={String(item.id ?? item.name)} className="dish-card">
                <img src={item.image} alt={item.name} className="dish-image" />
                <div className="dish-info">
                  <h3>{item.name}</h3>
                  <p className="dish-price">${Number(item.price).toFixed(2)}</p>
                  <button className="add-favorite-btn" onClick={() => addToFavorites(item)}>❤️ Add to Favorites</button>
                </div>
              </div>
            ))}
          </div>
          {availableItems.length === 0 && <p className="empty-message">All dishes are in your favorites! 🎉</p>}
        </section>

        <section className="favorites-section">
          <h2>Your Favorites ❤️ ({favorites.length})</h2>
          <div className="favorites-grid">
            {favorites.length === 0 ? (
              <div className="empty-favorites">
                <p>No favorites yet!</p>
                <p className="hint-icon">👈</p>
                <p>Click ❤️ on any dish to add it</p>
              </div>
            ) : (
              favorites.map(item => (
                <div key={`${item.user_id}-${item.item_id}`} className="favorite-card">
                  <button className="remove-btn" onClick={() => removeFromFavorites(item.item_id)} aria-label="Remove from favorites">✕</button>
                  <img src={item.item_image} alt={item.item_name} className="dish-image" />
                  <div className="dish-info">
                    <h3>{item.item_name}</h3>
                    {item.item_price != null && <p className="dish-price">${Number(item.item_price).toFixed(2)}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}