export function getReminderMinutes() {
  return Number(localStorage.getItem("taskpilot-reminder") ?? "30");
}

export function setReminderMinutes(minutes: number) {
  localStorage.setItem("taskpilot-reminder", String(minutes));
}