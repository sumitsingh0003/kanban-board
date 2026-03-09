// components/task/CreateTask.tsx
"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { socket } from "../../services/socket";
import TaskModal from "./TaskModal";

interface CreateTaskProps {
  reload: () => void;
}

export default function CreateTask({ reload }: CreateTaskProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="create-task-wrapper">
      <button
        className="create-task-button"
        onClick={() => setOpen(true)}
      >
        <FiPlus /> Create New Task
      </button>

      {open && (
        <TaskModal
          close={() => setOpen(false)}
          refresh={reload}
          socket={socket}
          isEdit={false}
        />
      )}
    </div>
  );
}