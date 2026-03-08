// sections/AuthHero.tsx
"use client";

export default function AuthHero() {
  return (
    <section className="auth-hero">
      <div className="hero-background">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Join the Future of
          <span className="gradient-text">Task Management</span>
        </h1>
        
        <p className="hero-subtitle">
          Create your free account and experience the power of AI-driven productivity
        </p>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Tasks Daily</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </div>
    </section>
  );
}