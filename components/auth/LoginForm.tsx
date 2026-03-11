// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
  QrCode as QrCodeIcon
} from "@mui/icons-material";
import { loginUser } from "../../services/authApi";
import { setToken, setUser  } from "../../utils/auth";
import toast from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { getCurrentUser } from "../../services/userApi";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { socketService } from "../../services/socketService";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // const [loginMethod, setLoginMethod] = useState<'password' | 'otp' | 'bio'>('password');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      toast.error("All fields required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      toast.error("Invalid email format");
      return false;
    }

    // if (!rememberMe) {
    //   toast.error("You must accept the terms and conditions");
    //   return false;
    // }
    ;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await loginUser(form);
      setToken(res.data.token);

      const response = await getCurrentUser();
      if (response.data?.success && response.data?.data) {
        setUser(response.data.data);
        socketService.connect(response.data.data._id);
      } else {
        throw new Error('Invalid response format');
      }
      
      toast.success(res.data.msg);
      router.push("/dashboard");
       setLoading(false);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Login failed");
         setLoading(false);
      } else {
        toast.error("Something went wrong");
         setLoading(false);
      }
    }
    //  finally {
    //   setLoading(false);
    // }
  };

  // const handleQuickLogin = (email: string, password: string) => {
  //   setForm({ email, password });
  //   toast.success(`Demo credentials filled for ${email}`);
  // };

  return (
    <div className="login-form-wrapper">
      <div className="login-form-card">
        {/* Welcome Header */}
        <div className="login-header">
          <div className="welcome-badge">🌟 Welcome Back!</div>
          <h2>Sign in to your account</h2>
          <p>Don't have an account? <Link href="/register">Create one here</Link></p>
        </div>

        {/* Login Method Tabs */}
        {/* <div className="login-methods">
          <button 
            className={`method-tab ${loginMethod === 'password' ? 'active' : ''}`}
            onClick={() => setLoginMethod('password')}
          >
            <LockIcon /> Password
          </button>
          <button 
            className={`method-tab ${loginMethod === 'otp' ? 'active' : ''}`}
            onClick={() => setLoginMethod('otp')}
          >
            <QrCodeIcon /> OTP
          </button>
          <button 
            className={`method-tab ${loginMethod === 'bio' ? 'active' : ''}`}
            onClick={() => setLoginMethod('bio')}
          >
            <FingerprintIcon /> Biometric
          </button>
        </div> */}

        {/* Demo Credentials */}
        {/* <div className="demo-credentials">
          <p className="demo-label">⚡ Quick Demo Access</p>
          <div className="demo-buttons">
            <button 
              className="demo-btn"
              onClick={() => handleQuickLogin("admin@KanBanBord.ai", "Admin@123")}
            >
              Admin Demo
            </button>
            <button 
              className="demo-btn"
              onClick={() => handleQuickLogin("user@demo.com", "User@123")}
            >
              User Demo
            </button>
            <button 
              className="demo-btn"
              onClick={() => handleQuickLogin("guest@test.com", "Guest@123")}
            >
              Guest Demo
            </button>
          </div>
        </div> */}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="input-group">
            <div className="input-icon">
              <EmailIcon />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Work email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="input-group">
            <div className="input-icon">
              <LockIcon />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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

          {/* Remember Me & Forgot Password */}
          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-link-btn"
              onClick={() => setShowForgotModal(true)}
            >

              Forgot password?
            </button>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* SSO Option */}
          {/* <div className="sso-divider">
            <span>Or continue with</span>
          </div>

          <div className="sso-buttons">
            <button type="button" className="sso-btn google">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="sso-btn github">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div> */}
        </form>

        {/* 2FA Option */}
        <div className="two-factor-option">
          <p>Secure your account with <span>2FA</span></p>
        </div>

        
        {/* Forgot Password Modal */}
        {showForgotModal && (
          <ForgotPasswordModal
            onClose={() => setShowForgotModal(false)}
          />
        )}

      </div>
    </div>
  );
}