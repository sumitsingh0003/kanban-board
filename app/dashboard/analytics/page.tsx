"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Refresh
} from "@mui/icons-material";
import { getTasks } from "../../../services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define Task type
interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'inprogress' | 'done' | 'deployedonprod';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  order?: number;
  version?: number;
  assignees?: Array<{ name: string; id: string }>;
  comments?: Array<any>;
  taskNumber?: number;
}

export default function Analytics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const deployedTasks = tasks.filter(t => t.status === 'deployedonprod').length;

  const completionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  // Priority distribution
  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#10b981' }
  ].filter(item => item.value > 0); // Only show if value > 0

  // Status distribution
  const statusData = [
    { name: 'To Do', value: todoTasks, color: '#f59e0b' },
    { name: 'In Progress', value: inProgressTasks, color: '#3b82f6' },
    { name: 'Done', value: completedTasks, color: '#10b981' },
    { name: 'Deployed', value: deployedTasks, color: '#8b5cf6' }
  ].filter(item => item.value > 0); // Only show if value > 0

  // Weekly activity data - dynamic based on actual tasks
  const generateWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      completed: Math.floor(Math.random() * 10) + 1, // Replace with actual data
      created: Math.floor(Math.random() * 12) + 2
    }));
  };

  const weeklyData = generateWeeklyData();

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Track your team's performance and productivity</p>
        </div>
        <div className="header-actions">
          <div className="timeframe-selector">
            <button 
              className={timeframe === 'week' ? 'active' : ''}
              onClick={() => setTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={timeframe === 'month' ? 'active' : ''}
              onClick={() => setTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={timeframe === 'year' ? 'active' : ''}
              onClick={() => setTimeframe('year')}
            >
              Year
            </button>
          </div>
          <button className="export-btn">
            <Download /> Export
          </button>
          <button className="refresh-btn" onClick={loadTasks}>
            <Refresh />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <div className="metric-icon total">📊</div>
          <div className="metric-details">
            <span className="metric-label">Total Tasks</span>
            <span className="metric-value">{totalTasks}</span>
          </div>
          <div className="metric-change up">
            <TrendingUp /> +12%
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-icon completed">✅</div>
          <div className="metric-details">
            <span className="metric-label">Completed</span>
            <span className="metric-value">{completedTasks}</span>
          </div>
          <div className="metric-change up">
            <TrendingUp /> +8%
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-icon rate">⚡</div>
          <div className="metric-details">
            <span className="metric-label">Completion Rate</span>
            <span className="metric-value">{completionRate}%</span>
          </div>
          <div className="metric-change up">
            <TrendingUp /> +5%
          </div>
        </div>

        <div className="analytics-metric-card">
          <div className="metric-icon avg">⏱️</div>
          <div className="metric-details">
            <span className="metric-label">Avg. Completion</span>
            <span className="metric-value">2.4d</span>
          </div>
          <div className="metric-change down">
            <TrendingDown /> -0.3d
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Activity Chart */}
        <div className="analytics-chart-card full-width">
          <div className="chart-header">
            <h3>Weekly Activity</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="dot created"></span> Created
              </span>
              <span className="legend-item">
                <span className="dot completed"></span> Completed
              </span>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="analytics-chart-card">
          <h3>Status Distribution</h3>
          <div className="chart-wrapper pie-chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-chart-legend">
              {statusData.map((item, index) => (
                <div key={index} className="legend-row">
                  <span className="color-dot" style={{ background: item.color }}></span>
                  <span className="legend-label">{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="analytics-chart-card">
          <h3>Priority Distribution</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Performance */}
        <div className="analytics-chart-card">
          <h3>Team Performance</h3>
          <div className="team-stats-wrapper">
            <div className="team-member">
              <div className="member-info">
                <span className="member-name">Sarah Chen</span>
                <span className="member-tasks">24 tasks</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <span className="progress-percent">85%</span>
              </div>
            </div>
            <div className="team-member">
              <div className="member-info">
                <span className="member-name">Mike Johnson</span>
                <span className="member-tasks">18 tasks</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '72%' }}></div>
                </div>
                <span className="progress-percent">72%</span>
              </div>
            </div>
            <div className="team-member">
              <div className="member-info">
                <span className="member-name">Priya Patel</span>
                <span className="member-tasks">21 tasks</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '78%' }}></div>
                </div>
                <span className="progress-percent">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="analytics-table-section">
        <div className="section-header">
          <h3>Recent Tasks</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 5).map((task: Task) => (
                <tr key={task._id}>
                  <td className="task-id">KAN-{task._id.slice(-4)}</td>
                  <td className="task-title">{task.title}</td>
                  <td>
                    <span className={`status-badge ${task.status}`}>
                      {task.status === 'todo' ? 'To Do' :
                       task.status === 'inprogress' ? 'In Progress' :
                       task.status === 'done' ? 'Done' : 'Deployed'}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${task.priority || 'medium'}`}>
                      {task.priority || 'medium'}
                    </span>
                  </td>
                  <td>
                    {task.assignees && task.assignees.length > 0 
                      ? task.assignees[0].name 
                      : 'Unassigned'}
                  </td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}