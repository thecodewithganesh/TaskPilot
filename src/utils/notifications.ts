export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export function showNotification(title: string, body: string) {
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icon-192.png",
  });
}