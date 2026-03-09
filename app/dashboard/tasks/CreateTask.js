"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import TaskModal from "../../../components/task/TaskModal";
import { socket } from "../../../services/socket";

export default function CreateTask({ reload }) {

  const [open,setOpen] = useState(false);

  return (
    <div className="create-task flex-shrink-0">

      <div
        className="cerate-task-button"
        onClick={()=>setOpen(true)}
      >
        <FiPlus /> Create
      </div>

      {open && (
        <TaskModal
          close={()=>setOpen(false)}
          refresh={reload}
          socket={socket}
        />
      )}

    </div>
  );

}