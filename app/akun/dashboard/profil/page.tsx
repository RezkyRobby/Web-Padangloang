"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  IdCard,
  Loader2,
  Phone,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/custom/navbar";
import { getInitials } from "@/utils/string";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  nik: string | null;
  phoneNumber: string | null;
  role: string;
}

function validateNik(value: string): string | null {
  if (!value.trim()) return null; // optional
  if (!/^\d+$/.test(value)) return "NIK hanya boleh berisi angka";
  if (value.length !== 16) return "NIK harus terdiri dari 16 digit";
  return null;
}

function validatePhone(value: string): string | null {
  if (!value.trim()) return null; // optional
  if (!/^\d+$/.test(value)) return "Nomor telepon hanya boleh berisi angka";
  if (value.length < 10 || value.length > 13)
    return "Nomor telepon harus 10-13 digit";
  return null;
}

export default function EditProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="size-10 animate-spin text-foreground/40" />
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4 text-center">
          <AlertCircle className="size-12 text-foreground/40" />
          <h2 className="text-2xl font-bold text-foreground/70">
            Silakan login terlebih dahulu
          </h2>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <EditProfileForm userId={session.user.id} userName={session.user.name} userEmail={session.user.email} userImage={session.user.image ?? undefined} />;
}

function EditProfileForm({
  userId,
  userName,
  userEmail,
  userImage,
}: {
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [nik, setNik] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nikError, setNikError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/user/profile?userId=${userId}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Gagal memuat data profil");
          return;
        }
        const profile = json as UserProfile;
        setNik(profile.nik ?? "");
        setPhoneNumber(profile.phoneNumber ?? "");
        setError(null);
      } catch {
        setError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nikErr = validateNik(nik);
    const phoneErr = validatePhone(phoneNumber);
    setNikError(nikErr);
    setPhoneError(phoneErr);

    if (nikErr || phoneErr) {
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, nik: nik.trim() || null, phoneNumber: phoneNumber.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Gagal menyimpan profil");
        return;
      }
      toast.success("Profil berhasil diperbarui");
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-24 md:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/akun/dashboard">
            <Button variant="ghost" size="icon" aria-label="Kembali">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-headline text-2xl font-bold text-foreground">
              Edit Profil
            </h1>
            <p className="text-sm text-foreground/50">
              Kelola data diri Anda
            </p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-hudson-blue/30 bg-hudson-blue/5 p-4">
          <IdCard className="mt-0.5 size-5 shrink-0 text-hudson-blue" />
          <p className="text-sm text-foreground/70">
            Data <strong>NIK</strong> dan <strong>Nomor Telepon</strong> wajib
            diisi sebelum mengajukan layanan secara online.
          </p>
        </div>

        {/* Profile card */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 ring-2 ring-background">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-foreground/20 text-base font-bold">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="font-headline">{userName}</CardTitle>
                <CardDescription>{userEmail}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-xs" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full rounded-xs" />
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <AlertCircle className="size-10 text-destructive" />
                <p className="text-sm text-foreground/60">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Coba Lagi
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* NIK */}
                <div className="space-y-2">
                  <Label htmlFor="nik" className="flex items-center gap-1.5">
                    <IdCard className="size-4 text-foreground/50" />
                    NIK
                  </Label>
                  <Input
                    id="nik"
                    type="text"
                    inputMode="numeric"
                    value={nik}
                    onChange={(e) => {
                      setNik(e.target.value);
                      if (nikError) setNikError(null);
                    }}
                    placeholder="16 digit NIK (opsional)"
                    className={nikError ? "border-destructive focus:border-destructive" : ""}
                    aria-invalid={!!nikError}
                  />
                  {nikError && (
                    <p className="text-xs text-destructive">{nikError}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="size-4 text-foreground/50" />
                    Nomor Telepon
                  </Label>
                  <Input
                    id="phone"
                    type="text"
                    inputMode="numeric"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (phoneError) setPhoneError(null);
                    }}
                    placeholder="10-13 digit nomor telepon (opsional)"
                    className={phoneError ? "border-destructive focus:border-destructive" : ""}
                    aria-invalid={!!phoneError}
                  />
                  {phoneError && (
                    <p className="text-xs text-destructive">{phoneError}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Link href="/akun/dashboard">
                    <Button type="button" variant="outline">
                      Batal
                    </Button>
                  </Link>
                  <Button type="submit" disabled={saving} className="gap-1.5">
                    {saving ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Save className="size-4" />
                    )}
                    Simpan
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}