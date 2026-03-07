import { useEffect, useState } from "react";
import { getTasks } from "../services/api";

export default function useTasks(){

 const [tasks,setTasks] = useState([]);

 const loadTasks = async()=>{
  const res = await getTasks();
  setTasks(res.data);
 }

 useEffect(()=>{
  loadTasks();
 },[])

 return {tasks,setTasks,loadTasks}

}