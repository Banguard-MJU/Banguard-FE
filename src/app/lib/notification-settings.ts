export type NotificationPreferences = {
  push: boolean;
  comment: boolean;
  reply: boolean;
  like: boolean;
  marketing: boolean;
};

export const NOTIFICATION_SETTINGS_STORAGE_KEY = "banguard_notification_settings";

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  push: false,
  comment: true,
  reply: true,
  like: true,
  marketing: false,
};

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getBrowserNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  return window.Notification.permission;
}

export function readNotificationSettingsMap(): Record<string, NotificationPreferences> {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue) as Record<string, NotificationPreferences>;
  } catch {
    window.localStorage.removeItem(NOTIFICATION_SETTINGS_STORAGE_KEY);
    return {};
  }
}

export function writeNotificationSettingsMap(settingsMap: Record<string, NotificationPreferences>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(NOTIFICATION_SETTINGS_STORAGE_KEY, JSON.stringify(settingsMap));
}

export function readNotificationPreferences(userId?: string | null) {
  if (!userId) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  const settingsMap = readNotificationSettingsMap();
  return {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...settingsMap[userId],
  };
}

export function writeNotificationPreferences(userId: string, preferences: NotificationPreferences) {
  const settingsMap = readNotificationSettingsMap();
  settingsMap[userId] = preferences;
  writeNotificationSettingsMap(settingsMap);
}

export async function requestBrowserNotificationPermission() {
  if (!isNotificationSupported()) {
    return "unsupported" as const;
  }

  if (window.Notification.permission === "granted") {
    return "granted" as const;
  }

  if (window.Notification.permission === "denied") {
    return "denied" as const;
  }

  return window.Notification.requestPermission();
}

export function showLocalNotification(title: string, options?: NotificationOptions) {
  if (!isNotificationSupported() || window.Notification.permission !== "granted") {
    return false;
  }

  new window.Notification(title, {
    icon: "/favicon.svg?v=banggadi-refresh-20260604-1",
    badge: "/favicon.svg?v=banggadi-refresh-20260604-1",
    ...options,
  });
  return true;
}
