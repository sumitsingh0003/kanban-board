// components/task/TaskModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Close as CloseIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import API from "../../services/api";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
  taskNumber?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface TaskModalProps {
  close: () => void;
  refresh: () => void;
  socket: any;
  task?: Task;
  isEdit?: boolean;
}

export default function TaskModal({ close, refresh, socket, task, isEdit = false }: TaskModalProps) {
  const { user } = useUser(); // Get logged in user
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animateIn, setAnimateIn] = useState(false);
  const [taskNumber, setTaskNumber] = useState<string>("...");

  useEffect(() => {
    setAnimateIn(true);
    
    if (!isEdit) {
      fetchLatestTaskNumber();
    }
  }, []);

  useEffect(() => {
    if (task && isEdit) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ""
      });
      if (task.taskNumber) {
        setTaskNumber(task.taskNumber);
      }
    }
  }, [task, isEdit]);

  const fetchLatestTaskNumber = async () => {
    try {
      const res = await API.get("/tasks/latest-number");
      const latestNumber = res.data?.latestNumber ?? 0;
      const nextNumber = latestNumber + 1;
      
      if (nextNumber < 1000) {
        setTaskNumber(nextNumber.toString().padStart(3, '0'));
      } else {
        setTaskNumber(nextNumber.toString());
      }
    } catch (error) {
      console.error("Failed to fetch task number:", error);
      setTaskNumber(Date.now().toString().slice(-6));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      if (isEdit && task?._id) {
        // Update task - automatically add updatedBy
        const updateData = {
          ...form,
          updatedBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          updatedAt: new Date().toISOString()
        };
        
        const res = await API.put(`/tasks/${task._id}`, updateData);
        socket.emit("taskUpdated", res.data.data || res.data);
        toast.success("Task updated successfully");
      } else {
        // Create task - automatically add createdBy
        const taskData = {
          ...form,
          taskNumber,
          status: "todo",
          order: 0,
          createdBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          createdAt: new Date().toISOString()
        };
        
        const res = await API.post("/tasks", taskData);
        socket.emit("taskCreated", res.data);
        toast.success(`Task KAN-${taskNumber} created successfully`);
      }

      refresh();
      
      setAnimateIn(false);
      setTimeout(() => {
        close();
      }, 200);
      
    } catch (error: any) {
      console.error("Failed to save task:", error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again.");
      } else {
        toast.error(error.response?.data?.msg || "Failed to save task");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      close();
    }, 200);
  };

  // Show user info in edit mode
  // const getCreatorInfo = () => {
  //   if (!task?.createdBy) return null;
  //   return (
  //     <div className="task-creator-info">
  //       <PersonIcon className="creator-icon" />
  //       <span>Created by: {task.createdBy.name} ({task.createdBy.email})</span>
  //     </div>
  //   );
  // };

  return (
    <div className={`task-modal-overlay ${animateIn ? 'show' : ''}`} onClick={handleClose}>
      <div className={`task-modal-container ${animateIn ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="task-modal-header">
          <h2 className="modal-title">
            {isEdit ? <EditIcon /> : <TitleIcon />}
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="task-modal-body">
          
          {!isEdit && (
            <div className="task-number-preview">
              <span className="preview-label">Task will be created as:</span>
              <span className="preview-value">KAN-{taskNumber}</span>
            </div>
          )}

          {isEdit && task?.taskNumber && (
            <div className="task-id-badge">
              <span className="badge-label">Task ID:</span>
              <span className="badge-value">KAN-{task.taskNumber}</span>
            </div>
          )}

          {/* Show creator info in edit mode */}
          {/* {isEdit && getCreatorInfo()} */}

          <div className="form-field">
            <label className="field-label">
              <TitleIcon className="field-icon" />
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => {
                setForm({...form, title: e.target.value});
                if (errors.title) setErrors({...errors, title: ''});
              }}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-field">
            <label className="field-label">
              <DescriptionIcon className="field-icon" />
              Description
            </label>
            <textarea
              className="form-input"
              placeholder="Describe your task..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={4}
            />
          </div>

          <div className="form-field">
            <label className="field-label">
              <FlagIcon className="field-icon" />
              Priority
            </label>
            <div className="priority-selector">
              {['low', 'medium', 'high'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  className={`priority-btn ${priority} ${form.priority === priority ? 'selected' : ''}`}
                  onClick={() => setForm({...form, priority})}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">
              <CalendarIcon className="field-icon" />
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              className={`form-input ${errors.dueDate ? 'error' : ''}`}
              value={form.dueDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setForm({...form, dueDate: e.target.value});
                if (errors.dueDate) setErrors({...errors, dueDate: ''});
              }}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

          {/* Show current user info at bottom */}
          {/* <div className="current-user-info">
            <PersonIcon />
            <span>You are: {user?.name} ({user?.email})</span>
          </div> */}

        </div>

        <div className="task-modal-footer">
          <button className="cancel-btn" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className={`submit-btn ${isEdit ? 'edit' : 'create'}`} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <>
                <SaveIcon />
                {isEdit ? 'Update Task' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}