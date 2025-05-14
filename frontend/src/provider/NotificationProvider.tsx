import React, { createContext, useContext, useState, ReactNode } from "react";
import { NotificationContextType, Notification } from "../types";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: Notification["type"] = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000); // auto dismiss after 3s
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded px-4 py-2 text-white shadow-lg ${
              n.type === "success"
                ? "bg-green-600"
                : n.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
