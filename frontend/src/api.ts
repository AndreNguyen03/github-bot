import { User } from "./types";

// frontend/src/api.ts
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("http://localhost:3001/api/user", {
    credentials: "include", // Quan trọng: để gửi session cookie
  });
  if (!res.ok) {
    return null;
  }
  const data = res.json();
  return data;
}

export function loginWithGitHub() {
  window.location.href = "http://localhost:3001/auth/github";
}

export async function logOut(): Promise<string> {
  const res = await fetch("http://localhost:3001/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  const data = res.json();
  return data;
}
