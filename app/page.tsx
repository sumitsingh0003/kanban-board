"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { LayoutDashboard, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IoHomeOutline } from "react-icons/io5";
import { FaTasks } from "react-icons/fa";
import { LuSettings } from "react-icons/lu";

const Board = dynamic(() => import("../components/board/Board"), { ssr: false });

export default function Home() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="main-container-dashboard">
            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <div className={`bg-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`} >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3">
                        {/* Left: Icon + Title */}
                        <div className="flex items-center gap-2">
                            {!collapsed && (<>
                            <LayoutDashboard className="w-5 h-5" />
                                <span className="font-semibold text-gray-700">
                                    Kanban Board
                                </span>
                            </>
                            )}
                        </div>
                        
                        {/* Toggle Button */}
                        <button onClick={() => setCollapsed(!collapsed)}
                            className="p-2 rounded hover:bg-gray-100 cursor-pointer">
                            {collapsed ? (
                                <PanelLeftOpen size={18} />
                            ) : (
                                <PanelLeftClose size={18} />
                            )}
                        </button>
                    </div>
                    <div className="col-span-12 md:col-span-2 bg-white rounded-lg shadow p-4">
                        <ul className="space-y-2 text-sm">
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                {!collapsed ? (<><IoHomeOutline className="w-5 h-5"/> Dashboard</>) : <IoHomeOutline className="w-5 h-5"/>}
                            </li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                {!collapsed ? (<><FaTasks className="w-5 h-5"/> Tasks</>) : <FaTasks className="w-5 h-5"/>}
                            </li>
                            <li className="p-2 hover:bg-gray-100 rounded cursor-pointer flex items-center gap-2">
                                {!collapsed ? (<><LuSettings className="w-5 h-5"/> Settings</>) : <LuSettings className="w-5 h-5"/>}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content (10 columns) */}
                <div className="flex-1 px-2 col-span-12 md:col-span-10">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                        <h1 className="text-xl font-semibold">
                            🚀 Real Time Kanban Board
                        </h1>
                    </div>
                    <Board />
                </div>
            </div>
        </div>
    );

}