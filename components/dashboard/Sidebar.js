"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../../utils/auth";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { getCurrentUser } from "../../services/userApi";
import { useUser } from "@/context/UserContext"; 
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUserState } = useUser(); 
  const [collapsed, setCollapsed] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

useEffect(() => {
    const fetchUserData = async () => {
      // Agar user already hai to fetch mat karo
      if (user) return;
      
      setLoadingUser(true);
      try {
        const response = await getCurrentUser();
        if (response.data?.success && response.data?.data) {
          setUserState(response.data.data); // ✅ Use setUserState
        } else {
          toast.error("Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, [user, setUserState]);
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    router.push("/login");
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white shadow-xl z-50
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? mobileOpen 
              ? 'translate-x-0' 
              : '-translate-x-full'
            : collapsed 
              ? 'w-20' 
              : 'w-64'
          }
        `}
      >
        {/* Sidebar Header with Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-xl text-gray-800 hover:text-indigo-600 transition-colors"
            onClick={closeMobileSidebar}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">K</span>
            </div>
            {!collapsed && !isMobile && <span>Kanban</span>}
          </Link>

          {/* Collapse Button (Desktop only) */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col h-[calc(100%-4rem)]">
          <ul className="flex-1 py-6 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileSidebar}
                    className={`
                      flex items-center mx-2 px-3 py-3 rounded-lg
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                      }
                      ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}
                    `}
                    title={collapsed && !isMobile ? item.label : undefined}
                  >
                    <Icon 
                      size={20} 
                      className={`
                        transition-transform group-hover:scale-110
                        ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}
                      `} 
                    />
                    {(!collapsed || isMobile) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    
                    {/* Active Indicator */}
                    {isActive && !collapsed && !isMobile && (
                      <span className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout Button at Bottom */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogoutClick}
              className={`
                flex items-center w-full px-3 py-3 rounded-lg
                text-red-500 hover:bg-red-50 transition-all duration-200 group
                ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}
              `}
              title={collapsed && !isMobile ? "Logout" : undefined}
            >
              <LogOut 
                size={20} 
                className="transition-transform group-hover:scale-110 group-hover:rotate-12" 
              />
              {(!collapsed || isMobile) && (
                <span className="font-medium">Logout</span>
              )}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Spacer */}
      <div 
        className={`
          transition-all duration-300
          ${!isMobile && (collapsed ? 'ml-20' : 'ml-64')}
        `} 
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}