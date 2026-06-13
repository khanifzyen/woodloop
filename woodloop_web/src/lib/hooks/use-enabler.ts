import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import type { User, ImpactMetric, UserDocument, UserDocWithUrl } from "@/lib/pocketbase/types";

export const enablerKeys = {
  all: ["enabler"] as const,
  metrics: (period?: string) =>
    period ? [...enablerKeys.all, "metrics", period] as const
           : [...enablerKeys.all, "metrics"] as const,
  users: (filters?: object) =>
    filters ? [...enablerKeys.all, "users", filters] as const
            : [...enablerKeys.all, "users"] as const,
  userDetail: (id: string) => [...enablerKeys.all, "users", id] as const,
  userDocs: (userId: string) => [...enablerKeys.all, "users", userId, "documents"] as const,
};

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

// ─── User Detail ─────────────────────────────────────────────────────────
export function useUserDetail(userId: string) {
  const pb = getPB();
  return useQuery({
    queryKey: enablerKeys.userDetail(userId),
    queryFn: async () => {
      const record = await pb.collection("users").getOne(userId);
      return record as unknown as User;
    },
    enabled: !!userId,
  });
}

// ─── Enabler: View All Documents for a Specific User ─────────────────────
export function useEnablerUserDocuments(userId: string) {
  const pb = getPB();
  return useQuery<UserDocWithUrl[]>({
    queryKey: enablerKeys.userDocs(userId),
    queryFn: async () => {
      const result = await pb.collection("user_documents").getList(1, 50, {
        filter: `user="${userId}"`,
        sort: "-created",
      });
      const items = result.items as unknown as UserDocument[];
      return items.map((doc) => ({
        ...doc,
        fileUrl: getFileUrl("user_documents", doc.id, doc.file),
      }));
    },
    enabled: !!userId,
  });
}

// ─── Enabler: Update Document Review (approve/reject + notes) ──────────
export function useUpdateDocumentReview() {
  const pb = getPB();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      docId,
      verified,
      notes,
    }: {
      docId: string;
      verified: boolean;
      notes?: string;
    }) => {
      return pb.collection("user_documents").update(docId, { verified, notes: notes || "" });
    },
    onSuccess: (_data, variables) => {
      // Invalidate all document queries since we don't know the user ID here
      qc.invalidateQueries({ queryKey: ["enabler", "users"] });
    },
  });
}

// ─── User Activity ───────────────────────────────────────────────────────
export interface UserActivity {
  wasteListings: number;
  timberListings: number;
  orders: number;
  pickups: number;
  documents: number;
}

export function useUserActivity(userId: string) {
  const pb = getPB();
  return useQuery({
    queryKey: [...enablerKeys.userDetail(userId), "activity"],
    queryFn: async () => {
      const [wasteListings, timberListings, ordersAsBuyer, ordersAsSeller, pickups, documents] =
        await Promise.all([
          pb.collection("waste_listings").getList(1, 1, { filter: `generator="${userId}"`, skipTotal: true }).catch(() => null),
          pb.collection("raw_timber_listings").getList(1, 1, { filter: `supplier="${userId}"`, skipTotal: true }).catch(() => null),
          pb.collection("orders").getList(1, 1, { filter: `buyer="${userId}"`, skipTotal: true }).catch(() => null),
          pb.collection("raw_timber_orders").getList(1, 1, { filter: `seller="${userId}"`, skipTotal: true }).catch(() => null),
          pb.collection("pickups").getList(1, 1, { filter: `aggregator="${userId}"`, skipTotal: true }).catch(() => null),
          pb.collection("user_documents").getList(1, 1, { filter: `user="${userId}"`, skipTotal: true }).catch(() => null),
        ]);

      return {
        wasteListings: wasteListings?.totalItems || 0,
        timberListings: timberListings?.totalItems || 0,
        orders: (ordersAsBuyer?.totalItems || 0) + (ordersAsSeller?.totalItems || 0),
        pickups: pickups?.totalItems || 0,
        documents: documents?.totalItems || 0,
      };
    },
    enabled: !!userId,
  });
}

// ─── Export Impact Data to CSV ──────────────────────────────────────────
export function useExportImpactData() {
  const pb = getPB();
  return useMutation({
    mutationFn: async () => {
      const metrics = await pb.collection<ImpactMetric>("impact_metrics").getList(1, 5000, {
        sort: "-created",
      });
      const allUsers = await pb.collection("users").getList(1, 200, { sort: "-created" });

      const rows = [
        ["Periode", "Limbah (kg)", "CO2 (kg)", "Nilai Ekonomi (Rp)", "Total Pengguna"].join(","),
      ];

      // Aggregate by month
      const monthlyMap: Record<string, { waste: number; co2: number; value: number }> = {};
      metrics.items.forEach((m) => {
        const month = m.created?.substring(0, 7) || "unknown";
        if (!monthlyMap[month]) monthlyMap[month] = { waste: 0, co2: 0, value: 0 };
        monthlyMap[month].waste += m.waste_diverted || 0;
        monthlyMap[month].co2 += m.co2_saved || 0;
        monthlyMap[month].value += m.economic_value || 0;
      });

      const totalUsers = allUsers.totalItems;
      Object.entries(monthlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([month, data]) => {
          rows.push([month, data.waste.toString(), data.co2.toString(), data.value.toString(), totalUsers.toString()].join(","));
        });

      // Add summary row
      const totalWaste = metrics.items.reduce((s, m) => s + (m.waste_diverted || 0), 0);
      const totalCO2 = metrics.items.reduce((s, m) => s + (m.co2_saved || 0), 0);
      const totalValue = metrics.items.reduce((s, m) => s + (m.economic_value || 0), 0);
      rows.push(["TOTAL", totalWaste.toString(), totalCO2.toString(), totalValue.toString(), totalUsers.toString()].join(","));

      const csv = rows.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `woodloop-impact-data-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      return true;
    },
  });
}
