import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setSignupError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await signup(formData.fullName, formData.email, formData.password);
    if (result.success) navigate("/");
    else setSignupError(result.error || "Signup failed");
  };

  return (
    <main className="page auth-page">
      <div className="auth-container">
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join us to save favorites and make reservations.</p>

        {signupError && <div className="error-banner">{signupError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName}
                   onChange={handleChange} className={errors.fullName ? "error" : ""} />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={formData.email}
                   onChange={handleChange} className={errors.email ? "error" : ""} />
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <div className="password-input">
              <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                     value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "error" : ""} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="password-toggle">
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-button">Create Account</button>
          <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </main>
  );
}
