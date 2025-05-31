import { writable } from 'svelte/store';

export const notifications = writable([]);

let idCounter = 0;

export function addNotification({message}, status, duration = 3000) {
  const id = ++idCounter;
  const newNotification = { id, message, status };

  notifications.update(n => [...n, newNotification]);

  // Auto-remove after 2 seconds
  setTimeout(() => {
    notifications.update(n => n.filter(notif => notif.id !== id));
  }, duration);
}