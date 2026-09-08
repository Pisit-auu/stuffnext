"use client";

import axios from "axios";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "../../../component/ui/Button";
import { TextField } from "../../../component/ui/Field";
import { PageShell, PageHeader } from "../../../component/ui/Layout";
import { IconAlert } from "../../../component/ui/icons";
import { useToast } from "../../../component/ui/Toast";
import { errorMessage } from "@/lib/format";

const MIN_PASSWORD = 6;

export default function SignUpUser() {
  const router = useRouter();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!username.trim()) nextErrors.username = "กรอกชื่อผู้ใช้";
    if (password.length < MIN_PASSWORD)
      nextErrors.password = `รหัสผ่านต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัวอักษร`;
    if (!firstName.trim()) nextErrors.firstName = "กรอกชื่อจริง";
    if (!lastName.trim()) nextErrors.lastName = "กรอกนามสกุล";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setErrorMsg("");
    try {
      await axios.post("/api/auth/signup", {
        username: username.trim(),
        password,
        name: firstName.trim(),
        surname: lastName.trim(),
      });
      toast.success(`สร้างบัญชี ${username.trim()} แล้ว`);
      router.push("/admin/user");
    } catch (err) {
      setErrorMsg("สร้างบัญชีไม่สำเร็จ ชื่อผู้ใช้นี้อาจถูกใช้ไปแล้ว");
      toast.error(errorMessage(err, "สร้างบัญชีไม่สำเร็จ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell width="form">
      <PageHeader
        trail={[
          { label: "หน้าแรก", href: "/" },
          { label: "ผู้ใช้งาน", href: "/admin/user" },
          { label: "เพิ่มผู้ใช้งาน" },
        ]}
        title="เพิ่มผู้ใช้งาน"
        meta="บัญชีที่สร้างใหม่จะเป็นผู้ใช้ทั่วไป และตั้งชื่อจริงไว้ให้เรียบร้อยเพื่อให้ยืมของได้ทันที"
      />

      <form onSubmit={handleSubmit} className="plate px-4 py-5 sm:px-6 sm:py-6" noValidate>
        {errorMsg && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2 rounded border border-alert/40 bg-alert-soft px-3 py-2.5 text-base text-alert"
          >
            <IconAlert size={17} className="mt-0.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="ชื่อผู้ใช้"
            required
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            error={errors.username}
            hint="ใช้เข้าสู่ระบบ ห้ามซ้ำกับคนอื่น"
            onChange={(e) => setUsername(e.target.value)}
            className="font-mono"
          />
          <TextField
            label="รหัสผ่าน"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            error={errors.password}
            hint={`อย่างน้อย ${MIN_PASSWORD} ตัวอักษร`}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="ชื่อจริง"
            required
            value={firstName}
            error={errors.firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="นามสกุล"
            required
            value={lastName}
            error={errors.lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-edge pt-5 sm:flex-row">
          <Button type="submit" variant="primary" loading={loading}>
            สร้างบัญชีผู้ใช้
          </Button>
          <ButtonLink href="/admin/user">ยกเลิก</ButtonLink>
        </div>
      </form>
    </PageShell>
  );
}
