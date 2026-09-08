"use client";

import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../../component/ui/Button";
import { SelectField, TextField } from "../../../component/ui/Field";
import { ImageUpload } from "../../../component/ui/ImageUpload";
import { PageShell, PageHeader } from "../../../component/ui/Layout";
import { ErrorState, Skeleton } from "../../../component/ui/Data";
import { useToast } from "../../../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { Asset, Category } from "@/lib/types";

export default function EditAsset() {
  const { id } = useParams() as { id: string };
  const assetId = decodeURIComponent(id);
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [assetCode, setAssetCode] = useState("");
  const [img, setImg] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availableValue, setAvailableValue] = useState("0");
  const [unavailableValue, setUnavailableValue] = useState("0");
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [assetRes, categoryRes] = await Promise.all([
        axios.get<Asset>(`/api/asset/${assetId}`),
        axios.get<Category[]>("/api/category"),
      ]);
      const asset = assetRes.data;
      setName(asset.name);
      setAssetCode(asset.assetid);
      setImg(asset.img ?? "");
      setCategoryId(asset.category?.idname ?? asset.categoryId);
      setAvailableValue(String(asset.availableValue));
      setUnavailableValue(String(asset.unavailableValue));
      setCategories(categoryRes.data);
    } catch (err) {
      setLoadError(errorMessage(err, "ไม่พบครุภัณฑ์รหัสนี้"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "กรอกชื่อครุภัณฑ์";
    if (!assetCode.trim()) nextErrors.assetid = "กรอกรหัสครุภัณฑ์";
    if (!categoryId) nextErrors.category = "เลือกประเภทครุภัณฑ์";
    const available = Number(availableValue);
    const unavailable = Number(unavailableValue);
    if (!Number.isFinite(available) || available < 0)
      nextErrors.available = "จำนวนต้องเป็นตัวเลขที่ไม่ติดลบ";
    if (!Number.isFinite(unavailable) || unavailable < 0)
      nextErrors.unavailable = "จำนวนต้องเป็นตัวเลขที่ไม่ติดลบ";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.put(`/api/asset/${assetId}`, {
        name: name.trim(),
        img,
        assetid: assetCode.trim(),
        categoryId,
        availableValue: available,
        unavailableValue: unavailable,
      });
      toast.success("บันทึกการแก้ไขแล้ว");
      router.push("/admin");
    } catch (err) {
      setErrors({ assetid: "รหัสครุภัณฑ์นี้ถูกใช้ไปแล้ว แก้ไขไม่ได้" });
      toast.error(errorMessage(err, "บันทึกการแก้ไขไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell width="form">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </PageShell>
    );
  }

  if (loadError) {
    return (
      <PageShell width="form">
        <ErrorState
          title="ไม่พบครุภัณฑ์รหัสนี้"
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
          { label: "แก้ไขครุภัณฑ์" },
        ]}
        code={assetId}
        title={`แก้ไข ${name}`}
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="ชื่อครุภัณฑ์"
            required
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="รหัสครุภัณฑ์"
            required
            value={assetCode}
            error={errors.assetid}
            hint="เปลี่ยนรหัสจะกระทบการอ้างอิงของชิ้นนี้ทั้งระบบ"
            onChange={(e) => setAssetCode(e.target.value)}
            className="font-mono"
          />
          <SelectField
            label="ประเภทครุภัณฑ์"
            required
            value={categoryId}
            error={errors.category}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">เลือกประเภทครุภัณฑ์</option>
            {categories.map((c) => (
              <option key={c.idname} value={c.idname}>
                {c.name}
              </option>
            ))}
          </SelectField>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="จำนวนที่พร้อมใช้งาน (ในคลังกลาง)"
              type="number"
              inputMode="numeric"
              min={0}
              required
              value={availableValue}
              error={errors.available}
              onChange={(e) => setAvailableValue(e.target.value)}
            />
            <TextField
              label="จำนวนที่ไม่พร้อมใช้งาน (ในคลังกลาง)"
              type="number"
              inputMode="numeric"
              min={0}
              required
              value={unavailableValue}
              error={errors.unavailable}
              onChange={(e) => setUnavailableValue(e.target.value)}
            />
          </div>

          <ImageUpload value={img} onChange={setImg} />
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
