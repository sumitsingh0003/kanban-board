// pages/login.tsx
import LoginForm from "@/components/auth/LoginForm";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import LoginHero from "@/sections/LoginHero";
import SecurityBadges from "@/sections/SecurityBadges";
import RecentActivity from "@/sections/RecentActivity";
import AppShowcase from "@/sections/AppShowcase";

export default function LoginPage() {
  return (
    <div className="login-page">
      <Header />
      <LoginHero />
      
      <SecurityBadges />
      
      <div className="login-container">
        <div className="login-grid">
          {/* Left Side - App Showcase */}
          <div className="showcase-section">
            <div className="showcase-card">
              <h2 className="showcase-title">
                Welcome Back to 
                <span className="gradient-text-modern"> KanBanBord AI</span>
              </h2>
              
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="preview-title">Your Dashboard</div>
                </div>
                
                <div className="preview-content">
                  <div className="preview-stats">
                    <div className="stat-card-preview">
                      <div className="stat-value">23</div>
                      <div className="stat-label">Active Tasks</div>
                    </div>
                    <div className="stat-card-preview">
                      <div className="stat-value">12</div>
                      <div className="stat-label">Team Members</div>
                    </div>
                  </div>
                  
                  <div className="preview-kanban">
                    {['To Do', 'In Progress', 'Done'].map((status) => (
                      <div key={status} className="kanban-column-preview">
                        <div className="column-header">{status}</div>
                        <div className="column-cards">
                          <div className="card-preview"></div>
                          <div className="card-preview"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn">📋 Create Task</button>
                  <button className="action-btn">👥 Invite Team</button>
                  <button className="action-btn">📊 View Reports</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <LoginForm />
        </div>
      </div>

      
      <RecentActivity />
      <AppShowcase />
      <Footer />
    </div>
  );
}