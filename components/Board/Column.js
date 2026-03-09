"use client";

import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { 
  FiCheck, 
  FiClock, 
  FiAlertCircle,
  FiCheckCircle 
} from "react-icons/fi";
import AnimatedCounter from "../AnimatedCounter";

export default function Column({ status, title, color, tasks, draggingId, onTaskUpdate, searchTerm, highlightText }) {
  const filtered = tasks
    .filter((t) => t.status === status)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const getStatusIcon = () => {
    switch(status) {
      case 'todo': return <FiClock style={{ color }} />;
      case 'inprogress': return <FiAlertCircle style={{ color }} />;
      case 'done': return <FiCheck style={{ color }} />;
      case 'deployedonprod': return <FiCheckCircle style={{ color }} />;
      default: return null;
    }
  };

  return (
    <div className="column">
      <div className="column-header" style={{ borderBottomColor: color }}>
        <div className="column-title">
          {getStatusIcon()}
          <span>{title}</span>
        </div>
        <div className="column-stats">
          <div className="task-count" style={{ background: `${color}20`, color }}>
            <AnimatedCounter value={filtered.length} />
          </div>
          <span className="total-count">of {tasks.length}</span>
        </div>
      </div>

      <div className="tasks-container">
        {filtered.map((task, index) => (
          <TaskCard
            key={task._id}
            task={task}
            index={index}
            status={status}
            isDragging={draggingId === task._id}
            onTaskUpdate={onTaskUpdate}
            searchTerm={searchTerm}
            highlightText={highlightText}
          />
        ))}
        
        {filtered.length === 0 && (
          <div className="empty-column">
            <p>No tasks</p>
            <small>Drag tasks here</small>
          </div>
        )}
      </div>
    </div>
  );
}