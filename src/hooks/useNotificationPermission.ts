// useNotificationPermission.ts
import { useEffect } from "react";

export function useNotificationPermission() {
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);
}