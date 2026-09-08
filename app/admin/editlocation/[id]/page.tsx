"use client";

import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../../component/ui/Button";
import { SelectField, TextField } from "../../../component/ui/Field";
import { PageShell, PageHeader } from "../../../component/ui/Layout";
import { ErrorState, Skeleton } from "../../../component/ui/Data";
import { useToast } from "../../../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { CategoryRoom, Location } from "@/lib/types";

export default function EditLocation() {
  const { id } = useParams() as { id: string };
  const locationId = decodeURIComponent(id);
  const router = useRouter();
  const toast = useToast();

  const [namelocation, setNamelocation] = useState("");
  const [nameteacher, setNameteacher] = useState("");
  const [categoryIdroom, setCategoryIdroom] = useState("");
  const [categories, setCategories] = useState<CategoryRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [locationRes, categoryRes] = await Promise.all([
        axios.get<Location>(`/api/location/${locationId}`),
        axios.get<CategoryRoom[]>("/api/categoryroom"),
      ]);
      setNamelocation(locationRes.data.namelocation);
      setNameteacher(locationRes.data.nameteacher ?? "");
      setCategoryIdroom(
        locationRes.data.categoryIdroom ? String(locationRes.data.categoryIdroom) : "",
      );
      setCategories(categoryRes.data);
    } catch (err) {
      setLoadError(errorMessage(err, "ไม่พบสถานที่นี้"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!namelocation.trim()) nextErrors.name = "กรอกชื่อสถานที่";
    if (!nameteacher.trim()) nextErrors.teacher = "กรอกชื่อผู้รับผิดชอบ";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.put(`/api/location/${locationId}`, {
        namelocation: namelocation.trim(),
        nameteacher: nameteacher.trim(),
        categoryIdroom: categoryIdroom ? Number(categoryIdroom) : null,
      });
      toast.success("บันทึกการแก้ไขแล้ว");
      router.push("/admin");
    } catch (err) {
      setErrors({ name: "ชื่อสถานที่นี้ถูกใช้ไปแล้ว แก้ไขไม่ได้" });
      toast.error(errorMessage(err, "บันทึกการแก้ไขไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell width="form">
        <ErrorState
          title="ไม่พบสถานที่นี้"
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
          { label: "แก้ไขสถานที่" },
        ]}
        code={`ห้อง ${locationId}`}
        title={`แก้ไข ${namelocation}`}
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="ชื่อสถานที่"
            required
            value={namelocation}
            error={errors.name}
            hint="ของในห้องและประวัติการยืมอ้างอิงชื่อนี้อยู่"
            onChange={(e) => setNamelocation(e.target.value)}
          />
          <TextField
            label="ผู้รับผิดชอบสถานที่"
            required
            value={nameteacher}
            error={errors.teacher}
            onChange={(e) => setNameteacher(e.target.value)}
          />
          <SelectField
            label="ประเภทของสถานที่"
            value={categoryIdroom}
            onChange={(e) => setCategoryIdroom(e.target.value)}
          >
            <option value="">ยังไม่ระบุประเภท</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-edge pt-5 sm:flex-row">
          <Button type="submit" variant="primary" loading={saving}>
            บันทึกการแก้ไข
          </Button>
          <ButtonLink href="/admin">ยกเลิก</ButtonLink>
          <ButtonLink
            href={`/admin/manageroom/${encodeURIComponent(locationId)}`}
            className="sm:ml-auto"
          >
            จัดการของในห้องนี้
          </ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
