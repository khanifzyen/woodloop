"use client";

import { useState } from "react";
import { useForgotPassword } from "@/lib/hooks/use-auth";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const forgotMutation = useForgotPassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    forgotMutation.mutate(email, {
      onSuccess: () => setIsSent(true),
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-heading font-bold tracking-tight">
          Lupa Kata Sandi?
        </h1>
        <p className="text-sm text-muted-foreground">
          Tenang, kami akan bantu Anda mengatur ulang
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        {isSent ? (
          <div className="space-y-5 text-center">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 ring-4 ring-success/5">
                <CheckCircle2 className="h-9 w-9 text-success" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-semibold">
                Cek email Anda
              </h3>
              <p className="text-sm text-muted-foreground">
                Tautan reset telah dikirim ke{" "}
                <strong className="text-foreground">{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Tidak ada di inbox? Coba cek folder spam.
              </p>
            </div>

            <Link href="/login" className="block">
              <Button variant="outline" className="h-11 w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="h-11 pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Kami akan mengirim tautan untuk mengatur ulang kata sandi Anda.
              </p>
            </div>

            <Button
              type="submit"
              disabled={forgotMutation.isPending || !email}
              className="h-11 w-full bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
            >
              {forgotMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Tautan Reset"
              )}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-card px-2 text-muted-foreground tracking-wider">
                  atau
                </span>
              </div>
            </div>

            <Link href="/login">
              <Button variant="ghost" className="h-11 w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
