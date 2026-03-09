// types/socket.ts (create this file)
export interface User {
  _id: string;
  name: string;
  email: string;
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
  createdBy?: User;
  updatedBy?: User;
  assignedTo?: User[];
  comments?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskEditingData {
  taskId: string;
  user: User;
}

export interface TaskEditBlockedData {
  taskId: string;
  message: string;
}

export interface TaskEditStoppedData {
  taskId: string;
  user: {
    _id: string;
    name: string;
  };
}

export interface TaskMovedData {
  task: Task;
  movedBy: User;
}

export interface TaskDeletedData {
  taskId: string;
  deletedBy: User;
}