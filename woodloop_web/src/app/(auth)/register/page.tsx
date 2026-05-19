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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";

const ROLE_INFO: Record<string, { label: string; icon: string }> = {
  supplier: { label: "Supplier", icon: "🪵" },
  generator: { label: "Generator", icon: "🏭" },
  aggregator: { label: "Aggregator", icon: "🚚" },
  converter: { label: "Converter", icon: "🎨" },
  enabler: { label: "Enabler", icon: "📊" },
  buyer: { label: "Buyer", icon: "🛍️" },
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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-heading">Daftar Akun</CardTitle>
        <CardDescription>Bergabung dengan ekosistem WoodLoop</CardDescription>

        {/* Role badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
          <span>{roleDisplay.icon}</span>
          <span className="font-medium">{roleDisplay.label}</span>
        </div>

        {/* Stepper */}
        <div className="mt-4 space-y-2">
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>
              Data Diri
            </span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>
              Detail {roleDisplay.label}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Data Diri */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Anda" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="nama@email.com" autoComplete="email" {...field} />
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
                      <FormLabel>Kata Sandi</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Minimal 6 karakter" autoComplete="new-password" {...field} />
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
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-center">
                  <span className="text-2xl mr-2">{roleDisplay.icon}</span>
                  <span className="font-medium text-primary">{roleDisplay.label}</span>
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon (opsional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="0812-3456-7890" {...field} />
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
                      <FormLabel>
                        {roleFromUrl === "buyer" ? "Nama (opsional)" : "Nama Perusahaan/Bengkel (opsional)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={roleFromUrl === "buyer" ? "Nama lengkap" : "Nama bengkel/perusahaan"}
                          {...field}
                        />
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
                <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
                  <ChevronLeft className="mr-2 h-4 w-4" />Kembali
                </Button>
              )}
              {step < TOTAL_STEPS ? (
                <Button type="button" onClick={nextStep} className="flex-1" disabled={!canProceedStep1()}>
                  Lanjut<ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftar...</>
                  ) : (
                    <><UserPlus className="mr-2 h-4 w-4" />Daftar</>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Salah pilih peran? </span>
          <Link href="/role-selection" className="text-primary hover:underline font-medium">Pilih ulang</Link>
        </div>
      </CardContent>
    </Card>
  );
}
