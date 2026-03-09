
"use client";

import { useState } from "react";
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

interface TaskCardProps {
  task: any;
  index: number;
  isDragging?: boolean;
  status: any;
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
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
            }`}
            style={{
              ...provided.draggableProps.style,
              transform: snapshot.isDragging 
                ? provided.draggableProps.style?.transform 
                : 'none'
            }}
          >
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
                KAN-{task.taskNumber || task._id.slice(-4)} <LucideEye />
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
                      <button onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}>
                        <FiEdit2 /> Edit
                      </button>
                      <button 
                        className="delete-option"
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
                      {task?.createdBy?.name.charAt(0).toUpperCase()}
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
                {task.comments?.length || 0}
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
            setShowDetailsModal(false);
            setShowEditModal(true);
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