// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Visibility, 
  VisibilityOff,
  Google,
  GitHub
} from "@mui/icons-material";
import { registerUser } from "../../services/authApi";
import { setToken } from "../../utils/auth";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePhone = (phone: string) => {
    return !phone || /^[0-9]{10}$/.test(phone);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password);
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthClass = (strength: number) => {
    if (strength <= 25) return 'strength-weak';
    if (strength <= 50) return 'strength-fair';
    if (strength <= 75) return 'strength-good';
    return 'strength-strong';
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, Email and Password required");
      return false;
    }

    if (!validateEmail(form.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!validatePhone(form.phone)) {
      toast.error("Invalid phone number (10 digits required)");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    if (!validatePassword(form.password)) {
      toast.error("Password must contain 8 characters, uppercase, number and symbol");
      return false;
    }

    if (!form.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { confirmPassword, acceptTerms, ...payload } = form;
      const res = await registerUser(payload);
      setToken(res.data.token);
      toast.success(res.data.msg);
      setStep(2);
      
      setTimeout(() => setStep(3), 2000);
      setTimeout(() => router.push("/dashboard"), 4000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Registration failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const strengthClass = getStrengthClass(passwordStrength);

  return (
    <div className="register-form-card">
      <div className="form-header">
        <h2>Get Started</h2>
        <p>Join thousands of productive teams</p>
      </div>

      {/* Social Login */}
      {/* <div className="social-login">
        <button className="social-btn google" onClick={() => toast.success("Google Sign In")}>
          <Google /> Google
        </button>
        <button className="social-btn github" onClick={() => toast.success("GitHub Sign In")}>
          <GitHub /> GitHub
        </button>
      </div> */}

      <div className="divider">
        <span> Sign up with email </span>
      </div>

      {/* Stepper */}
      {/* <div className="form-stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Account</div>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Verify</div>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Workspace</div>
        </div>
      </div> */}

      <form onSubmit={handleSubmit} className="register-form">
        {step === 1 && (
          <>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number (Optional)"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password *"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {form.password && (
              <div className="password-strength">
                <div className={`strength-bar ${strengthClass}`} style={{ width: `${passwordStrength}%` }}></div>
                <span className="strength-text">
                  {passwordStrength <= 25 ? 'Weak' : 
                   passwordStrength <= 50 ? 'Fair' : 
                   passwordStrength <= 75 ? 'Good' : 'Strong'} password
                </span>
              </div>
            )}

            <div className="form-group password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="acceptTerms">
                I agree to the <Link href="/register#.">Terms of Service</Link> and <Link href="/register#.">Privacy Policy</Link>
              </label>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="verification-message">
            <div className="message-icon">📧</div>
            <h3>Check Your Email</h3>
            <p>We've sent a verification link to {form.email}</p>
            <p className="small">Redirecting to dashboard...</p>
          </div>
        )}

        {step === 3 && (
          <div className="success-message">
            <div className="message-icon">✅</div>
            <h3>Email Verified!</h3>
            <p>Setting up your workspace...</p>
          </div>
        )}

        {step === 1 && (
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        )}
      </form>

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <span onClick={() => router.push("/login")}>
            Sign in
          </span>
        </p>
      </div>

      <div className="security-badge">
        🔒 256-bit SSL encrypted • We never share your data
      </div>
    </div>
  );
}