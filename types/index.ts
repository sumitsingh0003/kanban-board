
export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface EditHistory {
  updatedBy: User;
  changes: Record<string, { old: any; new: any }>;
  timestamp: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  status: string;
  taskNumber?: string;
  order?: number;
  version?: number;
  active_status: number;
  createdBy: User;
  updatedBy?: User;
  assignedTo: User[];
  editHistory: EditHistory[];
  comments?: any[];
  createdAt: string;
  updatedAt: string;
}

// Socket event types
export interface TaskEditingData {
  taskId: string;
  user: User;
}

export interface TaskEditBlockedData {
  taskId: string;
  message: string;
  editor?: { userId: string; userName: string };
}

export interface TaskEditStoppedData {
  taskId: string;
  user: {
    _id: string;
    name: string;
  };
  reason?: string;
  timestamp?: string;
}

export interface TaskMovedData {
  task: Task;
  movedBy: User;
  timestamp?: string;
}

export interface TaskDeletedData {
  taskId: string;
  deletedBy: User;
  timestamp?: string;
}