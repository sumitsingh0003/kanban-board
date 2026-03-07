"use client";

import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

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