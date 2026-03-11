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
  Lock as LockIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon
} from "@mui/icons-material";
import API from "../../services/api";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { socketService } from "../../services/socketService";
import { getAllUsers } from "../../services/userApi";

// Define types
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status?: string;
  taskNumber?: string;
  createdBy?: User;
  assignedTo?: User[];
}

interface TaskEditingData {
  taskId: string;
  user: User;
}

interface TaskEditBlockedData {
  taskId: string;
  message: string;
}

interface TaskEditStoppedData {
  taskId: string;
  user: {
    _id: string;
    name: string;
  };
}

interface TaskModalProps {
  close: () => void;
  refresh: () => void;
  socket: any; // Socket type
  task?: Task;
  isEdit?: boolean;
}

export default function TaskModal({ close, refresh, socket, task, isEdit = false }: TaskModalProps) {
  const { user } = useUser();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  const [assignedTo, setAssignedTo] = useState<User[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animateIn, setAnimateIn] = useState(false);
  const [taskNumber, setTaskNumber] = useState<string>("...");
  const [isEditingLocked, setIsEditingLocked] = useState(false);
  const [editingUser, setEditingUser] = useState<{ _id: string; name: string } | null>(null);

  // Fetch all users for assignment dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        if (res.data?.success) {
          // Filter out current user
          const otherUsers = res.data.data.filter((u: User) => u._id !== user?._id);
          setAvailableUsers(otherUsers);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [user?._id]);

  useEffect(() => {
    setAnimateIn(true);
    
    if (isEdit && task?._id && user) {
      // Notify others that we're editing this task
      const editingData: TaskEditingData = {
        taskId: task._id,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      };
      socketService.emit("taskEditing", editingData);
    }

    // Listen for edit events
    socketService.on("taskEditingStarted", (data: TaskEditingData) => {
      if (data.taskId === task?._id && data.user._id !== user?._id) {
        setIsEditingLocked(true);
        setEditingUser(data.user);
        toast.error(`${data.user.name} started editing this task`);
      }
    });

    socketService.on("taskEditBlocked", (data: TaskEditBlockedData) => {
      if (data.taskId === task?._id) {
        toast.error(data.message);
        close();
      }
    });

    socketService.on("taskEditingStopped", (data: TaskEditStoppedData) => {
      if (data.taskId === task?._id) {
        setIsEditingLocked(false);
        setEditingUser(null);
        toast.success("Task is now available for editing");
      }
    });

    if (!isEdit) {
      fetchLatestTaskNumber();
    } else if (task?.assignedTo) {
      setAssignedTo(task.assignedTo);
    }

    return () => {
      if (isEdit && task?._id && user) {
        const stopData: TaskEditingData = {
          taskId: task._id,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        };
        socketService.emit("taskEditingStopped", stopData);
      }
      
      socketService.off("taskEditingStarted");
      socketService.off("taskEditBlocked");
      socketService.off("taskEditingStopped");
    };
  }, [task?._id]);

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

  const handleAddAssignee = () => {
    if (!selectedUserId) return;
    const userToAdd = availableUsers.find(u => u._id === selectedUserId);
    if (userToAdd && !assignedTo.some(u => u._id === userToAdd._id)) {
      setAssignedTo([...assignedTo, userToAdd]);
      setSelectedUserId('');
    }
  };

  const handleRemoveAssignee = (userId: string) => {
    setAssignedTo(assignedTo.filter(u => u._id !== userId));
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
    if (isEditingLocked) {
      toast.error(`Task is being edited by ${editingUser?.name}`);
      return;
    }

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
        const updateData = {
          ...form,
          assignedTo,
          updatedBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          },
          updatedAt: new Date().toISOString()
        };
        
        const res = await API.put(`/tasks/${task._id}`, updateData);
        
        socketService.emit("taskUpdated", {
          task: updateData,
          updatedBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        });
        
        toast.success("Task updated successfully");
      } else {
        const taskData = {
          ...form,
          assignedTo,
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
        
        socketService.emit("taskCreated", {
          task: res.data,
          createdBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        });
        
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
    if (isEdit && task?._id && user) { 
      socketService.emit("taskEditingStopped", {
        taskId: task._id,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
    
    setAnimateIn(false);
    setTimeout(() => {
      close();
    }, 200);
  };

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
          
          {/* Show lock warning if task is being edited by someone else */}
          {isEditingLocked && editingUser && (
            <div className="edit-lock-warning">
              <LockIcon />
              <div className="lock-text">
                <strong>⚠️ Task is locked</strong>
                <p>Being edited by {editingUser.name}</p>
                <small>You can only view, not edit</small>
              </div>
            </div>
          )}

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
              disabled={isEditingLocked}
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
              disabled={isEditingLocked}
            />
          </div>

          {/* Assign To Section */}
          <div className="form-field">
            <label className="field-label">
              <PersonIcon className="field-icon" />
              Assign To
            </label>
            <div className="assignee-selector">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="assignee-select"
                disabled={isEditingLocked}
              >
                <option value="">Select user to assign</option>
                {availableUsers.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddAssignee}
                className="add-assignee-btn"
                disabled={isEditingLocked || !selectedUserId}
              >
                <PersonAddIcon /> Add
              </button>
            </div>

            {/* Assigned Users List */}
            {assignedTo.length > 0 && (
              <div className="assigned-users-list">
                {assignedTo.map(user => (
                  <div key={user._id} className="assigned-user-tag">
                    <span className="user-tag-info">
                      <strong>{user.name}</strong> ({user.email})
                    </span>
                    {!isEditingLocked && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignee(user._id)}
                        className="remove-user-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                  disabled={isEditingLocked}
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
              disabled={isEditingLocked}
            />
            {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
          </div>

        </div>

        <div className="task-modal-footer">
          <button className="cancel-btn" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className={`submit-btn ${isEdit ? 'edit' : 'create'}`} 
            onClick={handleSubmit}
            disabled={loading || isEditingLocked} 
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