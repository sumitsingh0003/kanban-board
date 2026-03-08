"use client";

import { useEffect,useState } from "react";
import API from "../../../services/api";

type User = {
  name: string;
  email: string;
  phone?: string;
};

export default function Profile(){

 const [user,setUser] = useState<User | null>(null);

 useEffect(()=>{

  const fetchUser = async()=>{
    const res = await API.get("/users/69ac71d1b70f0b91258260c8");
    setUser(res.data.data);
  };

  fetchUser();

 },[]);

 if(!user) return <p>Loading...</p>;

 return(

  <div className="bg-white p-6 rounded shadow w-[400px]">

   <h2 className="text-lg font-bold mb-4">Profile</h2>

   <p>Name: {user.name}</p>
   <p>Email: {user.email}</p>
   <p>Phone: {user.phone}</p>

  </div>

 );

}