import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { User, ImpactMetric } from "@/lib/pocketbase/types";

export const enablerKeys = {
  all: ["enabler"] as const,
  metrics: (period?: string) => [...enablerKeys.all, "metrics", period] as const,
  users: (filters?: object) => [...enablerKeys.all, "users", filters] as const,
  userDetail: (id: string) => [...enablerKeys.all, "users", id] as const,
};

function getEnablerId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "enabler") throw new Error("Not an enabler");
  return user.id;
}

// ─── Impact Metrics ──────────────────────────────────────────────────────
export interface ImpactSummary {
  totalWasteDiverted: number;
  totalCO2Saved: number;
  totalEconomicValue: number;
  totalUsers: number;
  monthlyData: { month: string; waste: number; co2: number; value: number }[];
  roleDistribution: { role: string; count: number }[];
}

export function useImpactMetrics(period?: string) {
  const pb = getPB();
  return useQuery<ImpactSummary>({
    queryKey: enablerKeys.metrics(period),
    queryFn: async () => {
      const [metrics, users] = await Promise.all([
        pb.collection<ImpactMetric>("impact_metrics").getList(1, 1000, { sort: "-created" }),
        pb.collection("users").getList(1, 1, { skipTotal: true }),
      ]);

      const allUsers = await pb.collection("users").getList(1, 200, { sort: "-created" });

      const totalWaste = metrics.items.reduce((s, m) => s + (m.waste_diverted || 0), 0);
      const totalCO2 = metrics.items.reduce((s, m) => s + (m.co2_saved || 0), 0);
      const totalValue = metrics.items.reduce((s, m) => s + (m.economic_value || 0), 0);

      // Monthly aggregation
      const monthlyMap: Record<string, { waste: number; co2: number; value: number }> = {};
      metrics.items.forEach((m) => {
        const month = m.created?.substring(0, 7) || "unknown";
        if (!monthlyMap[month]) monthlyMap[month] = { waste: 0, co2: 0, value: 0 };
        monthlyMap[month].waste += m.waste_diverted || 0;
        monthlyMap[month].co2 += m.co2_saved || 0;
        monthlyMap[month].value += m.economic_value || 0;
      });

      const roleDist: Record<string, number> = {};
      allUsers.items.forEach((u: unknown) => {
        const role = (u as Record<string, string>).role || "unknown";
        roleDist[role] = (roleDist[role] || 0) + 1;
      });

      return {
        totalWasteDiverted: totalWaste,
        totalCO2Saved: totalCO2,
        totalEconomicValue: totalValue,
        totalUsers: allUsers.totalItems,
        monthlyData: Object.entries(monthlyMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-12)
          .map(([month, data]) => ({ month, ...data })),
        roleDistribution: Object.entries(roleDist).map(([role, count]) => ({ role, count })),
      };
    },
  });
}

// ─── User Management ─────────────────────────────────────────────────────
export function useAllUsers(filters?: { role?: string; search?: string; verified?: string }) {
  const pb = getPB();
  return useQuery({
    queryKey: enablerKeys.users(filters),
    queryFn: async () => {
      const filterParts: string[] = [];
      if (filters?.role && filters.role !== "all") filterParts.push(`role="${filters.role}"`);
      if (filters?.verified === "verified") filterParts.push('is_verified=true');
      else if (filters?.verified === "unverified") filterParts.push('is_verified=false');

      let result = await pb.collection("users").getList(1, 200, {
        filter: filterParts.join(" && ") || undefined,
        sort: "-created",
      });

      let items = result.items as unknown as User[];

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.workshop_name?.toLowerCase().includes(q)
        );
      }

      return { items, totalItems: result.totalItems, page: result.page };
    },
  });
}

export function useUpdateUserVerification() {
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, is_verified }: { userId: string; is_verified: boolean }) => {
      return pb.collection("users").update(userId, { is_verified });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: enablerKeys.users() });
    },
  });
}
