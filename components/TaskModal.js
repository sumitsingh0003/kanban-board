"use client";

import { useState } from "react";
import axios from "axios";

export default function TaskModal({close,refresh,socket}){

 const [form,setForm] = useState({
  title:"",
  description:"",
  priority:"medium",
  dueDate:""
 });

 const handleSubmit = async()=>{

  const res = await axios.post("http://localhost:5000/tasks",form);

  socket.emit("taskCreated",res.data);

  refresh();

  close();

 }

 return(

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

   <div className="bg-white p-6 rounded w-[400px]">

    <h2 className="text-lg font-semibold mb-4">Create Task</h2>

    <input
     placeholder="Title"
     className="border p-2 w-full mb-3"
     onChange={e=>setForm({...form,title:e.target.value})}
    />

    <textarea
     placeholder="Description"
     className="border p-2 w-full mb-3"
     onChange={e=>setForm({...form,description:e.target.value})}
    />

    <select
     className="border p-2 w-full mb-3"
     onChange={e=>setForm({...form,priority:e.target.value})}
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <input
     type="date"
     className="border p-2 w-full mb-4"
     onChange={e=>setForm({...form,dueDate:e.target.value})}
    />

    <button
     onClick={handleSubmit}
     className="bg-blue-600 text-white px-4 py-2 rounded"
    >
     Create
    </button>

   </div>

  </div>

 )

}