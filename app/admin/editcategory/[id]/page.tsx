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
import type { Category } from "@/lib/types";

export default function EditCategory() {
  const { id } = useParams() as { id: string };
  const categoryId = decodeURIComponent(id);
  const router = useRouter();
  const toast = useToast();

  const [idname, setIdname] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await axios.get<Category>(`/api/category/${categoryId}`);
      setIdname(res.data.idname);
      setName(res.data.name);
    } catch (err) {
      setLoadError(errorMessage(err, "ไม่พบประเภทครุภัณฑ์นี้"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!idname.trim()) nextErrors.idname = "กรอกรหัสตัวแรกของประเภท";
    if (!name.trim()) nextErrors.name = "กรอกชื่อประเภทครุภัณฑ์";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.put(`/api/category/${categoryId}`, {
        idname: idname.trim(),
        name: name.trim(),
      });
      toast.success("บันทึกการแก้ไขแล้ว");
      router.push("/admin");
    } catch (err) {
      setErrors({ idname: "รหัสตัวแรกนี้ถูกใช้ไปแล้ว แก้ไขไม่ได้" });
      toast.error(errorMessage(err, "บันทึกการแก้ไขไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-56 w-full" />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell width="form">
        <ErrorState
          title="ไม่พบประเภทครุภัณฑ์นี้"
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
          { label: "แก้ไขประเภทครุภัณฑ์" },
        ]}
        code={categoryId}
        title={`แก้ไขประเภท ${name}`}
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="รหัสตัวแรกของประเภท"
            required
            value={idname}
            error={errors.idname}
            hint="ครุภัณฑ์ทุกชิ้นในประเภทนี้อ้างอิงรหัสนี้อยู่"
            onChange={(e) => setIdname(e.target.value)}
            className="font-mono"
          />
          <TextField
            label="ชื่อประเภทครุภัณฑ์"
            required
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
