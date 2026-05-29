"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB, getFileUrl } from "@/lib/pocketbase/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { UserDocument } from "@/lib/pocketbase/types";

export const userDocKeys = {
  all: ["user-documents"] as const,
  list: (userId: string) => [...userDocKeys.all, userId] as const,
};

function getUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export interface UserDocWithUrl extends UserDocument {
  fileUrl: string;
}

export function useUserDocuments() {
  const userId = getUserId();
  const pb = getPB();

  return useQuery({
    queryKey: userDocKeys.list(userId),
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
  });
}

export function useUploadUserDocument() {
  const pb = getPB();
  const qc = useQueryClient();
  const userId = getUserId();

  return useMutation({
    mutationFn: async ({
      doc_type,
      doc_name,
      file,
    }: {
      doc_type: string;
      doc_name?: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("user", userId);
      formData.append("doc_type", doc_type);
      if (doc_name) formData.append("doc_name", doc_name);
      formData.append("file", file);
      await pb.collection("user_documents").create(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDocKeys.list(userId) });
    },
  });
}

export function useDeleteUserDocument() {
  const pb = getPB();
  const qc = useQueryClient();
  const userId = getUserId();

  return useMutation({
    mutationFn: async (docId: string) => {
      await pb.collection("user_documents").delete(docId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDocKeys.list(userId) });
    },
  });
}
