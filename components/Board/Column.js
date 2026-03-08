"use client";

import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { FiCheck } from "react-icons/fi";
import AnimatedCounter from "../AnimatedCounter";

export default function Column({ status, tasks }) {

  const filtered = tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className="column flex flex-col h-full"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >

          {/* Title (fixed) */}
          <div className="column-title flex-shrink-0">
            {status === "todo" && "To Do"}
            {status === "inprogress" && "In Progress"}
            {status === "done" && "Done"}
            {status === "deployedonprod" && "Deployed On Prod"}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 overflow-hidden task-length-value-box"> <AnimatedCounter value={filtered?.length || 0} /> Of <AnimatedCounter value={tasks?.length || 0} /> </div>
              {status === "done" && <FiCheck />}
            </div>
          </div>

          {/* Scrollable task container */}
          <div className="tasks-man-box-container flex-1 overflow-y-auto">
            {filtered.map((task, index) => (
              <TaskCard key={task._id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}