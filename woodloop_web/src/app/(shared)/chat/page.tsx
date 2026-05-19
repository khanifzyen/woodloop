"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConversations, useMessages, useSendMessage } from "@/lib/hooks/use-wallet";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function ChatPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const { data: conversations, isLoading: convLoading } = useConversations();
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const { data: messages, isLoading: msgLoading } = useMessages(activePartner || "");
  const sendMessage = useSendMessage();
  const [input, setInput] = useState("");

  async function handleSend() {
    if (!input.trim() || !activePartner) return;
    try {
      await sendMessage.mutateAsync({ receiver: activePartner, message: input.trim() });
      setInput("");
    } catch {
      toast.error("Gagal mengirim pesan");
    }
  }

  return (
    <div className="flex gap-0 h-[calc(100vh-8rem)] -mx-6 -mt-6">
      {/* Left Panel - Conversations */}
      <div className="w-72 border-r shrink-0 overflow-y-auto">
        <div className="p-3 border-b"><h2 className="font-medium">Percakapan</h2></div>
        {convLoading ? (
          <div className="p-3 space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : !conversations?.length ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Belum ada chat
          </div>
        ) : (
          conversations.map((conv) => {
            const partnerName = conv.lastMessage.expand?.sender?.name || conv.partnerId.slice(0, 8);
            const isActive = activePartner === conv.partnerId;
            return (
              <div key={conv.partnerId}
                className={`p-3 cursor-pointer border-b hover:bg-muted/50 transition-colors ${isActive ? "bg-muted" : ""}`}
                onClick={() => setActivePartner(conv.partnerId)}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{partnerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.message}</p>
                  </div>
                  {conv.unread > 0 && <Badge className="h-5 px-1.5 text-xs">{conv.unread}</Badge>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col">
        {activePartner ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgLoading ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-3/4" />)}</div>
              ) : messages?.length ? (
                messages.map((msg) => {
                  const isOwn = msg.sender === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-lg px-3 py-2 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                          {new Date(msg.created).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground py-12">Belum ada pesan</div>
              )}
            </div>
            <div className="p-3 border-t flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..." className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSend()} />
              <Button size="icon" onClick={handleSend} disabled={sendMessage.isPending}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Pilih percakapan untuk memulai chat</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
