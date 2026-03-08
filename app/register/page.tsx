// pages/register.tsx
import RegisterForm from "@/components/auth/RegisterForm";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import AuthHero from "@/sections/AuthHero";
import TrustIndicators from "@/sections/TrustIndicators";
import UserTestimonials from "@/sections/UserTestimonials";

export default function RegisterPage() {
  return (
    <div className="register-page">
      <Header />
      <AuthHero />
      
      <div className="register-container">
        <div className="register-grid">
          {/* Left Side - Benefits */}
          <div className="benefits-section">
            <h1 className="benefits-title">
              Join <span className="gradient-text">KanBanBord AI</span>
            </h1>
            <p className="benefits-subtitle">
              Start managing your tasks like a pro with AI-powered insights and real-time collaboration.
            </p>

            <div className="feature-list">
              {[
                { icon: "RiRocketLine", text: "14-day free trial, no credit card required" },
                { icon: "RiStarLine", text: "Access to all premium features" },
                { icon: "RiTeamLine", text: "Collaborate with unlimited team members" },
                { icon: "RiBarChartLine", text: "Advanced analytics and reporting" },
                { icon: "RiShieldLine", text: "Enterprise-grade security" },
                { icon: "RiCustomerServiceLine", text: "24/7 priority support" }
              ].map((item, index) => {
                const IconComponent = require("react-icons/ri")[item.icon];
                return (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">
                      <IconComponent />
                    </div>
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="trust-badge-wrapper">
              <p className="trust-text">Trusted by 10,000+ teams</p>
              <div className="company-logos">
                {["TechCorp", "StartupX", "DesignHub", "CodeLabs"].map((company, i) => (
                  <div key={i} className="company-logo-placeholder">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <RegisterForm />
        </div>
      </div>

      <TrustIndicators />
      <UserTestimonials />
      <Footer />
    </div>
  );
}