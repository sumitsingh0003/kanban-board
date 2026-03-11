// components/Board/Board.tsx
"use client";

import React, { useEffect, useState, useRef } from "react"; 
import { DragDropContext, Droppable, DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import { getTasks, moveTask } from "../../services/api";
import { socket } from "../../services/socket";
import { 
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  Clear as ClearIcon
} from "@mui/icons-material";
import TaskModal from "../task/TaskModal";
import toast from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import { LucideFilter } from "lucide-react";
import { socketService } from "../../services/socketService";


// Define types
interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status: string;
  taskNumber?: string;
  order?: number;
  version?: number;
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
  assignedTo?: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  comments?: any[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface ColumnType {
  id: string;
  title: string;
  color: string;
}

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [uniqueUsers, setUniqueUsers] = useState<User[]>([]);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();
  const searchInputRef = useRef<HTMLInputElement>(null);

 
  // Inside Board.tsx, update the useEffect for socket listeners
useEffect(() => {
  loadTasks();

  // ✅ Task Created
  socketService.on("taskAdded", (data: any) => {
    console.log("📥 taskAdded received:", data);
    const task = data?.task || data;
    if (task?._id) {
      setTasks(prev => {
        // Check if task already exists
        if (prev.some(t => t._id === task._id)) {
          return prev;
        }
        // Add new task at the beginning (newest first)
        return [task, ...prev];
      });
      
      // Show notification
      toast.success(`New task created: ${task.title}`, {
        icon: '✨',
        duration: 3000
      });
    }
  });

  // ✅ Task Updated
  socketService.on("taskUpdated", (data: any) => {
    console.log("📥 taskUpdated received:", data);
    const task = data?.task || data;
    if (task?._id) {
      setTasks(prev =>
        prev.map(t => t._id === task._id ? task : t)
      );
      
      toast.success(`Task updated: ${task.title}`, {
        icon: '✏️',
        duration: 2000
      });
    }
  });

  // ✅ Task Moved
  socketService.on("taskMoved", (data: any) => {
    console.log("📥 taskMoved received:", data);
    const task = data?.task || data;
    if (task?._id) {
      setTasks(prev => {
        // Remove old task and add updated one
        const filtered = prev.filter(t => t._id !== task._id);
        return [...filtered, task];
      });
    }
  });

  // ✅ Task Deleted
  socketService.on("taskDeleted", (data: any) => {
    console.log("📥 taskDeleted received:", data);
    const taskId = data?.taskId || data;
    if (taskId) {
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success("Task deleted", { icon: '🗑️', duration: 2000 });
    }
  });

  return () => {
    socketService.off("taskAdded");
    socketService.off("taskUpdated");
    socketService.off("taskMoved");
    socketService.off("taskDeleted");
  };
}, []);


  useEffect(() => {
    applyFilters();
  }, [tasks, searchTerm, selectedPriority, selectedUser, filter]);

  useEffect(() => {
    // Extract unique users from tasks
    const usersMap = new Map<string, User>();
    tasks.forEach(task => {
      if (task.createdBy) {
        usersMap.set(task.createdBy._id, {
          _id: task.createdBy._id,
          name: task.createdBy.name,
          email: task.createdBy.email
        });
      }
      if (task.updatedBy) {
        usersMap.set(task.updatedBy._id, {
          _id: task.updatedBy._id,
          name: task.updatedBy.name,
          email: task.updatedBy.email
        });
      }
      if (task.assignedTo) {
        task.assignedTo.forEach(assignee => {
          usersMap.set(assignee._id, {
            _id: assignee._id,
            name: assignee.name,
            email: assignee.email
          });
        });
      }
    });
    setUniqueUsers(Array.from(usersMap.values()));
  }, [tasks]);

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

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply status filter
    if (filter !== 'all') {
      if (filter === 'dueToday') {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(task => task.dueDate === today);
      } else if (filter === 'assigned' && user) {
        filtered = filtered.filter(task => 
          task.assignedTo?.some(a => a._id === user._id)
        );
      } else if (filter === 'created' && user) {
        filtered = filtered.filter(task => 
          task.createdBy?._id === user._id
        );
      }
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    // Apply user filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter(task => 
        task.createdBy?._id === selectedUser || 
        task.updatedBy?._id === selectedUser ||
        task.assignedTo?.some((a: User) => a._id === selectedUser)
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(task => {
        const taskNumber = `KAN-${task.taskNumber || task._id.slice(-4)}`.toLowerCase();
        const title = task.title.toLowerCase();
        const description = task.description?.toLowerCase() || '';
        const kanId = task._id.toLowerCase();
        
        return taskNumber.includes(term) || 
               title.includes(term) || 
               description.includes(term) ||
               kanId.includes(term);
      });
    }

    setFilteredTasks(filtered);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim() || !text) return text;
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? 
        React.createElement('span', { key: i, className: "search-highlight" }, part) : 
        part
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPriority('all');
    setSelectedUser('all');
    setFilter('all');
  };

  const onDragStart = (start: DragStart) => {
    setDraggingId(start.draggableId);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    setDraggingId(null);

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskToMove = tasks.find(t => t._id === draggableId);
    
    if (!taskToMove || !user) return;

    // Optimistic update
    const updatedTasks = tasks.map(t => {
      if (t._id === draggableId) {
        return {
          ...t,
          status: destination.droppableId,
          order: destination.index,
          updatedBy: user
        };
      }
      return t;
    });

    const columns = ['todo', 'inprogress', 'done', 'deployedonprod'];
    const reorderedTasks: Task[] = [];

    columns.forEach(col => {
      const colTasks = updatedTasks
        .filter(t => t.status === col)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      
      colTasks.forEach((task, idx) => {
        reorderedTasks.push({
          ...task,
          order: idx
        });
      });
    });

    setTasks(reorderedTasks);

    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    try {
      const res = await moveTask(draggableId, {
        status: destination.droppableId,
        order: destination.index,
        user: user
      });

      socketService.emit("taskMoved", {
        task: res.data,
        movedBy: user
      });


    } catch (err: any) {
      setTasks(tasks);
      
      if (err.response?.status === 409) {
        toast.error("Task was updated by another user. Loading latest...");
        loadTasks();
      } else {
        toast.error("Failed to move task");
      }
    }
  };

  const columns: ColumnType[] = [
    { id: 'todo', title: 'To Do', color: '#f59e0b' },
    { id: 'inprogress', title: 'In Progress', color: '#3b82f6' },
    { id: 'done', title: 'Done', color: '#10b981' },
    { id: 'deployedonprod', title: 'Deployed', color: '#8b5cf6' }
  ];

  if (loading) {
    return (
      <div className="board-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="board-container">
      {/* Enhanced Board Header */}
      <div className="board-header-enhanced">
        <div className="header-left">
          <div className="header-title">
            <h2>Task Board</h2>
            <span className="task-count-badge">
              {filteredTasks.length} Tasks
            </span>
          </div>
          <p className="header-description">
            Drag and drop tasks to update status • {tasks.length} total tasks
          </p>
        </div>

        <div className="header-right">
          <button 
            className="create-task-btn-enhanced"
            onClick={() => setShowFilterBar(!showFilterBar)}
          >
            <LucideFilter /> Filter By
          </button>

          <button 
            className="create-task-btn-enhanced"
            onClick={() => setShowCreateModal(true)}
          >
            <AddIcon /> New Task
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      {showFilterBar && 
        <div className="filters-bar">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <SearchIcon className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search by title, description, or KAN ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                <CloseIcon />
              </button>
            )}
          </div>

          {/* Active Filters Tags */}
          {(searchTerm || selectedPriority !== 'all' || selectedUser !== 'all' || filter !== 'all') && (
            <div className="active-filters">
              {searchTerm && (
                <span className="filter-tag">
                  Search: "{searchTerm}" <CloseIcon onClick={clearSearch} />
                </span>
              )}
              {selectedPriority !== 'all' && (
                <span className="filter-tag priority">
                  Priority: {selectedPriority} <CloseIcon onClick={() => setSelectedPriority('all')} />
                </span>
              )}
              {selectedUser !== 'all' && (
                <span className="filter-tag user">
                  User: {uniqueUsers.find(u => u._id === selectedUser)?.name} 
                  <CloseIcon onClick={() => setSelectedUser('all')} />
                </span>
              )}
              {filter !== 'all' && (
                <span className="filter-tag">
                  Filter: {filter} <CloseIcon onClick={() => setFilter('all')} />
                </span>
              )}
            </div>
          )}

          {/* Results Info */}
          {filteredTasks.length !== tasks.length && (
            <div className="results-info">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          )}


          {/* Priority Filter */}
          <div className="filter-dropdown">
            <FlagIcon className="filter-icon" />
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* User Filter */}
          <div className="filter-dropdown">
            <PersonIcon className="filter-icon" />
            <select 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter */}
          <div className="filter-dropdown">
            <FilterIcon className="filter-icon" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              <option value="dueToday">Due Today</option>
              <option value="assigned">Assigned to me</option>
              <option value="created">Created by me</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedPriority !== 'all' || selectedUser !== 'all' || filter !== 'all') && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              <ClearIcon /> Clear Filters
            </button>
          )}
        </div>
      }
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="columns-container">
          {columns.map(col => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`column-wrapper ${
                    snapshot.isDraggingOver ? 'dragging-over' : ''
                  }`}
                >
                  <Column
                    status={col.id}
                    title={col.title}
                    color={col.color}
                    tasks={filteredTasks}
                    draggingId={draggingId}
                    onTaskUpdate={loadTasks}
                    searchTerm={searchTerm}
                    highlightText={highlightText}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      {showCreateModal && (
        <TaskModal
          close={() => setShowCreateModal(false)}
          refresh={loadTasks}
          socket={socket}
          isEdit={false}
        />
      )}
    </div>
  );
}