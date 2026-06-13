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

function getDesignerId(): string {
  const user = useAuthStore.getState().user;
  if (!user || user.role !== "designer") throw new Error("Not a designer");
  return user.id;
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
  const designerId = getDesignerId();
  const pb = getPB();

  return useQuery<DesignerDashboardData>({
    queryKey: designerKeys.dashboard(),
    queryFn: async () => {
      const [articles, notes, consultations] = await Promise.all([
        pb.collection<DesignArticle>("design_articles").getList(1, 200, {
          filter: `author="${designerId}"`,
          sort: "-created",
        }),
        pb.collection<DesignNote>("design_notes").getList(1, 200, {
          filter: `designer="${designerId}"`,
          sort: "-created",
        }),
        pb.collection<DesignConsultation>("design_consultations").getList(1, 200, {
          filter: `designer="${designerId}" && status="open"`,
          sort: "-created",
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
  });
}

export function useDesignerArticles() {
  const designerId = getDesignerId();
  const pb = getPB();

  return useQuery<DesignArticle[]>({
    queryKey: designerKeys.articles(),
    queryFn: async () => {
      const result = await pb.collection<DesignArticle>("design_articles").getList(1, 200, {
        filter: `author="${designerId}"`,
        sort: "-created",
      });
      return result.items;
    },
  });
}

export function useCreateArticle() {
  const designerId = getDesignerId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<DesignArticle>) => {
      return pb.collection("design_articles").create({
        ...data,
        author: designerId,
      });
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<DesignArticle> }) => {
      return pb.collection("design_articles").update(id, data);
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
  const designerId = getDesignerId();
  const pb = getPB();

  return useQuery<DesignNote[]>({
    queryKey: designerKeys.designNotes(),
    queryFn: async () => {
      const result = await pb.collection<DesignNote>("design_notes").getList(1, 200, {
        filter: `designer="${designerId}"`,
        sort: "-created",
        expand: "designer",
      });
      return result.items;
    },
  });
}

export function useCreateDesignNote() {
  const designerId = getDesignerId();
  const pb = getPB();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<DesignNote>) => {
      return pb.collection("design_notes").create({
        ...data,
        designer: designerId,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: designerKeys.designNotes() });
      qc.invalidateQueries({ queryKey: designerKeys.dashboard() });
    },
  });
}

export function useDesignerConsultations() {
  const designerId = getDesignerId();
  const pb = getPB();

  return useQuery<DesignConsultation[]>({
    queryKey: designerKeys.consultations(),
    queryFn: async () => {
      const result = await pb.collection<DesignConsultation>("design_consultations").getList(1, 200, {
        filter: `designer="${designerId}"`,
        sort: "-created",
        expand: "client",
      });
      return result.items;
    },
  });
}
