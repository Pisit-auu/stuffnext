"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { Button, ButtonLink } from "../../component/ui/Button";
import { TextField } from "../../component/ui/Field";
import { PageShell, PageHeader } from "../../component/ui/Layout";
import { EmptyState, Skeleton } from "../../component/ui/Data";
import { IconAlert, IconLock } from "../../component/ui/icons";
import { useToast } from "../../component/ui/Toast";
import { errorMessage } from "@/lib/format";

const MIN_LENGTH = 6;

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const toast = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<{ next?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    const nextErrors: { next?: string; confirm?: string } = {};
    if (newPassword.length < MIN_LENGTH) {
      nextErrors.next = `รหัสผ่านใหม่ต้องยาวอย่างน้อย ${MIN_LENGTH} ตัวอักษร`;
    }
    if (newPassword !== confirmPassword) {
      nextErrors.confirm = "รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน";
    }
    setFieldError(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setError("");
    try {
      const res = await axios.put(`/api/auth/changeps/${session.user.username}`, {
        oldPassword,
        newPassword,
      });

      if (res.status === 200) {
        toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
        router.push("/profile");
      } else {
        setError("เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      setError(errorMessage(err, "รหัสผ่านเดิมไม่ถูกต้อง หรือระบบขัดข้อง"));
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (status === "unauthenticated") {
    return (
      <PageShell width="form">
        <EmptyState
          title="ยังไม่ได้เข้าสู่ระบบ"
          description="เข้าสู่ระบบก่อนจึงจะเปลี่ยนรหัสผ่านได้"
          action={
            <ButtonLink href="/login" variant="primary">
              ไปหน้าเข้าสู่ระบบ
            </ButtonLink>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell width="form">
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "โปรไฟล์", href: "/profile" },
          { label: "เปลี่ยนรหัสผ่าน" },
        ]}
        code={session?.user?.username}
        title="เปลี่ยนรหัสผ่าน"
        meta={`รหัสผ่านใหม่ต้องยาวอย่างน้อย ${MIN_LENGTH} ตัวอักษร`}
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="mb-5 flex items-center gap-2.5 text-ink-2">
          <IconLock size={18} />
          <p className="text-base">กรอกรหัสผ่านเดิมหนึ่งครั้ง แล้วตั้งรหัสใหม่</p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded border border-alert/40 bg-alert-soft px-3 py-2.5 text-base text-alert"
          >
            <IconAlert size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <TextField
            label="รหัสผ่านเดิม"
            type="password"
            autoComplete="current-password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="รหัสผ่านใหม่"
            type="password"
            autoComplete="new-password"
            required
            error={fieldError.next}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            autoComplete="new-password"
            required
            error={fieldError.confirm}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button type="submit" variant="primary" loading={saving}>
            เปลี่ยนรหัสผ่าน
          </Button>
          <ButtonLink href="/profile">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
