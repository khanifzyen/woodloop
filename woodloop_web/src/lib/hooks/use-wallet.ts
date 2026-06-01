import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRealtimeSubscription } from "@/lib/hooks/use-realtime";
import { useCallback } from "react";
import type { WalletTransaction, ChatMessage } from "@/lib/pocketbase/types";

const walletKeys = { all: ["wallet"] as const, transactions: () => [...walletKeys.all, "transactions"] as const };
const chatKeys = { all: ["chat"] as const, conversations: () => [...chatKeys.all, "conversations"] as const, messages: (id: string) => [...chatKeys.all, "messages", id] as const };

// ─── Notifications (re-exported from use-notifications.ts) ───────────────
export {
  useNotifications,
  useMarkNotifAsRead,
  useMarkAllAsRead,
  useUnreadCount,
  useRealtimeNotifications,
} from "./use-notifications";

// ─── Helpers ─────────────────────────────────────────────────────────────
function getUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

// ─── Wallet ──────────────────────────────────────────────────────────────
export function useWalletBalance() {
  const userId = getUserId();
  const pb = getPB();
  return useQuery({
    queryKey: [...walletKeys.all, "balance"],
    queryFn: async () => {
      const txs = await pb.collection<WalletTransaction>("wallet_transactions").getList(1, 1, {
        filter: `user="${userId}"`,
        sort: "-created",
      });
      return txs.items[0]?.balance_after ?? 0;
    },
  });
}

export function useWalletTransactions() {
  const userId = getUserId();
  const pb = getPB();
  return useQuery({
    queryKey: walletKeys.transactions(),
    queryFn: async () => {
      const result = await pb.collection<WalletTransaction>("wallet_transactions").getList(1, 100, {
        filter: `user="${userId}"`,
        sort: "-created",
      });
      return result;
    },
  });
}

// ─── Chat ────────────────────────────────────────────────────────────────
export function useChatUnreadCount() {
  const userId = getUserId();
  const pb = getPB();
  return useQuery({
    queryKey: [...chatKeys.all, "unread"],
    queryFn: async () => {
      const result = await pb.collection("chats").getList(1, 1, {
        filter: `receiver="${userId}" && is_read=false`,
        countOnly: true,
      });
      return result.totalItems;
    },
    refetchInterval: 30_000,
  });
}

export function useRealtimeChat(enabled = true) {
  const user = useAuthStore.getState().user;
  const qc = useQueryClient();
  const handleEvent = useCallback(() => {
    qc.invalidateQueries({ queryKey: chatKeys.all });
  }, [qc]);
  useRealtimeSubscription<ChatMessage>(
    "chats", "*",
    useCallback(() => { handleEvent(); }, [handleEvent]),
    undefined,
    enabled && !!user,
  );
}

export function useConversations() {
  const userId = getUserId();
  const pb = getPB();
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: async () => {
      const msgs = await pb.collection<ChatMessage>("chats").getList(1, 200, {
        filter: `sender="${userId}" || receiver="${userId}"`,
        sort: "-created",
        expand: "sender,receiver",
      });
      // Group by partner
      const convMap = new Map<string, { partner: ChatMessage["expand"]; lastMessage: ChatMessage; unread: number }>();
      for (const msg of msgs.items) {
        const partnerId = msg.sender === userId ? msg.receiver : msg.sender;
        if (!convMap.has(partnerId)) {
          convMap.set(partnerId, {
            partner: msg.expand,
            lastMessage: msg,
            unread: msg.receiver === userId && !msg.is_read ? 1 : 0,
          });
        } else {
          const existing = convMap.get(partnerId)!;
          if (!existing.lastMessage || msg.created > existing.lastMessage.created) {
            existing.lastMessage = msg;
          }
          if (msg.receiver === userId && !msg.is_read) existing.unread++;
        }
      }
      return Array.from(convMap.entries()).map(([partnerId, data]) => ({ partnerId, ...data }));
    },
  });
}

export function useMessages(partnerId: string) {
  const userId = getUserId();
  const pb = getPB();
  const qc = useQueryClient();
  return useQuery({
    queryKey: chatKeys.messages(partnerId),
    queryFn: async () => {
      const result = await pb.collection<ChatMessage>("chats").getList(1, 100, {
        filter: `(sender="${userId}" && receiver="${partnerId}") || (sender="${partnerId}" && receiver="${userId}")`,
        sort: "created",
        expand: "sender,receiver",
      });
      return result.items;
    },
  });
}

export function useMarkChatAsRead() {
  const userId = getUserId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (partnerId: string) => {
      const unread = await pb.collection("chats").getList(1, 100, {
        filter: `sender="${partnerId}" && receiver="${userId}" && is_read=false`,
        fields: "id",
      });
      for (const msg of unread.items) {
        await pb.collection("chats").update(msg.id, { is_read: true });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.all }),
  });
}

export function useSendMessage() {
  const userId = getUserId();
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ receiver, message }: { receiver: string; message: string }) => {
      return pb.collection("chats").create({
        sender: userId,
        receiver,
        message,
        is_read: false,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.all }),
  });
}
