"use client";

import { useState, useEffect } from "react";
import { 
  Close as CloseIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  Visibility,
  VisibilityOff
} from "@mui/icons-material";
import { forgotPassword, verifyOTP, resetPassword } from "../../services/authApi";
import toast from "react-hot-toast";
import axios from "axios";

interface Props {
  onClose: () => void;
  email?: string;
}

export default function ForgotPasswordModal({ onClose, email: initialEmail = "" }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      toast.success(res.data.msg || "OTP sent to your email");
      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Failed to send OTP");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      toast.success(res.data.msg || "OTP resent successfully");
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Failed to resend OTP");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP({ email, otp: otpString });
      toast.success(res.data.msg || "OTP verified successfully");
      setStep(3);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Invalid OTP");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error("Password must contain 8 characters, uppercase, number and symbol");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({ email, newPassword });
      toast.success(res.data.msg || "Password reset successfully");
      setStep(4);
      
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.msg || "Failed to reset password");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-modal-overlay">
      <div className="forgot-modal">
        <button className="modal-close" onClick={onClose}>
          <CloseIcon />
        </button>

        <div className="modal-header">
          <h2>Reset Password</h2>
          <p>We'll help you recover your account</p>
        </div>

        {step === 1 && (
          <div className="modal-step">
            <div className="input-group modal-input">
              <div className="input-icon">
                <EmailIcon />
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button 
              className="modal-action-btn"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step">
            <p className="otp-instruction">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
            
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-digit"
                />
              ))}
            </div>

            <div className="timer-section">
              {timer > 0 ? (
                <p className="timer-text">
                  Resend OTP in <span>{timer}s</span>
                </p>
              ) : (
                <button 
                  className="resend-link"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button 
              className="modal-action-btn"
              onClick={handleVerifyOTP}
              disabled={loading || otp.join("").length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="modal-step">
            <div className="input-group modal-input">
              <div className="input-icon">
                <LockIcon />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <div className="input-group modal-input">
              <div className="input-icon">
                <LockIcon />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <button 
              className="modal-action-btn"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="modal-step success-step">
            <div className="success-icon">
              <VerifiedIcon />
            </div>
            <h3>Password Reset Successful!</h3>
            <p>You can now login with your new password</p>
            <p className="redirect-note">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}