import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRealtimeSubscription } from "@/lib/hooks/use-realtime";
import { useCallback, useEffect } from "react";
import type { Notification } from "@/lib/pocketbase/types";

export const notifKeys = {
  all: ["notifications"] as const,
  list: () => [...notifKeys.all, "list"] as const,
  unread: () => [...notifKeys.all, "unread"] as const,
};

function getUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

/**
 * Fetch all notifications for the current user (sorted newest first).
 */
export function useNotifications() {
  const userId = getUserId();
  const pb = getPB();

  return useQuery({
    queryKey: notifKeys.list(),
    queryFn: async () => {
      const result = await pb.collection<Notification>("notifications").getList(1, 50, {
        filter: `user="${userId}"`,
        sort: "-created",
      });
      return result;
    },
  });
}

/**
 * Fetch only the unread notification count (lightweight).
 */
export function useUnreadCount() {
  const userId = getUserId();
  const pb = getPB();

  return useQuery({
    queryKey: notifKeys.unread(),
    queryFn: async () => {
      const result = await pb.collection<Notification>("notifications").getList(1, 1, {
        filter: `user="${userId}" && is_read=false`,
        countOnly: true,
      });
      return result.totalItems;
    },
    refetchInterval: 30_000, // refresh every 30s as fallback
  });
}

/**
 * Subscribe to new notifications in realtime and auto-invalidate queries.
 * Safe to call even when not authenticated — pass enabled=false to skip.
 */
export function useRealtimeNotifications(enabled = true) {
  const user = useAuthStore.getState().user;
  const userId = user?.id;

  const qc = useQueryClient();
  const handleEvent = useCallback(() => {
    qc.invalidateQueries({ queryKey: notifKeys.all });
  }, [qc]);

  useRealtimeSubscription<Notification>(
    "notifications",
    "*",
    useCallback(() => {
      handleEvent();
    }, [handleEvent]),
    userId ? `user="${userId}"` : undefined,
    enabled && !!userId,
  );
}

/**
 * Mark a single notification as read.
 */
export function useMarkNotifAsRead() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await pb.collection("notifications").update(id, { is_read: true });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notifKeys.all });
    },
  });
}

/**
 * Mark ALL unread notifications as read for the current user.
 */
export function useMarkAllAsRead() {
  const userId = getUserId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const unread = await pb.collection<Notification>("notifications").getList(1, 100, {
        filter: `user="${userId}" && is_read=false`,
        fields: "id",
      });
      for (const n of unread.items) {
        await pb.collection("notifications").update(n.id, { is_read: true });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notifKeys.all });
    },
  });
}
