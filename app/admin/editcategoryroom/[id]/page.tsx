"use client";

import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../../component/ui/Button";
import { TextField } from "../../../component/ui/Field";
import { PageShell, PageHeader } from "../../../component/ui/Layout";
import { ErrorState, Skeleton } from "../../../component/ui/Data";
import { useToast } from "../../../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { CategoryRoom } from "@/lib/types";

export default function EditCategoryRoom() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await axios.get<CategoryRoom>(`/api/categoryroom/${id}`);
      setName(res.data.name);
    } catch (err) {
      setLoadError(errorMessage(err, "ไม่พบประเภทของสถานที่นี้"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("กรอกชื่อประเภทของสถานที่");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await axios.put(`/api/categoryroom/${id}`, { name: name.trim() });
      toast.success("บันทึกการแก้ไขแล้ว");
      router.push("/admin");
    } catch (err) {
      setError("ชื่อประเภทนี้มีอยู่แล้ว ใช้ชื่ออื่นแทน");
      toast.error(errorMessage(err, "บันทึกการแก้ไขไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-44 w-full" />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell width="form">
        <ErrorState
          title="ไม่พบประเภทของสถานที่นี้"
          description={loadError}
          action={
            <ButtonLink href="/admin" variant="primary">
              กลับไปหน้าจัดการทะเบียน
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
          { label: "จัดการทะเบียน", href: "/admin" },
          { label: "แก้ไขประเภทของสถานที่" },
        ]}
        code={`#${id}`}
        title={`แก้ไขประเภท ${name}`}
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <TextField
          label="ชื่อประเภทของสถานที่"
          required
          value={name}
          error={error || undefined}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-6 flex flex-col gap-2 border-t border-edge pt-5 sm:flex-row">
          <Button type="submit" variant="primary" loading={saving}>
            บันทึกการแก้ไข
          </Button>
          <ButtonLink href="/admin">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
