// components/dashboard/Header.tsx
"use client";

import { useState } from "react";
import { 
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  Logout
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { logout } from "@/utils/auth";

export default function Header() {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useUser(); // ✅ Get user from context
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks, projects, or team members..."
          />
        </div>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <NotificationsIcon />
          <span className="notification-badge">3</span>
        </button>

        <button className="settings-btn">
          <SettingsIcon />
        </button>

        <div className="profile-dropdown">
          <button 
            className="profile-trigger"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="profile-avatar">
              {user?.name ? (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <PersonIcon />
              )}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user?.name || "Loading..."}</span>
              <span className="profile-role">
                Software Engineer
              </span>
            </div>
            <ExpandMoreIcon className={`dropdown-icon ${showProfile ? 'open' : ''}`} />
          </button>

          {showProfile && (
            <div className="dropdown-menu">
              <Link href="/dashboard/profile" onClick={() => setShowProfile(false)}>
                Your Profile
              </Link>
              <button onClick={handleLogout}>
                <Logout /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}