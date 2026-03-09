// components/Board/TaskCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { 
  FiMoreVertical,
  FiClock,
  FiFlag,
  FiMessageSquare,
  FiEdit2,
  FiTrash2
} from "react-icons/fi";
import { LucideEye } from "lucide-react";
import TaskModal from "../task/TaskModal";
import { socket } from "../../services/socket";
import DeleteConfirmModal from "../task/DeleteConfirmModal";
import TaskDetailsModal from "../task/TaskDetailsModal";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";

// Types
interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status: string;
  taskNumber?: string;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
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

interface TaskCardProps {
  task: Task;
  index: number;
  isDragging?: boolean;
  status: string;
  onTaskUpdate: () => void;
  searchTerm?: string;
  highlightText?: (text: string, term: string) => React.ReactNode;
}

export default function TaskCard({ 
  task, 
  index, 
  status, 
  isDragging, 
  onTaskUpdate,
  searchTerm = '',
  highlightText 
}: TaskCardProps) {
  const { user } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [editorName, setEditorName] = useState('');

  // Listen for edit events
  useEffect(() => {
    if (!task?._id) return;

    const handleEditingStarted = (data: TaskEditingData) => {
      if (data.taskId === task._id && data.user._id !== user?._id) {
        setIsBeingEdited(true);
        setEditorName(data.user.name);
        // ✅ Fixed: Use toast.success with custom icon instead of toast.info
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
        // ✅ Fixed: Use toast.success with custom icon
        toast.success('Task is now available for editing', {
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

  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const renderHighlightedText = (text: string) => {
    if (!searchTerm || !highlightText || !text) return text;
    return highlightText(text, searchTerm);
  };

  const handleEditClick = () => {
    if (isBeingEdited) {
      // ✅ Fixed: Use toast.error for error message
      toast.error(`Task is being edited by ${editorName}`, {
        duration: 3000,
        icon: '🔒',
        style: {
          background: '#ef4444',
          color: 'white',
        }
      });
      return;
    }
    setShowEditModal(true);
    setShowMenu(false);
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`task-card ${snapshot.isDragging ? 'dragging' : ''} ${
              isDragging ? 'dragging-other' : ''
            } ${isBeingEdited ? 'being-edited' : ''}`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging 
                ? provided.draggableProps.style?.transform 
                : 'none'
            }}
          >
            {/* Edit indicator */}
            {isBeingEdited && (
              <div className="editing-indicator">
                <span className="editing-text">✏️ {editorName} is editing...</span>
              </div>
            )}

            <div className="task-id">
              <span 
                style={{
                  textDecoration: (status === 'done' || status === 'deployedonprod') ? 'line-through' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={() => setShowDetailsModal(true)}
              >
                KAN-{task.taskNumber || task._id.slice(-4)} <LucideEye size={16} />
              </span>
              <div className="task-header-right-part">
                <div className="task-actions">
                  <button 
                    className="task-menu-btn"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <FiMoreVertical />
                  </button>
                  {showMenu && (
                    <div className="task-menu-dropdown">
                      <button 
                        onClick={handleEditClick}
                        className={isBeingEdited ? 'disabled-option' : ''}
                        disabled={isBeingEdited}
                      >
                        <FiEdit2 /> 
                        {isBeingEdited ? 'Being Edited...' : 'Edit'}
                      </button>
                      <button 
                        className={`${isBeingEdited ? 'disabled-option' : ''} delete-option`}
                        disabled={isBeingEdited}
                        onClick={() => {
                          setShowDeleteModal(true);
                          setShowMenu(false);
                        }}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
                {task.createdBy && (
                  <div className="task-creator">
                    <span title={`Created by: ${task.createdBy.name} (${task.createdBy.email})`}>
                      {task.createdBy.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="task-title">
              {renderHighlightedText(task.title)}
            </div>

            {task.description && (
              <div className="task-description">
                {renderHighlightedText(stripHtml(task.description).substring(0, 60))}
                {stripHtml(task.description).length > 60 && '...'}
              </div>
            )}

            <div className="task-meta">
              {task.priority && (
                <div 
                  className="priority-badge"
                  style={{ 
                    background: `${getPriorityColor(task.priority)}15`,
                    color: getPriorityColor(task.priority)
                  }}
                >
                  <FiFlag size={12} />
                  {getPriorityLabel(task.priority)}
                </div>
              )}

              {task.dueDate && (
                <div className="due-date">
                  <FiClock size={12} />
                  {new Date(task.dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
              )}

              <div className="comments-count">
                <FiMessageSquare size={12} />
                0
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {/* Modals */}
      {showEditModal && (
        <TaskModal
          close={() => setShowEditModal(false)}
          refresh={onTaskUpdate}
          socket={socket}
          task={task}
          isEdit={true}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          task={task}
          onClose={() => setShowDeleteModal(false)}
          onDelete={onTaskUpdate}
          socket={socket}
        />
      )}

      {showDetailsModal && (
        <TaskDetailsModal
          task={task}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            if (!isBeingEdited) {
              setShowDetailsModal(false);
              setShowEditModal(true);
            } else {
              toast.error(`Task is being edited by ${editorName}`);
            }
          }}
          onDelete={() => {
            setShowDetailsModal(false);
            setShowDeleteModal(true);
          }}
        />
      )}
    </>
  );
}