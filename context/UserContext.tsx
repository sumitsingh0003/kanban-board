"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/userApi";
import { getToken, setUser as setUserStorage, getUser as getUserStorage, removeUser} from "@/utils/auth";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  updateUserData: (data: Partial<User>) => void;
  setUserState: (user: User | null) => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setUserState = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      setUserStorage(newUser);
    } else {
      removeUser();
    }
  };

  const fetchUser = async () => {
    const token = getToken();
    
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getCurrentUser();
      
      if (response.data?.success && response.data?.data) {
        setUser(response.data.data);
        setUserStorage(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error("Failed to fetch user:", err);
      setError(err.response?.data?.msg || "Failed to load user data");
      
      const storedUser = getUserStorage();
      if (storedUser) {
        setUser(storedUser);
      }
      
      if (!loading) {
        toast.error("Failed to refresh user data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    removeUser();  // ✅ removeUser ab kaam karega
  };

  const updateUserData = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      setUserStorage(updated);
      return updated;
    });
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const newUser = JSON.parse(e.newValue);
          setUser(newUser);
        } catch (error) {
          console.error("Error parsing user from storage:", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      refreshUser, 
      clearUser,
      updateUserData ,
      setUserState
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}