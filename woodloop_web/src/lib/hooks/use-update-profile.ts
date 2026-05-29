"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getPB } from "@/lib/pocketbase/client";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";
import { toast } from "sonner";

export function useUpdateProfile() {
  const pb = getPB();
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: Partial<Pick<AuthUser, "name" | "workshop_name" | "phone" | "address" | "location_lat" | "location_lng">>) => {
      const updated = await pb.collection("users").update(user!.id, data);
      return updated as unknown as AuthUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Profil berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error("Gagal memperbarui profil: " + error.message);
    },
  });
}
