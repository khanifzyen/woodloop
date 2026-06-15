"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Wallet, MessageSquare } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useRouter } from "next/navigation";
import { getPB } from "@/lib/pocketbase/client";
import { NotificationBadge } from "@/components/features/notification-badge";
import { useChatUnreadCount, useRealtimeChat, useWalletBalance } from "@/lib/hooks/use-wallet";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // Generate breadcrumb dari pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
  }));

  function handleLogout() {
    const pb = getPB();
    pb.authStore.clear();
    logout();
    document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "pb_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const { data: unreadCountData } = useChatUnreadCount();
  const unreadCount = unreadCountData ?? 0;
  const { data: walletBalance } = useWalletBalance();
  useRealtimeChat(true);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background pl-12 pr-4 md:pl-6 md:pr-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => (
            <BreadcrumbItem key={crumb.href}>
              {i < breadcrumbs.length - 1 ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              ) : (
                <span className="text-foreground font-medium">
                  {crumb.label}
                </span>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle + Language + Notifications */}
      <ThemeToggle />
      <LanguageSwitcher />
      <NotificationBadge />
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/chat">
          <MessageSquare className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </Button>

      {/* Wallet */}
      <Button variant="ghost" size="sm" className="gap-2 text-sm" asChild>
        <Link href="/wallet">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">
            Rp {(walletBalance ?? 0).toLocaleString("id-ID")}
          </span>
        </Link>
      </Button>

      {/* Avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name || "User"}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {user?.role || "-"}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/${user?.role}/profile`)}>
            <User className="mr-2 h-4 w-4" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/wallet")}>
            <Wallet className="mr-2 h-4 w-4" />
            Dompet
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
