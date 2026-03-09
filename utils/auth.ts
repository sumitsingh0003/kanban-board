import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

const isBrowser = typeof window !== "undefined";

export const setToken = (token: string): void => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(TOKEN_KEY, token, { expires: 7 });
  } catch (error) {
    console.error("setToken error:", error);
  }
};

export const getToken = (): string | null => {
  if (!isBrowser) return null;

  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("getToken error:", error);
    return null;
  }
};

export const removeToken = (): void => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY);
  } catch (error) {
    console.error("removeToken error:", error);
  }
};

export const setUser = (user: User): void => {
  if (!isBrowser) return;

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("setUser error:", error);
  }
};

export const getUser = (): User | null => {
  if (!isBrowser) return null;

  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("getUser error:", error);
    return null;
  }
};

export const removeUser = (): void => {
  if (!isBrowser) return;

  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("removeUser error:", error);
  }
};

export const logout = (): void => {
  removeToken();
  removeUser();
};