"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp as TrendingUpIcon,
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  People as TeamIcon,
  Speed as SpeedIcon,
  MoreVert as MoreIcon
} from "@mui/icons-material";
import { getTasks } from "../../services/api";
import { Line, Doughnut } from "react-chartjs-2";
import {getUser as getUserStorage} from "@/utils/auth"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Add Task type
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done' | 'deployedonprod';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  order?: number;
  version?: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]); // Add type here
  const [loading, setLoading] = useState(true);
  const getCurrentUser = getUserStorage();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    deployed: 0
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // Add type to taskData parameter
  const calculateStats = (taskData: Task[]) => {
    const stats = {
      total: taskData.length,
      completed: taskData.filter(t => t.status === 'done').length,
      inProgress: taskData.filter(t => t.status === 'inprogress').length,
      todo: taskData.filter(t => t.status === 'todo').length,
      deployed: taskData.filter(t => t.status === 'deployedonprod').length
    };
    setStats(stats);
  };

  // Chart Data
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const doughnutData = {
    labels: ['To Do', 'In Progress', 'Done', 'Deployed'],
    datasets: [
      {
        data: [stats.todo, stats.inProgress, stats.completed, stats.deployed],
        backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  const recentActivities = [
    { user: "Sarah Chen", action: "completed", task: "UI Design Review", time: "2 min ago", avatar: "SC" },
    { user: "Mike Johnson", action: "started", task: "API Integration", time: "15 min ago", avatar: "MJ" },
    { user: "Priya Patel", action: "commented on", task: "Q3 Planning", time: "1 hour ago", avatar: "PP" },
    { user: "Alex Kumar", action: "assigned", task: "Bug Fix #234", time: "3 hours ago", avatar: "AK" },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div>
          <h1>Welcome back, {getCurrentUser?.name || "NA"}! 👋</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
        <div className="date-badge">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <TaskIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-trend up">
            <TrendingUpIcon /> +12%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CompletedIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-trend up">
            <TrendingUpIcon /> +8%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <PendingIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.inProgress}</span>
          </div>
          <div className="stat-trend down">
            <TrendingUpIcon /> -2%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon team">
            <TeamIcon />
          </div>
          <div className="stat-details">
            <span className="stat-label">Team Members</span>
            <span className="stat-value">12</span>
          </div>
          <div className="stat-trend up">
            <TrendingUpIcon /> +3
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <button className="more-btn"><MoreIcon /></button>
          </div>
          <div className="chart-container">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Task Distribution</h3>
            <button className="more-btn"><MoreIcon /></button>
          </div>
          <div className="chart-container doughnut">
            <Doughnut data={doughnutData} options={{ cutout: '70%', responsive: true }} />
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="color-dot todo"></span> To Do ({stats.todo})
            </div>
            <div className="legend-item">
              <span className="color-dot progress"></span> In Progress ({stats.inProgress})
            </div>
            <div className="legend-item">
              <span className="color-dot done"></span> Done ({stats.completed})
            </div>
            <div className="legend-item">
              <span className="color-dot deployed"></span> Deployed ({stats.deployed})
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="activity-grid">
        <div className="activity-card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <button className="view-all">View All</button>
          </div>
          <div className="activity-feed">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">{activity.avatar}</div>
                <div className="activity-content">
                  <p>
                    <span className="user-name">{activity.user}</span> {activity.action}{' '}
                    <span className="task-name">{activity.task}</span>
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn create">
              <TaskIcon /> Create Task
            </button>
            <button className="action-btn invite">
              <TeamIcon /> Invite Team
            </button>
            <button className="action-btn report">
              <SpeedIcon /> Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}