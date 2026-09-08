"use client";

import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../component/ui/Button";
import { SelectField, TextField } from "../../component/ui/Field";
import { ImageUpload } from "../../component/ui/ImageUpload";
import { PageShell, PageHeader } from "../../component/ui/Layout";
import { useToast } from "../../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { Category } from "@/lib/types";

export default function CreateAsset() {
  const router = useRouter();
  const toast = useToast();

  const [assetid, setAssetid] = useState("");
  const [name, setName] = useState("");
  const [img, setImg] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [availableValue, setAvailableValue] = useState("0");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<Category[]>("/api/category");
        setCategories(res.data);
      } catch (err) {
        toast.error(errorMessage(err, "โหลดประเภทครุภัณฑ์ไม่สำเร็จ"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "กรอกชื่อครุภัณฑ์";
    if (!assetid.trim()) nextErrors.assetid = "กรอกรหัสครุภัณฑ์";
    if (!categoryId) nextErrors.category = "เลือกประเภทครุภัณฑ์";
    const amount = Number(availableValue);
    if (!Number.isFinite(amount) || amount < 0) {
      nextErrors.available = "จำนวนต้องเป็นตัวเลขที่ไม่ติดลบ";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.post("/api/asset", {
        name: name.trim(),
        img,
        assetid: assetid.trim(),
        categoryId,
        availableValue: amount,
        unavailableValue: 0,
      });
      toast.success(`เพิ่ม ${name.trim()} เข้าทะเบียนแล้ว`);
      router.push("/admin");
    } catch (err) {
      setErrors({ assetid: "รหัสครุภัณฑ์นี้ถูกใช้ไปแล้ว ใช้รหัสอื่นแทน" });
      toast.error(errorMessage(err, "เพิ่มครุภัณฑ์ไม่สำเร็จ"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell width="form">
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "จัดการทะเบียน", href: "/admin" },
          { label: "เพิ่มครุภัณฑ์" },
        ]}
        title="เพิ่มครุภัณฑ์"
        meta="ของที่เพิ่มใหม่จะอยู่ในคลังกลางก่อน แล้วค่อยจัดเข้าห้องทีหลัง"
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="ชื่อครุภัณฑ์"
            required
            value={name}
            error={errors.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น โต๊ะทำงานไม้"
          />
          <TextField
            label="รหัสครุภัณฑ์"
            required
            value={assetid}
            error={errors.assetid}
            hint="รหัสนี้ต้องไม่ซ้ำกับของชิ้นอื่น และใช้อ้างอิงทั้งระบบ"
            onChange={(e) => setAssetid(e.target.value)}
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
          <TextField
            label="จำนวนที่พร้อมใช้งาน"
            type="number"
            inputMode="numeric"
            min={0}
            required
            value={availableValue}
            error={errors.available}
            onChange={(e) => setAvailableValue(e.target.value)}
          />
          <ImageUpload value={img} onChange={setImg} />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-edge pt-5 sm:flex-row">
          <Button type="submit" variant="primary" loading={saving}>
            เพิ่มเข้าทะเบียน
          </Button>
          <ButtonLink href="/admin">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
