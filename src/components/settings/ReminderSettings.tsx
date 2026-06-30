import { useState } from "react";
import {
  getReminderMinutes,
  setReminderMinutes,
} from "../../utils/reminderPreference";

export function ReminderSettings() {
 const [reminderTime, setReminderTime] = useState(
  String(getReminderMinutes())
);

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="mb-2 text-xl font-semibold dark:text-white">
         Reminder Settings
      </h2>

      <p className="mb-4 text-neutral-600 dark:text-neutral-300">
        Choose when TaskPilot should remind you before a task.
      </p>

      <select
        value={reminderTime}
        onChange={(e) => {
  setReminderTime(e.target.value);
  setReminderMinutes(Number(e.target.value));
}}
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
      >
        <option value="5">5 minutes before</option>
        <option value="15">15 minutes before</option>
        <option value="30">30 minutes before</option>
        <option value="60">1 hour before</option>
        <option value="1440">1 day before</option>
      </select>
    </div>
  );
}