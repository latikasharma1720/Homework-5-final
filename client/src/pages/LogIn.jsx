import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LogIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) setRedirectMessage(location.state.message);
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setLoginError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await login(formData.email, formData.password);
    if (result.success) {
      const redirectTo = location.state?.from || "/menu";
      navigate(redirectTo, { replace: true });
    } else {
      setLoginError(result.error || "Login failed");
    }
  };

  return (
    <main className="page auth-page">
      <div className="auth-container">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to make reservations and save your favorites.</p>

        {redirectMessage && <div className="info-banner">{redirectMessage}</div>}
        {loginError && <div className="error-banner">{loginError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={formData.email}
                   onChange={handleChange} className={errors.email ? "error" : ""} placeholder="your@email.com" />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <div className="password-input">
              <input type={showPassword ? "text" : "password"} id="password" name="password"
                     value={formData.password} onChange={handleChange} className={errors.password ? "error" : ""} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="auth-button">Log In</button>
          <p className="auth-footer">New here? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </main>
  );
}
