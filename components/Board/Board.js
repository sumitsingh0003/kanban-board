"use client";

import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import CreateTask from "../task/CreateTask";

import { getTasks, moveTask } from "../../services/api";
import { socket } from "../../services/socket";

export default function Board() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {

    setMounted(true);
    loadTasks();

    socket.on("updateTask", (task) => {
      setTasks(prev =>
        prev.map(t => t._id === task._id ? task : t)
      );
    });

    return () => {
      socket.off("updateTask");
    };

  }, []);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
    setLoading(false);
  };

  const onDragEnd = async (result) => {

    const { source, destination } = result;

    if (!destination) return;

    const columnTasks = tasks
      .filter(t => t.status === source.droppableId)
      .sort((a, b) => a.order - b.order);

    const task = columnTasks[source.index];

    try {

      const res = await moveTask(task._id, {
        status: destination.droppableId,
        order: destination.index,
        version: task.version,
        user: "Sumit"
      });

      socket.emit("taskMoved", res.data);

      loadTasks();

    } catch (err) {

      if (err.response?.status === 409) {
        alert("Task updated by another user");
        loadTasks();
      }

    }

  };

  if (loading) return <p>Loading board...</p>;
  if (!mounted) return null;

  return (

    <div className="task-body-sections h-screen flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 overflow-hidden">
          <div className="px-2 shadow task-columns-main-cntainer flex flex-col">
            <Column status="todo" tasks={tasks} />
            <CreateTask reload={loadTasks} />
          </div>
          <div className="px-2 shadow task-columns-main-cntainer flex flex-col">
            <Column status="inprogress" tasks={tasks} />
          </div>
          <div className="px-2 shadow task-columns-main-cntainer flex flex-col">
            <Column status="done" tasks={tasks} />
          </div>
          <div className="px-2 shadow task-columns-main-cntainer flex flex-col">
            <Column status="deployedonprod" tasks={tasks} />
          </div>
        </div>
      </DragDropContext>
    </div>

  );

}