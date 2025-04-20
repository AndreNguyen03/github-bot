// frontend/src/api.ts
export async function getCurrentUser() {
  const res = await fetch("http://localhost:3001/api/user", {
    credentials: "include",
  });
  return res.json();
}

export function loginWithGitHub() {
  window.location.href = "http://localhost:3001/auth/github";
}
