"use client";

import { Draggable } from "@hello-pangea/dnd";
export default function TaskCard({ task, index }) {
  return (

    <Draggable
      draggableId={task._id}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            // padding: 12,
            // background: "white",
            // borderRadius: 5,
            // marginBottom: 10,
            // color:"#000",
            ...provided.draggableProps.style
          }}
          className="task-card"
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
}