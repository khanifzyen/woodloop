"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useRegister } from "@/lib/hooks/use-auth";
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
import { Loader2, UserPlus, ChevronLeft, ChevronRight, Check } from "lucide-react";

const ROLE_DEFINITIONS = [
  {
    id: "supplier" as const,
    label: "Supplier",
    desc: "Pedagang kayu — pemasok kayu gelondongan",
    icon: "🪵",
  },
  {
    id: "generator" as const,
    label: "Generator",
    desc: "Pengrajin/Sawmill — penghasil limbah kayu",
    icon: "🏭",
  },
  {
    id: "aggregator" as const,
    label: "Aggregator",
    desc: "Pengepul/Logistik — jemput dan sortir limbah",
    icon: "🚚",
  },
  {
    id: "converter" as const,
    label: "Converter",
    desc: "Pengrajin kreatif — ubah limbah jadi produk",
    icon: "🎨",
  },
  {
    id: "enabler" as const,
    label: "Enabler",
    desc: "Pemerintah/Asosiasi — pantau dampak lingkungan",
    icon: "📊",
  },
  {
    id: "buyer" as const,
    label: "Buyer",
    desc: "Konsumen akhir — beli produk daur ulang",
    icon: "🛍️",
  },
];

const TOTAL_STEPS = 3;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<RegisterFormData["role"] | null>(null);
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

  function canProceedStep1() {
    const { email, password, name } = form.getValues();
    return email.length > 0 && password.length >= 6 && name.length > 0;
  }

  function handleRoleSelect(role: RegisterFormData["role"]) {
    setSelectedRole(role);
    form.setValue("role", role);
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

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-heading">Daftar Akun</CardTitle>
        <CardDescription>
          Bergabung dengan ekosistem WoodLoop
        </CardDescription>

        {/* Stepper */}
        <div className="mt-4 space-y-2">
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>
              Data Diri
            </span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>
              Pilih Peran
            </span>
            <span className={step >= 3 ? "text-primary font-medium" : ""}>
              Lengkapi
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
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          autoComplete="email"
                          {...field}
                        />
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
                        <Input
                          type="password"
                          placeholder="Minimal 6 karakter"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2: Pilih Peran */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {ROLE_DEFINITIONS.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id)}
                    className={`
                      relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 text-center
                      transition-all duration-200 hover:shadow-md
                      ${
                        selectedRole === role.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-muted-foreground/30"
                      }
                    `}
                  >
                    {selectedRole === role.id && (
                      <span className="absolute top-2 right-2 text-primary">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                    <span className="text-2xl">{role.icon}</span>
                    <span className="font-medium text-sm">{role.label}</span>
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      {role.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: Detail Peran */}
            {step === 3 && (
              <>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-center">
                  <span className="text-2xl mr-2">
                    {ROLE_DEFINITIONS.find((r) => r.id === selectedRole)?.icon}
                  </span>
                  <span className="font-medium text-primary">
                    {ROLE_DEFINITIONS.find((r) => r.id === selectedRole)?.label}
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Telepon (opsional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="0812-3456-7890"
                          {...field}
                        />
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
                        {selectedRole === "buyer"
                          ? "Nama (opsional)"
                          : "Nama Perusahaan/Bengkel (opsional)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            selectedRole === "buyer"
                              ? "Nama lengkap"
                              : "Nama bengkel/perusahaan"
                          }
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
              )}

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1"
                  disabled={step === 1 ? !canProceedStep1() : !selectedRole}
                >
                  Lanjut
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Daftar
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Sudah punya akun? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Masuk
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
