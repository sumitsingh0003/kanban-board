// sections/LoginHero.tsx
"use client";

import { 
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon 
} from "@mui/icons-material";

export default function LoginHero() {
  return (
    <section className="login-hero">
      <div className="hero-gradient"> Login </div>
      <div className="hero-particles">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      
      <div className="hero-content-modern">
        <div className="hero-text">
          <span className="live-badge">
            <span className="pulse-dot"></span>
            LIVE NOW
          </span>
          <h1>
            Your AI-Powered
            <span className="gradient-text-modern"> Productivity Hub</span>
          </h1>
          <p>
            Join 50,000+ professionals who've already streamlined their workflow
          </p>
        </div>

        <div className="live-stats">
          <div className="stat-card-modern">
            <PeopleIcon />
            <div className="stat-info">
              <span className="stat-value">1,234</span>
              <span className="stat-label">Active Now</span>
            </div>
          </div>
          <div className="stat-card-modern">
            <TrendingIcon />
            <div className="stat-info">
              <span className="stat-value">89%</span>
              <span className="stat-label">Productivity ↑</span>
            </div>
          </div>
          <div className="stat-card-modern">
            <SpeedIcon />
            <div className="stat-info">
              <span className="stat-value">2.5x</span>
              <span className="stat-label">Faster Tasks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}