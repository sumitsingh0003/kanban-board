"use client";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { socketService } from "@/services/socketService";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({children} : { children: React.ReactNode }){
  const { user } = useUser();
    // Connect socket when user is available
  useEffect(() => {
    if (user?._id) {
      socketService.connect(user._id);
    }

    return () => {
      socketService.disconnect();
    };
  }, [user?._id]);
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );
}