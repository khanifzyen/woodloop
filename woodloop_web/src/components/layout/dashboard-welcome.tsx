"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/stores/auth-store";

interface RoleFeature {
  icon: string;
  label: string;
  desc: string;
}

interface WelcomeInfo {
  title: string;
  description: string;
  features: RoleFeature[];
}

export function DashboardWelcome({ info }: { info: WelcomeInfo }) {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">
          Selamat datang, {user?.name || "User"}!
        </h1>
        <p className="text-muted-foreground mt-1">{info.description}</p>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {info.features.map((feature) => (
          <Card key={feature.label} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <span className="text-2xl">{feature.icon}</span>
              <CardTitle className="text-base mt-2">{feature.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Placeholder */}
      <Card className="bg-muted/50">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            Dashboard akan segera hadir dengan data real-time dari database.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
