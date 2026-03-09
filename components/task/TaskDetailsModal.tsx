// components/task/TaskDetailsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  Description as DescriptionIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as TaskIcon,
  Lock as LockIcon
} from "@mui/icons-material";
import { useUser } from "@/context/UserContext";
import { socket } from "../../services/socket";
import toast from "react-hot-toast";

// Custom date formatting functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? 'just now' : `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface TaskDetailsModalProps {
  task: any;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface TaskEditingData {
  taskId: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface TaskEditStoppedData {
  taskId: string;
  user: {
    _id: string;
    name: string;
  };
}

export default function TaskDetailsModal({ task, onClose, onEdit, onDelete }: TaskDetailsModalProps) {
  const { user } = useUser();
  const [animateIn, setAnimateIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [editorName, setEditorName] = useState('');

  // Listen for edit events
  useEffect(() => {
    if (!task?._id) return;

    const handleEditingStarted = (data: TaskEditingData) => {
      if (data.taskId === task._id && data.user._id !== user?._id) {
        setIsBeingEdited(true);
        setEditorName(data.user.name);
        toast.success(`${data.user.name} started editing this task`, {
          duration: 3000,
          icon: '✏️',
          style: {
            background: '#f59e0b',
            color: 'white',
          }
        });
      }
    };

    const handleEditingStopped = (data: TaskEditStoppedData) => {
      if (data.taskId === task._id) {
        setIsBeingEdited(false);
        setEditorName('');
        toast.success('Task is now available', {
          duration: 2000,
          icon: '🔓',
          style: {
            background: '#10b981',
            color: 'white',
          }
        });
      }
    };

    socket.on("taskEditingStarted", handleEditingStarted);
    socket.on("taskEditingStopped", handleEditingStopped);

    return () => {
      socket.off("taskEditingStarted", handleEditingStarted);
      socket.off("taskEditingStopped", handleEditingStopped);
    };
  }, [task._id, user?._id]);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleEditClick = () => {
    if (isBeingEdited) {
      toast.error(`Task is being edited by ${editorName}`, {
        duration: 3000,
        icon: '🔒'
      });
      return;
    }
    if (onEdit) onEdit();
  };

  const handleDeleteClick = () => {
    if (isBeingEdited) {
      toast.error(`Task is being edited by ${editorName}`, {
        duration: 3000,
        icon: '🔒'
      });
      return;
    }
    if (onDelete) onDelete();
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'todo': return '#f59e0b';
      case 'inprogress': return '#3b82f6';
      case 'done': return '#10b981';
      case 'deployedonprod': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'todo': return <ScheduleIcon />;
      case 'inprogress': return <ScheduleIcon />;
      case 'done': return <CheckCircleIcon />;
      case 'deployedonprod': return <CheckCircleIcon />;
      default: return <TaskIcon />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'done': return 'Done';
      case 'deployedonprod': return 'Deployed on Production';
      default: return status;
    }
  };

  // Strip HTML from description
  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className={`task-details-overlay ${animateIn ? 'show' : ''}`} onClick={handleClose}>
      <div className={`task-details-container ${animateIn ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Header with gradient background */}
        <div className="task-details-header">
          <div className="header-content">
            <div className="task-badge">
              <span className="task-id-large">KAN-{task.taskNumber || task._id.slice(-4)}</span>
              <span 
                className="task-status-badge"
                style={{ 
                  background: `${getStatusColor(task.status)}15`,
                  color: getStatusColor(task.status),
                  borderColor: getStatusColor(task.status)
                }}
              >
                {getStatusIcon(task.status)}
                {getStatusLabel(task.status)}
              </span>
            </div>
            <h2 className="task-title-large">{task.title}</h2>
            
            {/* Show edit lock warning in header */}
            {isBeingEdited && (
              <div className="header-edit-warning">
                <LockIcon /> Being edited by {editorName}
              </div>
            )}
          </div>
          <button className="details-close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        {/* Tabs */}
        <div className="details-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <DescriptionIcon /> Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <HistoryIcon /> Activity
          </button>
        </div>

        {/* Content Area */}
        <div className="details-content">
          {activeTab === 'details' && (
            <div className="details-grid">
              
              {/* Left Column - Main Info */}
              <div className="details-left">
                
                {/* Priority & Due Date Cards */}
                <div className="info-cards">
                  <div className="info-card priority">
                    <div className="card-icon" style={{ background: `${getPriorityColor(task.priority)}15` }}>
                      <FlagIcon style={{ color: getPriorityColor(task.priority) }} />
                    </div>
                    <div className="card-content">
                      <span className="card-label">Priority</span>
                      <span className="card-value" style={{ color: getPriorityColor(task.priority) }}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                  </div>

                  <div className="info-card due-date">
                    <div className="card-icon" style={{ background: '#6366f115' }}>
                      <CalendarIcon style={{ color: '#6366f1' }} />
                    </div>
                    <div className="card-content">
                      <span className="card-label">Due Date</span>
                      <span className="card-value">
                        {task.dueDate ? formatDate(task.dueDate) : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {task.description && (
                  <div className="description-section">
                    <h3 className="section-title">
                      <DescriptionIcon /> Description
                    </h3>
                    <div className="description-content">
                      {task.description.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: task.description }} />
                      ) : (
                        <p>{task.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Dates Info */}
                <div className="dates-section">
                  <div className="date-item">
                    <TimeIcon className="date-icon" />
                    <div className="date-text">
                      <span>Created</span>
                      <strong>{formatRelativeTime(task.createdAt)}</strong>
                      <small>{formatDateTime(task.createdAt)}</small>
                    </div>
                  </div>
                  {task.updatedAt && task.updatedAt !== task.createdAt && (
                    <div className="date-item">
                      <TimeIcon className="date-icon" />
                      <div className="date-text">
                        <span>Updated</span>
                        <strong>{formatRelativeTime(task.updatedAt)}</strong>
                        <small>{formatDateTime(task.updatedAt)}</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - User Info */}
              <div className="details-right">
                
                {/* Creator Card */}
                {task.createdBy && (
                  <div className="user-card creator">
                    <h3 className="user-card-title">
                      <PersonIcon /> Created By
                    </h3>
                    <div className="user-info">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {task.createdBy.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{task.createdBy.name}</span>
                        <span className="user-email">
                          <EmailIcon /> {task.createdBy.email}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Last Updated By Card */}
                {task.updatedBy && task.updatedBy._id !== task.createdBy?._id && (
                  <div className="user-card updater">
                    <h3 className="user-card-title">
                      <EditIcon /> Last Updated By
                    </h3>
                    <div className="user-info">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                        {task.updatedBy.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{task.updatedBy.name}</span>
                        <span className="user-email">
                          <EmailIcon /> {task.updatedBy.email}
                        </span>
                        <span className="update-time">
                          {formatRelativeTime(task.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assignees (if any) */}
                {task.assignedTo && task.assignedTo.length > 0 && (
                  <div className="assignees-section">
                    <h3 className="section-title">
                      <PersonIcon /> Assigned To
                    </h3>
                    <div className="assignees-list">
                      {task.assignedTo.map((assignee: any, index: number) => (
                        <div key={index} className="assignee-item">
                          <div className="assignee-avatar" style={{ background: `hsl(${index * 60}, 70%, 60%)` }}>
                            {assignee.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="assignee-info">
                            <span className="assignee-name">{assignee.name}</span>
                            <span className="assignee-email">{assignee.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-section">
              <h3 className="section-title">Activity History</h3>
              <div className="activity-timeline">
                {/* Created Event */}
                <div className="timeline-item">
                  <div className="timeline-icon" style={{ background: '#10b981' }}>
                    <TaskIcon />
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-title">Task Created</span>
                      <span className="timeline-time">
                        {formatRelativeTime(task.createdAt)}
                      </span>
                    </div>
                    {task.createdBy && (
                      <p className="timeline-description">
                        Created by <strong>{task.createdBy.name}</strong> ({task.createdBy.email})
                      </p>
                    )}
                    <div className="timeline-datetime">
                      {formatDateTime(task.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Updated Event (if exists) */}
                {task.updatedBy && task.updatedAt !== task.createdAt && (
                  <div className="timeline-item">
                    <div className="timeline-icon" style={{ background: '#f59e0b' }}>
                      <EditIcon />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-title">Task Updated</span>
                        <span className="timeline-time">
                          {formatRelativeTime(task.updatedAt)}
                        </span>
                      </div>
                      <p className="timeline-description">
                        Updated by <strong>{task.updatedBy.name}</strong> ({task.updatedBy.email})
                      </p>
                      <div className="timeline-datetime">
                        {formatDateTime(task.updatedAt)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Changes */}
                {task.status && (
                  <div className="timeline-item">
                    <div className="timeline-icon" style={{ background: getStatusColor(task.status) }}>
                      {getStatusIcon(task.status)}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-title">Current Status</span>
                        <span className="timeline-time">Now</span>
                      </div>
                      <p className="timeline-description">
                        Task is <strong>{getStatusLabel(task.status)}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="details-footer">
          <button 
            className={`footer-btn edit ${isBeingEdited ? 'disabled' : ''}`} 
            onClick={handleEditClick}
            disabled={isBeingEdited}
            title={isBeingEdited ? `Being edited by ${editorName}` : 'Edit task'}
          >
            {isBeingEdited ? <LockIcon /> : <EditIcon />}
            {isBeingEdited ? 'Locked' : 'Edit Task'}
          </button>
          <button 
            className={`footer-btn delete ${isBeingEdited ? 'disabled' : ''}`} 
            onClick={handleDeleteClick}
            disabled={isBeingEdited}
            title={isBeingEdited ? `Being edited by ${editorName}` : 'Delete task'}
          >
            {isBeingEdited ? <LockIcon /> : <DeleteIcon />}
            {isBeingEdited ? 'Locked' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}