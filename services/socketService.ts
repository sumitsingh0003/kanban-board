// frontend/services/socketService.ts
import { getToken } from "../utils/auth";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

// Define types inline
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

interface TaskEditingData {
  taskId: string;
  user: User;
}

interface TaskEditBlockedData {
  taskId: string;
  message: string;
  editor?: { userId: string; userName: string };
}

interface TaskEditStoppedData {
  taskId: string;
  user: {
    _id: string;
    name: string;
  };
  reason?: string;
  timestamp?: string;
}

interface TaskMovedData {
  task: Task;
  movedBy: User;
  timestamp?: string;
}

interface TaskDeletedData {
  taskId: string;
  deletedBy: User;
  timestamp?: string;
}

class SocketServiceClass {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private listeners: Map<string, Function[]> = new Map();

  connect(userId?: string): void {
    if (this.socket?.connected) return;

    try {
      this.socket = io("https://kanban-board-api-zsyw.onrender.com", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectTimeout,
        timeout: 10000,
        auth: {
          token: getToken()
        }
      }) as Socket;

      if (!this.socket) return;

      this.socket.on("connect", () => {
        console.log("🟢 Socket connected:", this.socket?.id);
        this.reconnectAttempts = 0;
        
        if (userId) {
          this.socket?.emit("userConnected", { _id: userId });
        }
      });

      this.socket.on("disconnect", (reason: string) => {
        console.log("🔴 Socket disconnected:", reason);
        
        if (reason === "io server disconnect") {
          this.socket?.connect();
        }
      });

      this.socket.on("reconnect_attempt", (attempt: number) => {
        this.reconnectAttempts = attempt;
        console.log(`🔄 Reconnect attempt ${attempt}/${this.maxReconnectAttempts}`);
      });

      this.socket.on("reconnect_failed", () => {
        console.error("❌ Reconnection failed");
        toast.error("Real-time connection lost. Please refresh.", {
          icon: '⚠️',
          duration: 5000
        });
      });

      this.socket.on("error", (error: Error) => {
        console.error("Socket error:", error);
      });

      this.setupListeners();

    } catch (error) {
      console.error("Failed to connect socket:", error);
    }
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on("taskEditingStarted", (data: TaskEditingData) => {
      console.log("📥 taskEditingStarted received:", data);
      this.emitToListeners("taskEditingStarted", data);
    });

    this.socket.on("taskEditingStopped", (data: TaskEditStoppedData) => {
      console.log("📥 taskEditingStopped received:", data);
      this.emitToListeners("taskEditingStopped", data);
    });

    this.socket.on("taskEditBlocked", (data: TaskEditBlockedData) => {
      console.log("📥 taskEditBlocked received:", data);
      toast.error(data.message, {
        icon: '🔒',
        duration: 3000
      });
      this.emitToListeners("taskEditBlocked", data);
    });

    this.socket.on("taskUpdated", (data: any) => {
      console.log("📥 taskUpdated received:", data);
      this.emitToListeners("taskUpdated", data);
    });

    this.socket.on("taskMoved", (data: TaskMovedData) => {
      console.log("📥 taskMoved received:", data);
      this.emitToListeners("taskMoved", data);
    });

    this.socket.on("taskAdded", (data: any) => {
      console.log("📥 taskAdded received:", data);
      this.emitToListeners("taskAdded", data);
    });

    this.socket.on("taskDeleted", (data: TaskDeletedData) => {
      console.log("📥 taskDeleted received:", data);
      this.emitToListeners("taskDeleted", data);
    });

    this.socket.on("connect_error", (error: Error) => {
      console.error("Connection error:", error);
    });
  }

  private emitToListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    
    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function): void {
    if (callback) {
      const listeners = this.listeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
      
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.removeAllListeners(event);
      }
    }
  }

  emit(event: string, data: any): void {
    console.log(`📤 Emitting ${event}:`, data);
    if (!this.socket?.connected) {
      console.warn("Socket not connected, attempting to reconnect...");
      this.connect();
      
      setTimeout(() => {
        if (this.socket?.connected) {
          this.socket.emit(event, data);
        }
      }, 1000);
      return;
    }

    try {
      this.socket.emit(event, data);
    } catch (error) {
      console.error(`Error emitting ${event}:`, error);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
export const socketService = new SocketServiceClass();
