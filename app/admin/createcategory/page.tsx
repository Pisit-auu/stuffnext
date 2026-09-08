"use client";

import axios from "axios";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../component/ui/Button";
import { TextField } from "../../component/ui/Field";
import { PageShell, PageHeader } from "../../component/ui/Layout";
import { useToast } from "../../component/ui/Toast";
import { errorMessage } from "@/lib/format";

export default function CreateCategory() {
  const router = useRouter();
  const toast = useToast();
  const [idname, setIdname] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!idname.trim()) nextErrors.idname = "กรอกรหัสตัวแรกของประเภท";
    if (!name.trim()) nextErrors.name = "กรอกชื่อประเภทครุภัณฑ์";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await axios.post("/api/category", { idname: idname.trim(), name: name.trim() });
      toast.success(`เพิ่มประเภท ${name.trim()} แล้ว`);
      router.push("/admin");
    } catch (err) {
      setErrors({ idname: "รหัสตัวแรกนี้ถูกใช้ไปแล้ว ใช้รหัสอื่นแทน" });
      toast.error(errorMessage(err, "เพิ่มประเภทครุภัณฑ์ไม่สำเร็จ"));
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
          { label: "เพิ่มประเภทครุภัณฑ์" },
        ]}
        title="เพิ่มประเภทครุภัณฑ์"
        meta="ประเภทใช้จัดกลุ่มครุภัณฑ์ และเป็นตัวกรองในหน้าค้นหา"
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <div className="space-y-4">
          <TextField
            label="รหัสตัวแรกของประเภท"
            required
            value={idname}
            error={errors.idname}
            hint="เช่น ก, ข, ค — ต้องไม่ซ้ำกับประเภทอื่น"
            onChange={(e) => setIdname(e.target.value)}
            className="font-mono"
          />
          <TextField
            label="ชื่อประเภทครุภัณฑ์"
            required
            value={name}
            error={errors.name}
            placeholder="เช่น การศึกษา, สำนักงาน"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-edge pt-5 sm:flex-row">
          <Button type="submit" variant="primary" loading={saving}>
            เพิ่มประเภท
          </Button>
          <ButtonLink href="/admin">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
