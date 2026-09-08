"use client";

import axios from "axios";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../component/ui/Button";
import { SelectField, TextField } from "../../component/ui/Field";
import { PageShell, PageHeader } from "../../component/ui/Layout";
import { useToast } from "../../component/ui/Toast";
import { errorMessage } from "@/lib/format";
import type { CategoryRoom } from "@/lib/types";

export default function CreateLocation() {
  const router = useRouter();
  const toast = useToast();

  const [namelocation, setNamelocation] = useState("");
  const [nameteacher, setNameteacher] = useState("");
  const [categoryIdroom, setCategoryIdroom] = useState("");
  const [categories, setCategories] = useState<CategoryRoom[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<CategoryRoom[]>("/api/categoryroom");
        setCategories(res.data);
      } catch (err) {
        toast.error(errorMessage(err, "โหลดประเภทของสถานที่ไม่สำเร็จ"));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!namelocation.trim()) nextErrors.name = "กรอกชื่อสถานที่";
    if (!nameteacher.trim()) nextErrors.teacher = "กรอกชื่อผู้รับผิดชอบ";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.post("/api/location", {
        namelocation: namelocation.trim(),
        nameteacher: nameteacher.trim(),
        categoryIdroom: categoryIdroom ? Number(categoryIdroom) : null,
      });
      toast.success(`เพิ่มสถานที่ ${namelocation.trim()} แล้ว`);
      router.push("/admin");
    } catch (err) {
      setErrors({ name: "ชื่อสถานที่นี้ถูกใช้ไปแล้ว ใช้ชื่ออื่นแทน" });
      toast.error(errorMessage(err, "เพิ่มสถานที่ไม่สำเร็จ"));
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
          { label: "เพิ่มสถานที่" },
        ]}
        title="เพิ่มสถานที่"
        meta="ชื่อสถานที่ถูกใช้เป็นรหัสอ้างอิงทั้งระบบ จึงต้องไม่ซ้ำกับห้องอื่น"
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="ชื่อสถานที่"
            required
            value={namelocation}
            error={errors.name}
            placeholder="เช่น ห้อง 213 หรือ ห้องพักครูวิทยาศาสตร์"
            onChange={(e) => setNamelocation(e.target.value)}
          />
          <TextField
            label="ผู้รับผิดชอบสถานที่"
            required
            value={nameteacher}
            error={errors.teacher}
            placeholder="ชื่อครูหรือเจ้าหน้าที่ที่ดูแลห้องนี้"
            onChange={(e) => setNameteacher(e.target.value)}
          />
          <SelectField
            label="ประเภทของสถานที่"
            value={categoryIdroom}
            hint="เว้นว่างไว้ได้ แล้วมาระบุทีหลัง"
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
            เพิ่มสถานที่
          </Button>
          <ButtonLink href="/admin">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
