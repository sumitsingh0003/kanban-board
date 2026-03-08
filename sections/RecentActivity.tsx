// sections/RecentActivity.tsx
"use client";

import {
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Assignment as TaskIcon
} from "@mui/icons-material";

export default function RecentActivity() {
  const activities = [
    { user: "Sarah Chen", action: "completed task", task: "UI Design Review", time: "2 min ago", status: "done" },
    { user: "Mike Johnson", action: "started", task: "API Integration", time: "15 min ago", status: "progress" },
    { user: "Priya Patel", action: "commented on", task: "Q3 Planning", time: "1 hour ago", status: "comment" },
    { user: "Alex Kumar", action: "assigned", task: "Bug Fix #234", time: "3 hours ago", status: "assigned" },
    { user: "Emma Wilson", action: "moved", task: "Documentation", time: "5 hours ago", status: "moved" }
  ];

  return (
    <section className="activity-section">
      <div className="activity-header">
        <h2>Live Activity Feed</h2>
        <div className="live-indicator">
          <span className="pulse-dot"></span>
          Live Updates
        </div>
      </div>

      <div className="activity-feed">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-avatar">
              {activity.user.charAt(0)}
            </div>
            <div className="activity-content">
              <p>
                <span className="user-name">{activity.user}</span>
                <span className="action-text"> {activity.action} </span>
                <span className="task-name">{activity.task}</span>
              </p>
              <div className="activity-meta">
                <ScheduleIcon className="meta-icon" />
                <span className="time">{activity.time}</span>
              </div>
            </div>
            <div className={`activity-status ${activity.status}`}>
              {activity.status === 'done' && <CheckCircleIcon />}
              {activity.status === 'progress' && <CircleIcon />}
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-btn">
        View All Activity
        <span>→</span>
      </button>
    </section>
  );
}