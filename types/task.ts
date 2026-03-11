
export * from './index';

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