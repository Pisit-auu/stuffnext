"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../component/ui/Button";
import { TextField } from "../component/ui/Field";
import { IconAlert, IconChevronLeft, IconLock } from "../component/ui/icons";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignInSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("กรอกทั้งชื่อผู้ใช้และรหัสผ่านก่อนเข้าสู่ระบบ");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        setErrorMessage("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง ลองพิมพ์ใหม่อีกครั้ง");
      } else {
        router.push("/");
      }
    } catch {
      setErrorMessage("เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* ด้านซ้าย — หน้าตู้ */}
      <section className="flex flex-col justify-between bg-rail px-6 py-8 sm:px-10 lg:py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 self-start rounded text-meta text-ink-rail-2 transition-colors hover:text-ink-rail"
        >
          <IconChevronLeft size={15} />
          กลับหน้าแรก
        </Link>

        <div className="py-10 lg:py-0">
          <span className="mb-6 inline-flex h-9 items-center border border-white/25 px-2.5 font-mono text-sm tracking-[0.14em] text-ink-rail">
            SNK
          </span>
          <h1 className="text-[2rem] font-semibold leading-tight text-ink-rail sm:text-[2.5rem]">
            ทะเบียนครุภัณฑ์
          </h1>
          <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-rail-2">
            เข้าสู่ระบบเพื่อยืม-คืนครุภัณฑ์ ดูสถานะรายการของคุณ
            และจัดการทะเบียนของโรงเรียน
          </p>
        </div>

        <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-ink-rail-2">
          Srinakarin Wittayanukhro School
        </p>
      </section>

      {/* ด้านขวา — แผ่นป้ายกรอกข้อมูล */}
      <section className="flex items-center justify-center bg-ground px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <form onSubmit={handleSignInSubmit} className="plate px-5 py-6 sm:px-7 sm:py-8" noValidate>
            <div className="mb-6 flex items-start gap-3">
              <span className="mt-0.5 text-ink-3">
                <IconLock size={20} />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-ink">เข้าสู่ระบบ</h2>
                <p className="mt-1 text-base text-ink-2">
                  ใช้ชื่อผู้ใช้ที่แอดมินพัสดุออกให้
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 rounded border border-alert/40 bg-alert-soft px-3 py-2.5 text-base text-alert"
              >
                <IconAlert size={17} className="mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <TextField
                label="ชื่อผู้ใช้"
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="รหัสผ่าน"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              block
              loading={loading}
              className="mt-7 h-11"
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </Button>

            <p className="mt-5 border-t border-edge pt-4 text-meta text-ink-3">
              ลืมรหัสผ่าน หรือยังไม่มีบัญชี ติดต่อเจ้าหน้าที่พัสดุเพื่อออกรหัสใหม่
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
