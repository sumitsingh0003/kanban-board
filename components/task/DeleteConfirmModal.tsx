// components/task/DeleteConfirmModal.tsx
"use client";

import { useState } from "react";
import { 
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import API from "../../services/api";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

interface DeleteConfirmModalProps {
  task: any;
  onClose: () => void;
  onDelete: () => void;
  socket: any;
}

export default function DeleteConfirmModal({ task, onClose, onDelete, socket }: DeleteConfirmModalProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);

  const handleDelete = async () => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);
    
    try {
      // Send delete request with user info
      await API.delete(`/tasks/${task._id}`, {
        data: {
          deletedBy: {
            _id: user._id,
            name: user.name,
            email: user.email
          }
        }
      });
      
      // Emit socket event with user info
      socket.emit("taskDeleted", {
        taskId: task._id,
        deletedBy: user
      });
      
      toast.success(`Task KAN-${task.taskNumber || task._id.slice(-4)} deleted by ${user.name}`);
      onDelete();
      
      setAnimateIn(false);
      setTimeout(() => {
        onClose();
      }, 200);
      
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      
      if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your connection.");
      } else if (error.response?.status === 404) {
        toast.error("Task already deleted or not found.");
        onDelete();
        setAnimateIn(false);
        setTimeout(() => {
          onClose();
        }, 200);
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again.");
      } else {
        toast.error(error.response?.data?.msg || "Failed to delete task");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className={`delete-modal-overlay ${animateIn ? 'show' : ''}`} onClick={handleClose}>
      <div className={`delete-modal-container ${animateIn ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="delete-modal-header">
          <div className="warning-icon">
            <WarningIcon />
          </div>
          <button className="modal-close-btn" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="delete-modal-body">
          <h3>Delete Task</h3>
          <p>Are you sure you want to delete this task?</p>
          
          <div className="task-preview">
            <span className="task-id">KAN-{task.taskNumber || task._id.slice(-4)}</span>
            <span className="task-title-preview">{task.title}</span>
          </div>

          {/* {task.createdBy && (
            <div className="task-creator-info delete">
              <PersonIcon />
              <span>Created by: {task.createdBy.name}</span>
            </div>
          )} */}
          
          {/* <p className="warning-text">This action cannot be undone.</p> */}
          
          {/* <div className="current-user-delete">
            <PersonIcon />
            <span>Deleting as: {user?.name}</span>
          </div> */}
        </div>

        <div className="delete-modal-footer">
          <button className="cancel-btn" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner-small"></span>
            ) : (
              <>
                <DeleteIcon /> Delete Task
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}