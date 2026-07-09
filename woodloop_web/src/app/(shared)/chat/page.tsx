"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkChatAsRead,
} from "@/lib/hooks/use-wallet";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getPB } from "@/lib/pocketbase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, X, Package, Menu, ChevronLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const productTemplates = [
  { value: "tersedia", label: "Apakah barang ini tersedia?" },
  { value: "nego", label: "Masih bisa nego harga?" },
  { value: "detail", label: "Bisa kirim detail ukuran dan foto tambahan?" },
  { value: "stok", label: "Berapa stok yang tersedia saat ini?" },
];

const orderTemplates = [
  { value: "progress", label: "Bagaimana progress order ini?" },
  { value: "estimasi", label: "Kira-kira kapan selesai?" },
  { value: "pengiriman", label: "Bagaimana metode pengirimannya?" },
  { value: "pembayaran", label: "Apakah sudah menerima pembayaran?" },

function ChatPageContent() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const receiverParam = searchParams.get("receiver");
  const productParam = searchParams.get("product");
  const orderParam = searchParams.get("order");
  const woodParam = searchParams.get("wood");

  const { data: conversations, isLoading: convLoading } = useConversations();
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const { data: messages, isLoading: msgLoading } = useMessages(activePartner || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkChatAsRead();
  const [input, setInput] = useState("");

  // Mark as read when opening a conversation
  useEffect(() => {
    if (activePartner && messages && messages.length > 0) {
      markAsRead.mutate(activePartner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartner]);

  // Preview state
  const [previewProduct, setPreviewProduct] = useState<string | null>(
    productParam || null
  );
  const [previewProductName, setPreviewProductName] = useState<string>(
    woodParam || "Produk"
  );
  const [previewOrder, setPreviewOrder] = useState<string | null>(
    orderParam || null
  );
  const [previewOrderSupplier, setPreviewOrderSupplier] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Set active partner from URL param
  useEffect(() => {
    if (receiverParam && !activePartner) {
      setActivePartner(receiverParam);
    }
  }, [receiverParam, activePartner]);

  // Fetch order preview info
  useEffect(() => {
    if (!previewOrder) return;
    const orderId = previewOrder;
    async function loadOrder() {
      try {
        const pb = getPB();
        const order = await pb.collection("raw_timber_orders").getOne(orderId, {
          expand: "seller",
          requestKey: null,
        });
        const sellerName = order.expand?.seller?.name || "Supplier";
        setPreviewOrderSupplier(sellerName);
      } catch {}
    }
    loadOrder();
  }, [previewOrder]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  function removePreview() {
    setPreviewProduct(null);
    setPreviewOrder(null);
  }

  async function handleSend() {
    if (!input.trim() || !activePartner) return;
    const { user } = useAuthStore.getState();
    const role = user?.role;
    let message = input.trim();

    // Append product/order reference link
    if (previewProduct) {
      message += `\n\n🪵 ${previewProductName}\n🔗 /generator/buy-timber?listing=${previewProduct}`;
    }
    if (previewOrder) {
      const link = role === "supplier"
        ? `/supplier/orders?order=${previewOrder}`
        : `/generator/timber-orders?order=${previewOrder}`;
      message += `\n\n📦 Pesanan #${previewOrder.slice(0, 8)} - ${previewOrderSupplier}\n🔗 ${link}`;
    }

    try {
      await sendMessage.mutateAsync({
        receiver: activePartner,
        message,
      });
      setInput("");
      // Keep preview for next messages
    } catch {
      toast.error("Gagal mengirim pesan");
    }
  }

  const hasPreview = !!previewProduct || !!previewOrder;

  return (
    <div className="relative flex h-[calc(100vh-3.5rem)]">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        className="md:hidden absolute top-2 left-2 z-20 h-8 w-8 flex items-center justify-center rounded-md bg-background border shadow-sm"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </button>

      {/* Overlay backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[5] bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Panel - Conversations */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-10 w-72
          border-r bg-background overflow-y-auto
          transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          pt-10 md:pt-0
        `}
      >
        <div className="p-3 border-b">
          <h2 className="font-medium">Percakapan</h2>
        </div>
        {convLoading ? (
          <div className="p-3 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !conversations?.length ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Belum ada chat
          </div>
        ) : (
          conversations.map((conv) => {
            const partnerName =
              conv.lastMessage.expand?.sender?.name ||
              conv.lastMessage.expand?.receiver?.name ||
              conv.partnerId.slice(0, 8);
            const isActive = activePartner === conv.partnerId;
            return (
              <div
                key={conv.partnerId}
                className={`p-3 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                  isActive ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setActivePartner(conv.partnerId);
                  setSidebarOpen(false);
                  // Clear preview when switching to existing conversation
                  if (conv.partnerId !== receiverParam) {
                    setPreviewProduct(null);
                    setPreviewOrder(null);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {partnerName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage.message}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="h-5 px-1.5 text-xs">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activePartner ? (
          <>
            {/* Chat header with partner name + back button on mobile */}
            <div className="flex items-center gap-2 px-3 py-2 border-b md:hidden">
              {sidebarOpen ? null : (
                <button
                  type="button"
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
              <h2 className="text-sm font-medium truncate">
                {conversations
                  ?.find((c) => c.partnerId === activePartner)
                  ?.lastMessage.expand?.sender?.name ||
                  conversations?.find((c) => c.partnerId === activePartner)
                    ?.lastMessage.expand?.receiver?.name ||
                  "Chat"}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-3/4" />
                  ))}
                </div>
              ) : messages?.length ? (
                messages.map((msg) => {
                  const isOwn = msg.sender === user?.id;
                  const lines = msg.message.split("\n");
                  const textLines: string[] = [];
                  const refBlocks: { title: string; link: string }[] = [];
                  for (const line of lines) {
                    if (line.startsWith("🪵 ") || line.startsWith("📦 ")) {
                      refBlocks.push({ title: line.replace(/^[^\s]+\s/, ""), link: "" });
                    } else if (line.startsWith("🔗 ")) {
                      if (refBlocks.length > 0) refBlocks[refBlocks.length - 1].link = line.slice(3);
                    } else {
                      textLines.push(line);
                    }
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {textLines.filter(Boolean).map((line, i) => (
                          <p key={i} className="text-sm">{line}</p>
                        ))}
                        {refBlocks.map((block, i) => (
                          <a
                            key={i}
                            href={block.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-1.5 flex items-center gap-2 p-2 rounded-md border text-xs ${
                              isOwn
                                ? "bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                                : "bg-background border-border text-foreground hover:bg-accent"
                            }`}
                          >
                            <Package className="h-3.5 w-3.5 shrink-0" />
                            <span className="flex-1 truncate">{block.title}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
                          </a>
                        ))}
                        <p
                          className={`text-[10px] mt-1 ${
                            isOwn
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatDate(msg.created)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Belum ada pesan
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Preview Box */}
            {hasPreview && (
              <div className="px-3 pt-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                  <Package className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    {previewProduct && (
                      <p className="text-sm font-medium truncate">
                        {previewProductName}
                      </p>
                    )}
                    {previewOrder && (
                      <p className="text-sm font-medium truncate">
                        Pesanan #{previewOrder.slice(0, 8)} —{" "}
                        {previewOrderSupplier}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {previewProduct ? "Dari marketplace" : "Dari pesanan"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={removePreview}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Template Pilihan — langsung tampil sebagai tombol */}
            {hasPreview && (
              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {(previewProduct ? productTemplates : orderTemplates).map(
                    (t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setInput(t.label)}
                        className="text-xs px-2.5 py-1.5 rounded-full border bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        {t.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={sendMessage.isPending}
              >
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

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <p className="text-muted-foreground">Memuat...</p>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  );
}
