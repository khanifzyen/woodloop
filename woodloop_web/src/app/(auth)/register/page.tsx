"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useRegister } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Check,
  UserCircle,
} from "lucide-react";

const ROLE_INFO: Record<string, { label: string; icon: string }> = {
  supplier: { label: "Supplier", icon: "🪵" },
  generator: { label: "Generator", icon: "🏭" },
  aggregator: { label: "Aggregator", icon: "🚚" },
  converter: { label: "Converter", icon: "🎨" },
  enabler: { label: "Enabler", icon: "📊" },
  buyer: { label: "Buyer", icon: "🛍️" },
  designer: { label: "Desainer", icon: "✏️" },
};

const TOTAL_STEPS = 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: undefined,
      phone: "",
      workshop_name: "",
    },
  });

  // Baca role dari URL di client (works with static pages)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    setRoleFromUrl(role);

    if (role && ROLE_INFO[role]) {
      form.setValue("role", role as RegisterFormData["role"]);
      setIsReady(true);
    } else {
      router.replace("/role-selection");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function canProceedStep1() {
    const { email, password, name } = form.getValues();
    return email.length > 0 && password.length >= 6 && name.length > 0;
  }

  function nextStep() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
  }

  function prevStep() {
    if (step > 1) setStep((s) => s - 1);
  }

  function onSubmit(data: RegisterFormData) {
    registerMutation.mutate(data);
  }

  if (!isReady || !roleFromUrl || !ROLE_INFO[roleFromUrl]) {
    return null;
  }

  const roleDisplay = ROLE_INFO[roleFromUrl];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl shadow-lg shadow-primary/25">
          {roleDisplay.icon}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-bold tracking-tight">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Bergabung dengan ekosistem WoodLoop
          </p>
        </div>

        {/* Role badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          <UserCircle className="h-3 w-3" />
          Daftar sebagai <strong>{roleDisplay.label}</strong>
        </div>
      </div>

      {/* Stepper */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 1 ? <Check className="h-3 w-3" /> : "1"}
            </span>
            <span className={step >= 1 ? "text-foreground" : "text-muted-foreground"}>
              Data Diri
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? "text-foreground" : "text-muted-foreground"}>
              Detail {roleDisplay.label}
            </span>
          </div>
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Step 1: Data Diri */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nama Lengkap
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Nama Anda"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="nama@email.com"
                            autoComplete="email"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Kata Sandi
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Minimal 6 karakter"
                            autoComplete="new-password"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2: Detail Peran */}
            {step === 2 && (
              <>
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center">
                  <span className="text-3xl mr-2">{roleDisplay.icon}</span>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Lengkapi detail untuk{" "}
                    <span className="text-primary">{roleDisplay.label}</span>
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nomor Telepon (opsional)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="0812-3456-7890"
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workshop_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {roleFromUrl === "buyer"
                          ? "Nama (opsional)"
                          : "Nama Perusahaan/Bengkel (opsional)"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder={
                              roleFromUrl === "buyer"
                                ? "Nama lengkap"
                                : "Nama bengkel/perusahaan"
                            }
                            className="h-11 pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="h-11 flex-1"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Kembali
                </Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceedStep1()}
                  className="h-11 flex-1 bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
                >
                  Lanjut
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="h-11 flex-1 bg-gradient-to-r from-primary to-primary/85 font-semibold shadow-md shadow-primary/20"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      Daftar
                      <UserPlus className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Bottom links */}
      <div className="space-y-1 text-center text-sm">
        <p className="text-muted-foreground">
          Salah pilih peran?{" "}
          <Link
            href="/role-selection"
            className="font-medium text-primary hover:underline"
          >
            Pilih ulang
          </Link>
        </p>
        <p className="text-muted-foreground">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
