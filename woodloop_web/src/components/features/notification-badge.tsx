"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { useUnreadCount } from "@/lib/hooks/use-notifications";

export function NotificationBadge() {
  const { data: unreadCount = 0 } = useUnreadCount();

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/notifications">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
