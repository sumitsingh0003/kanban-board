"use client";

import Link from "next/link";
import { logout } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();
    const handleLogout = () => {
        logout();
        router.push("/login");
    };
    return (

        <div className="w-64 bg-white shadow p-4">
            <h2 className="font-bold mb-6">Kanban Board</h2>
            <ul className="space-y-3">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/dashboard/tasks">Tasks</Link></li>
                <li><Link href="/dashboard/analytics">Analytics</Link></li>
                <li><Link href="/dashboard/profile">Profile</Link></li>
            </ul>
            <button
                onClick={handleLogout}
                className="mt-6 text-red-500"
            >
                Logout
            </button>

        </div>

    );

}