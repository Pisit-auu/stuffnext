"use client";

import axios from "axios";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../component/ui/Button";
import { TextField } from "../../component/ui/Field";
import { PageShell, PageHeader } from "../../component/ui/Layout";
import { useToast } from "../../component/ui/Toast";
import { errorMessage } from "@/lib/format";

export default function CreateCategoryRoom() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("กรอกชื่อประเภทของสถานที่");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await axios.post("/api/categoryroom", { name: name.trim() });
      toast.success(`เพิ่มประเภท ${name.trim()} แล้ว`);
      router.push("/admin");
    } catch (err) {
      setError("ชื่อประเภทนี้มีอยู่แล้ว ใช้ชื่ออื่นแทน");
      toast.error(errorMessage(err, "เพิ่มประเภทของสถานที่ไม่สำเร็จ"));
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
          { label: "เพิ่มประเภทของสถานที่" },
        ]}
        title="เพิ่มประเภทของสถานที่"
        meta="ใช้จัดกลุ่มห้อง เช่น ห้องเรียน ห้องปฏิบัติการ ห้องพักครู"
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        <TextField
          label="ชื่อประเภทของสถานที่"
          required
          value={name}
          error={error || undefined}
          placeholder="เช่น ห้องเรียน"
          onChange={(e) => setName(e.target.value)}
        />

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
