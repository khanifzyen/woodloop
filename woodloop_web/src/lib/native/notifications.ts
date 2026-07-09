/**
 * Notifications Abstraction Layer
 *
 * Strategy: Capacitor Push Notifications (FCM/APNS) → In-app fallback (subscription-based polling)
 * Digunakan oleh: Semua role — notifikasi pickup, order, payment
 *
 * Catatan: FCM setup membutuhkan google-services.json (Android) di platform masing-masing.
 *         Untuk web, fallback menggunakan PocketBase realtime subscription + polling periodik.
 */

// ===================================================================
// Types
// ===================================================================
export interface PushNotificationData {
  title: string;
  body: string;
  type: "order" | "pickup" | "payment" | "system" | "promo";
  referenceType?: string;
  referenceId?: string;
}

export interface SubscriptionCallbacks {
  onNotification?: (data: PushNotificationData) => void;
  onRegister?: (token: string) => void;
  onError?: (error: Error) => void;
}

// ===================================================================
// Capacitor Push (Native)
// ===================================================================
async function registerPushNative(
  callbacks: SubscriptionCallbacks,
): Promise<() => void> {
  const { PushNotifications } = await import(
    // @ts-expect-error — native-only module
    "@capacitor/push-notifications"
  );

  // Minta permission
  const permResult = await PushNotifications.requestPermissions();
  if (permResult.receive !== "granted") {
    callbacks.onError?.(new Error("Izin notifikasi ditolak"));
    return () => {};
  }

  // Register
  await PushNotifications.register();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const regListener = await (PushNotifications as any).addListener(
    "registration",
    (token: { value: string }) => {
      callbacks.onRegister?.(token.value);
    },
  );

  // Listener notifikasi masuk
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushListener = await (PushNotifications as any).addListener(
    "pushNotificationReceived",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (notification: any) => {
      const data = notification.data as Record<string, string>;
      callbacks.onNotification?.({
        title: notification.title ?? "",
        body: notification.body ?? "",
        type: (data?.type as PushNotificationData["type"]) ?? "system",
        referenceType: data?.referenceType,
        referenceId: data?.referenceId,
      });
    },
  );

  // Listener tap notifikasi (app dibuka dari notif)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionListener = await (PushNotifications as any).addListener(
    "pushNotificationActionPerformed",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (notification: any) => {
      const data = notification.notification.data as Record<string, string>;
      callbacks.onNotification?.({
        title: notification.notification.title ?? "",
        body: notification.notification.body ?? "",
        type: (data?.type as PushNotificationData["type"]) ?? "system",
        referenceType: data?.referenceType,
        referenceId: data?.referenceId,
      });
    },
  );

  // Cleanup
  return () => {
    regListener.remove();
    pushListener.remove();
    actionListener.remove();
  };
}

// ===================================================================
// In-App Fallback (Web / polling)
// ===================================================================
// Gunakan PocketBase realtime subscription untuk notifikasi in-app
// Implementasi di hooks/use-notifications.ts sudah ada

/**
 * Fallback — request permission untuk browser Notification API (desktop).
 * Ini hanya untuk notifikasi in-browser, bukan push murni.
 */
async function requestWebPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

/**
 * Kirim notifikasi in-browser (web fallback untuk desktop).
 */
export function sendWebNotification(title: string, body: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return; // Notifikasi in-app sudah ditangani oleh NotificationBadge komponen
  }
  new Notification(title, { body, icon: "/icons/icon-192x192.png" });
}

// ===================================================================
// Platform Detection
// ===================================================================
function isNativePlatform(): boolean {
  try {
    return (
      typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__CAPACITOR__ !== undefined
    );
  } catch {
    return false;
  }
}

// ===================================================================
// Main API
// ===================================================================

/**
 * Register untuk push notification.
 * - Native: Capacitor Push (FCM/APNS)
 * - Web: request browser permission
 *
 * Returns cleanup function.
 */
export async function registerForPushNotifications(
  callbacks: SubscriptionCallbacks = {},
): Promise<() => void> {
  if (isNativePlatform()) {
    return registerPushNative(callbacks);
  }

  // Web fallback — hanya minta permission browser
  const granted = await requestWebPermission();
  if (!granted) {
    callbacks.onError?.(new Error("Izin notifikasi browser ditolak"));
  }
  return () => {}; // No cleanup needed for web
}