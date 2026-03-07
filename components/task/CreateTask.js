"use client";

import { useState } from "react";
import { createTask } from "../../services/api";
import { FiPlus } from "react-icons/fi";

export default function CreateTask({ reload }) {

  const [title, setTitle] = useState("");
  const handleCreate = async () => {
    if (!title) return;
    await createTask(title);
    setTitle("");
    reload();
  };

  return (
    <div className="create-task flex-shrink-0">
      {/* <input
        value={title}
        placeholder="Create a new task..."
        onChange={(e) => setTitle(e.target.value)}
      />

      <button onClick={handleCreate}>
        Add
      </button> */}
      <div className="cerate-task-button">
        <FiPlus /> Create
      </div>
    </div>
  );

}