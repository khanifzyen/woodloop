"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useNotifications, useMarkNotifAsRead } from "@/lib/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotifAsRead();
  const notifs = data?.items ?? [];
  const unreadCount = notifs.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Notifikasi</h1>
          <p className="text-muted-foreground">{unreadCount} belum dibaca</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="h-4 w-4" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : notifs.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">Belum ada notifikasi</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <div key={n.id}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${!n.is_read ? "bg-primary/5 border-primary/20" : ""}`}
              onClick={() => !n.is_read && markRead.mutate(n.id)}>
              <div className="flex items-start gap-3">
                <Bell className={`h-5 w-5 mt-0.5 shrink-0 ${!n.is_read ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{n.title}</p>
                    {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
