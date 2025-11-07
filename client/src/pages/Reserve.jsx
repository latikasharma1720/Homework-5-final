import { useState } from "react";

export default function Reserve() {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", email: "", date: "", time: "", guests: "2"
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = {
        first_name: formData.firstName,     // Changed from firstName
        last_name: formData.lastName,       // Changed from lastName
        phone: formData.phone,
        email: formData.email,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests || 2)
      };
      const data = await jsonFetch("/api/reservations", { method: "POST", body: JSON.stringify(payload) });
      setServerMsg(`✅ Reservation confirmed! Receipt ID: ${data.id}`);
      setFormData({ firstName: "", lastName: "", phone: "", email: "", date: "", time: "", guests: "2" });
    } catch (err) { setServerMsg(err.message || "❌ Could not submit reservation"); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="page reserve-page">
      <h1>Reserve a Table</h1>
      <p className="subtitle">Book your dining experience with us</p>

      <div className="reserve-container">
        <div className="reserve-image"><img src="/assets/images/reserve.jpeg" alt="Restaurant interior" /></div>

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name*</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName}
                     onChange={handleChange} className={errors.firstName ? "error" : ""}/>
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name*</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName}
                     onChange={handleChange} className={errors.lastName ? "error" : ""}/>
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone*</label>
            <input type="tel" id="phone" name="phone" value={formData.phone}
                   onChange={handleChange} className={errors.phone ? "error" : ""}/>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={formData.email}
                   onChange={handleChange} className={errors.email ? "error" : ""}/>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date*</label>
              <input type="date" id="date" name="date" value={formData.date}
                     onChange={handleChange} className={errors.date ? "error" : ""}/>
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="time">Time*</label>
              <input type="time" id="time" name="time" value={formData.time}
                     onChange={handleChange} className={errors.time ? "error" : ""}/>
              {errors.time && <span className="error-message">{errors.time}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="guests">Number of Guests</label>
            <select id="guests" name="guests" value={formData.guests} onChange={handleChange}>
              <option value="1">1 Guest</option><option value="2">2 Guests</option>
              <option value="3">3 Guests</option><option value="4">4 Guests</option>
              <option value="5">5 Guests</option><option value="6">6+ Guests</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Booking…" : "Book Table"}
          </button>

          {serverMsg && (
            <div className={serverMsg.startsWith("✅") ? "info-banner" : "error-banner"} style={{ marginTop: "1rem" }}>
              {serverMsg}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}