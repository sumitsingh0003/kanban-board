"use client";

import { Draggable } from "@hello-pangea/dnd";

export default function TaskCard({ task, index }) {

  return (

    <Draggable draggableId={task._id} index={index}>
      {(provided)=>(
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{...provided.draggableProps.style}}
          className="task-card"
        >

          <div className="font-medium">{task.title}</div>

          {task.priority && (
            <div className="text-xs text-gray-500 mt-1">
              Priority: {task.priority}
            </div>
          )}

          {task.dueDate && (
            <div className="text-xs text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}

        </div>
      )}
    </Draggable>

  );

}