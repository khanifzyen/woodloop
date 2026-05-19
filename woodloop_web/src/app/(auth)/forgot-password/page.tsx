"use client";

import { useState } from "react";
import { useForgotPassword } from "@/lib/hooks/use-auth";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-heading">Lupa Kata Sandi</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk mendapatkan tautan reset
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <Alert>
              <AlertDescription>
                Email reset password telah dikirim ke <strong>{email}</strong>.
                Cek inbox (atau folder spam) Anda.
              </AlertDescription>
            </Alert>
            <Link href="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={forgotMutation.isPending || !email}
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

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-primary hover:underline inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Kembali ke Login
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
