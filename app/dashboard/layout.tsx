"use client";
 import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({children} : { children: React.ReactNode }){

 return(

  <div className="flex min-h-screen">

    <Sidebar />

    <div className="flex-1 p-6 bg-gray-100">

      {children}

    </div>

  </div>

 );

}