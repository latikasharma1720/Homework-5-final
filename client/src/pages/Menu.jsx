import { useMemo, useState } from "react";
import SpecialCard from "../components/SpecialCard.jsx";
import { useSpecials } from "../context/SpecialsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Menu() {
  const specials = useSpecials();
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specials;
    return specials.filter(({ name }) => name.toLowerCase().includes(q));
  }, [query, specials]);

  return (
    <section className="page menu-page">
      <h1>Menu</h1>
      {user && <p className="user-welcome">Hi, {user.name}! Search your favourite dishes!</p>}

      <div className="menu-filters">
        <input type="text" placeholder="Search dishes…" value={query}
               onChange={(e) => setQuery(e.target.value)} className="search-input" />
      </div>

      <div className="menu-grid">
        {filtered.map((item) => <SpecialCard key={item.id ?? item.name} item={item} />)}
      </div>
    </section>
  );
}
