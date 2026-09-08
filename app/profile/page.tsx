"use client";

import axios from "axios";
import bcrypt from "bcryptjs";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "../component/ui/Button";
import { TextField } from "../component/ui/Field";
import { PageShell, PageHeader } from "../component/ui/Layout";
import { ErrorState, Skeleton, StatusChip } from "../component/ui/Data";
import { IconEdit, IconLock, IconLogout } from "../component/ui/icons";
import { useToast } from "../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { AppUser } from "@/lib/types";

type Draft = Pick<AppUser, "name" | "surname" | "email" | "tel">;

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [user, setUser] = useState<AppUser | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [draft, setDraft] = useState<Draft>({
    name: "",
    surname: "",
    email: "",
    tel: "",
  });

  const fetchUser = async () => {
    if (!session?.user?.username) return;
    try {
      const res = await axios.get<AppUser>(`/api/auth/signup/${session.user.username}`);
      if (res.data) {
        setUser(res.data);
        setDraft({
          name: res.data.name ?? "",
          surname: res.data.surname ?? "",
          email: res.data.email ?? "",
          tel: res.data.tel ?? "",
        });
      }
    } catch (err) {
      setLoadError(errorMessage(err, "โหลดข้อมูลผู้ใช้ไม่สำเร็จ"));
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username) fetchUser();
    if (status === "unauthenticated") router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.username]);

  const handleUpdate = async () => {
    if (!session?.user?.username || !user) return;
    if (!password) {
      setFormError("กรอกรหัสผ่านปัจจุบันเพื่อยืนยันว่าเป็นเจ้าของบัญชี");
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.password ?? "");
      if (!isPasswordCorrect) {
        setFormError("รหัสผ่านไม่ถูกต้อง");
        return;
      }

      const payload = { ...user, ...draft };
      const res = await axios.put(`/api/auth/signup/${session.user.username}`, payload);

      if (res.status === 200) {
        setUser(payload);
        setIsEditing(false);
        await update({ user: { ...session.user, ...draft } });

        // เข้าสู่ระบบซ้ำเพื่อให้ session ถือข้อมูลชุดใหม่
        const response = await signIn("credentials", {
          redirect: false,
          username: session.user.username,
          password,
        });

        if (response?.error) {
          toast.error("บันทึกข้อมูลแล้ว แต่รีเฟรชเซสชันไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่");
        } else {
          toast.success("บันทึกข้อมูลส่วนตัวแล้ว");
        }
        setPassword("");
      }
    } catch (err) {
      setFormError(errorMessage(err, "บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"));
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-72 w-full" />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell width="form">
        <ErrorState
          title="โหลดข้อมูลผู้ใช้ไม่สำเร็จ"
          description={loadError}
          action={
            <Button variant="primary" onClick={fetchUser}>
              ลองอีกครั้ง
            </Button>
          }
        />
      </PageShell>
    );
  }

  const fullName = [user?.name, user?.surname].filter(Boolean).join(" ") || "ยังไม่ได้กรอกชื่อ";

  return (
    <PageShell width="form">
      <PageHeader
        trail={[{ label: "หน้าแรก", href: "/" }, { label: "โปรไฟล์" }]}
        code={session?.user?.username}
        title={fullName}
        meta={
          <span className="flex flex-wrap items-center gap-2">
            <StatusChip tone="neutral">
              {user?.role === "admin" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
            </StatusChip>
            <span>ชื่อจริงจะไปปรากฏบนรายการยืมของคุณ</span>
          </span>
        }
        actions={
          !isEditing && (
            <Button icon={<IconEdit size={16} />} onClick={() => setIsEditing(true)}>
              แก้ไขข้อมูล
            </Button>
          )
        }
      />

      <div className="plate px-4 py-5 sm:px-6 sm:py-6">
        {!user ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : isEditing ? (
          <div className="space-y-4">
            <div className="rounded border border-edge bg-sunk px-3 py-2.5">
              <p className="text-meta text-ink-3">ชื่อผู้ใช้</p>
              <p className="font-mono text-base text-ink">{user.username}</p>
              <p className="mt-1 text-meta text-ink-3">
                เปลี่ยนชื่อผู้ใช้ได้โดยแจ้งแอดมินพัสดุ
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="ชื่อจริง"
                value={draft.name ?? ""}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                autoComplete="given-name"
              />
              <TextField
                label="นามสกุล"
                value={draft.surname ?? ""}
                onChange={(e) => setDraft({ ...draft, surname: e.target.value })}
                autoComplete="family-name"
              />
              <TextField
                label="อีเมล"
                type="email"
                value={draft.email ?? ""}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                autoComplete="email"
              />
              <TextField
                label="เบอร์โทรศัพท์"
                type="tel"
                inputMode="tel"
                value={draft.tel ?? ""}
                onChange={(e) => setDraft({ ...draft, tel: e.target.value })}
                autoComplete="tel"
              />
            </div>

            <div className="border-t border-edge pt-4">
              <TextField
                label="รหัสผ่านปัจจุบัน"
                type="password"
                autoComplete="current-password"
                hint="ยืนยันว่าเป็นเจ้าของบัญชีก่อนบันทึก"
                error={formError || undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 pt-1 sm:flex-row">
              <Button variant="primary" loading={saving} onClick={handleUpdate}>
                บันทึกการเปลี่ยนแปลง
              </Button>
              <Button
                disabled={saving}
                onClick={() => {
                  setIsEditing(false);
                  setPassword("");
                  setFormError("");
                  setDraft({
                    name: user.name ?? "",
                    surname: user.surname ?? "",
                    email: user.email ?? "",
                    tel: user.tel ?? "",
                  });
                }}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        ) : (
          <dl className="divide-y divide-edge">
            <Row label="ชื่อผู้ใช้" value={<span className="font-mono">{user.username}</span>} />
            <Row label="ชื่อจริง" value={user.name || "—"} />
            <Row label="นามสกุล" value={user.surname || "—"} />
            <Row label="อีเมล" value={user.email || "—"} />
            <Row
              label="เบอร์โทรศัพท์"
              value={user.tel ? <span className="font-mono">{user.tel}</span> : "—"}
            />
          </dl>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <ButtonLink href="/profile/changepassword" icon={<IconLock size={16} />}>
          เปลี่ยนรหัสผ่าน
        </ButtonLink>
        <ButtonLink href="/profile/history">สถานะการยืมของฉัน</ButtonLink>
        <Button
          icon={<IconLogout size={16} />}
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="sm:ml-auto"
        >
          ออกจากระบบ
        </Button>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-meta text-ink-3">{label}</dt>
      <dd className="text-right text-base text-ink">{value}</dd>
    </div>
  );
}
