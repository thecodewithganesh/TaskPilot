import { requestNotificationPermission } from "../../utils/notifications";

export function NotificationSettings() {
  async function handleEnableNotifications() {
    const granted = await requestNotificationPermission();

    if (granted) {
      alert("✅ Notifications enabled!");
    } else {
      alert("❌ Notification permission denied.");
    }
  }

  return (
    <div className="mb-6 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <h2 className="mb-2 text-xl font-semibold dark:text-white">
        🔔 Notifications
      </h2>

      <p className="mb-4 text-neutral-500 dark:text-neutral-400">
        Enable reminders for your upcoming tasks.
      </p>

      <button
        onClick={handleEnableNotifications}
        className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Enable Notifications
      </button>
    </div>
  );
}