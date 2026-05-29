"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore, type AuthUser } from "@/lib/stores/auth-store";
import { getPB } from "@/lib/pocketbase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";
import { setAuthCookie } from "./use-auth-cookie";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const pb = getPB();
      const authData = await pb.collection("users").authWithPassword(data.email, data.password);
      const user = authData.record as unknown as AuthUser;
      return { user, token: authData.token };
    },
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      setAuthCookie(token, user.role);
      toast.success(`Selamat datang, ${user.name}!`);
      router.push(`/${user.role}/dashboard`);
    },
    onError: (error: Error) => {
      toast.error(`${error.message || "Email atau password salah"}\n\nPeriksa kembali email dan password Anda`);
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const pb = getPB();
      await pb.collection("users").create({
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        name: data.name,
        role: data.role,
        phone: data.phone || "",
        workshop_name: data.workshop_name || "",
        is_verified: false,
      });
      const authData = await pb.collection("users").authWithPassword(data.email, data.password);
      const user = authData.record as unknown as AuthUser;
      return { user, token: authData.token };
    },
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      setAuthCookie(token, user.role);
      toast.success("Akun berhasil dibuat!");
      router.push(`/${user.role}/dashboard`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mendaftar");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const pb = getPB();
      await pb.collection("users").requestPasswordReset(email);
    },
    onSuccess: () => {
      toast.success("Cek email Anda untuk instruksi reset password");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Gagal mengirim email reset");
    },
  });
}
