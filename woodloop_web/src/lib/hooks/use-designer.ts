import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { DesignArticle, DesignNote, DesignConsultation } from "@/lib/pocketbase/types";

export const designerKeys = {
  all: ["designer"] as const,
  dashboard: () => [...designerKeys.all, "dashboard"] as const,
  articles: () => [...designerKeys.all, "articles"] as const,
  designNotes: () => [...designerKeys.all, "design-notes"] as const,
  consultations: () => [...designerKeys.all, "consultations"] as const,
};

function useDesignerId(): { designerId: string | null; isDesigner: boolean } {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s._hydrated);
  if (!hydrated) return { designerId: null, isDesigner: false };
  if (!user || user.role !== "designer") return { designerId: null, isDesigner: false };
  return { designerId: user.id, isDesigner: true };
}

export interface DesignerDashboardData {
  totalArticles: number;
  publishedArticles: number;
  totalDesignNotes: number;
  publicNotes: number;
  openConsultations: number;
  recentArticles: DesignArticle[];
  recentNotes: DesignNote[];
}

export function useDesignerDashboard() {
  const { designerId, isDesigner } = useDesignerId();
  const pb = getPB();

  return useQuery<DesignerDashboardData>({
    queryKey: designerKeys.dashboard(),
    queryFn: async () => {
      const [articles, notes, consultations] = await Promise.all([
        pb.collection<DesignArticle>("design_articles").getList(1, 200, {
          filter: `author="${designerId}"`,
          sort: "-id",
        }),
        pb.collection<DesignNote>("design_notes").getList(1, 200, {
          filter: `designer="${designerId}"`,
          sort: "-id",
        }),
        pb.collection<DesignConsultation>("design_consultations").getList(1, 200, {
          filter: `designer="${designerId}" && status="open"`,
          sort: "-id",
        }),
      ]);

      return {
        totalArticles: articles.totalItems,
        publishedArticles: articles.items.filter((a) => a.published).length,
        totalDesignNotes: notes.totalItems,
        publicNotes: notes.items.filter((n) => n.is_public).length,
        openConsultations: consultations.totalItems,
        recentArticles: articles.items.slice(0, 5),
        recentNotes: notes.items.slice(0, 5),
      };
    },
    enabled: isDesigner && !!designerId,
  });
}

export function useDesignerArticles() {
  const { designerId, isDesigner } = useDesignerId();
  const pb = getPB();

  return useQuery<DesignArticle[]>({
    queryKey: designerKeys.articles(),
    queryFn: async () => {
      const result = await pb.collection<DesignArticle>("design_articles").getList(1, 200, {
        filter: `author="${designerId}"`,
        sort: "-id",
      });
      return result.items;
    },
    enabled: isDesigner && !!designerId,
  });
}

export function useCreateArticle() {
  const { designerId } = useDesignerId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append("author", designerId ?? "");
      return pb.collection("design_articles").create(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: designerKeys.articles() });
      qc.invalidateQueries({ queryKey: designerKeys.dashboard() });
    },
  });
}

export function useUpdateArticle() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      return pb.collection("design_articles").update(id, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: designerKeys.articles() });
      qc.invalidateQueries({ queryKey: designerKeys.dashboard() });
    },
  });
}

export function useDeleteArticle() {
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return pb.collection("design_articles").delete(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: designerKeys.articles() });
      qc.invalidateQueries({ queryKey: designerKeys.dashboard() });
    },
  });
}

export function useDesignerNotes() {
  const { designerId, isDesigner } = useDesignerId();
  const pb = getPB();

  return useQuery<DesignNote[]>({
    queryKey: designerKeys.designNotes(),
    queryFn: async () => {
      const result = await pb.collection<DesignNote>("design_notes").getList(1, 200, {
        filter: `designer="${designerId}"`,
        sort: "-id",
        expand: "designer",
      });
      return result.items;
    },
    enabled: isDesigner && !!designerId,
  });
}

export function useCreateDesignNote() {
  const { designerId } = useDesignerId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      formData.append("designer", designerId ?? "");
      return pb.collection("design_notes").create(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: designerKeys.designNotes() });
      qc.invalidateQueries({ queryKey: designerKeys.dashboard() });
    },
  });
}

export function useDesignerConsultations() {
  const { designerId, isDesigner } = useDesignerId();
  const pb = getPB();

  return useQuery<DesignConsultation[]>({
    queryKey: designerKeys.consultations(),
    queryFn: async () => {
      const result = await pb.collection<DesignConsultation>("design_consultations").getList(1, 200, {
        filter: `designer="${designerId}"`,
        sort: "-id",
        expand: "client",
      });
      return result.items;
    },
    enabled: isDesigner && !!designerId,
  });
}
