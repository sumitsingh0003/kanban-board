"use client";

import { useEffect, useState } from "react";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import API from "../../../services/api";
import toast from "react-hot-toast";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { useUser } from "@/context/UserContext"; 
// import { getToken,  setUser as setUserStorage, getUser as getUserStorage,  removeUser  } from "@/utils/auth";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  joinedDate?: string;
};

export default function Profile() {
  const { user, updateUserData } = useUser();
  // const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  // const storedUser = getUserStorage();

  // useEffect(() => {
  //   fetchUser();
  // }, []);

  // const fetchUser = async () => {
  //   try {
  //     const res = await API.get(`/users/${storedUser?._id}`);
  //     setUser(res.data.data);
  //     setEditedUser(res.data.data);
  //   } catch (error) {
  //     toast.error("Failed to load profile");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setLoading(false);
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedUser(user);
  };

  const handleSave = async () => {
    if (!editedUser || !user) return;

    try {
      // Email cannot be edited
      const { email, ...updateData } = editedUser;
      
      const res = await API.put(`/users/${user._id}`, updateData);
      
      if (res.data?.success && res.data?.data) {
        updateUserData(res.data.data);
        setEditing(false);
        toast.success("Profile updated successfully");
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedUser) return;
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  function formatDate(date?: string | Date): string {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-large">
            {user.name.charAt(0)}
          </div>
        </div>
        <div className="profile-title">
          <h1>{user.name}</h1>
          <p>Software Engineer at FlowBoard AI</p>
          <span className="member-since">Member since {user?.createdAt && formatDate(user?.createdAt) || 'Jan 2024'}</span>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <PersonIcon /> Profile Information
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <LockIcon /> Security
        </button>
      </div>

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="profile-content">
          <div className="profile-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              {!editing ? (
                <button className="edit-btn" onClick={handleEdit}>
                  <EditIcon /> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <SaveIcon /> Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <CloseIcon /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">
                  <PersonIcon />
                </div>
                <div className="info-content">
                  <label>Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editedUser?.name || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  ) : (
                    <p>{user.name}</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <EmailIcon />
                </div>
                <div className="info-content">
                  <label>Email Address</label>
                  <p className="email-disabled">{user.email}</p>
                  <small className="email-note">Email cannot be changed</small>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <PhoneIcon />
                </div>
                <div className="info-content">
                  <label>Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editedUser?.phone || ''}
                      onChange={handleChange}
                      className="edit-input"
                      placeholder="+1 234 567 8900"
                    />
                  ) : (
                    <p>{user.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <BusinessIcon />
                </div>
                <div className="info-content">
                  <label>Company</label>
                    <p>Web InfoTech</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <WorkIcon />
                </div>
                <div className="info-content">
                  <label>Job Title</label>
                    <p>Software Engineer || FullStack Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab Content */}
      {activeTab === 'security' && (
        <div className="profile-content">
          <div className="profile-card">
            <h3>Password & Security</h3>
            
            <div className="security-info">
              <div className="security-item">
                <div className="security-icon">
                  <LockIcon />
                </div>
                <div className="security-details">
                  <h4>Password</h4>
                  <p>Last changed: 30 days ago</p>
                </div>
                <button 
                  className="change-password-btn"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>

              <div className="security-item">
                <div className="security-icon">
                  <LockIcon />
                </div>
                <div className="security-details">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security</p>
                </div>
                <button className="enable-2fa-btn">
                  Enable
                </button>
              </div>

              <div className="security-item">
                <div className="security-icon">
                  <LockIcon />
                </div>
                <div className="security-details">
                  <h4>Active Sessions</h4>
                  <p>You're logged in on 2 devices</p>
                </div>
                <button className="manage-sessions-btn">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ForgotPasswordModal 
          onClose={() => setShowPasswordModal(false)}
          email={user?.email}
        />
      )}
    </div>
  );
}