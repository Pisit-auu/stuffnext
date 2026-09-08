"use client";

import axios from "axios";
import { useId, useRef, useState } from "react";
import { Button } from "./Button";
import { IconImage, IconTrash, IconUpload } from "./icons";
import { useToast } from "./Toast";
import { errorMessage } from "@/lib/format";

/**
 * อัปโหลดรูปครุภัณฑ์ — เลือกไฟล์แล้วอัปโหลดทันที
 * เดิมต้องกดปุ่มอัปโหลดอีกครั้ง ทำให้บันทึกไปโดยไม่มีรูปได้ง่าย
 */
export function ImageUpload({
  value,
  onChange,
  label = "รูปภาพครุภัณฑ์",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/uploadimg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        onChange(res.data.url);
        toast.success("อัปโหลดรูปแล้ว");
      } else {
        toast.error("เซิร์ฟเวอร์ไม่ได้ส่งลิงก์รูปกลับมา");
      }
    } catch (err) {
      toast.error(errorMessage(err, "อัปโหลดรูปไม่สำเร็จ"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <span className="block text-meta font-medium text-ink-2">{label}</span>

      <div className="flex items-start gap-3">
        <div className="plate h-24 w-20 shrink-0 overflow-hidden p-1">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="ตัวอย่างรูปที่อัปโหลด" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-sunk text-ink-3">
              <IconImage size={18} />
              <span className="text-[0.6875rem]">ไม่มีรูป</span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              icon={<IconUpload size={15} />}
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? "กำลังอัปโหลด..." : value ? "เปลี่ยนรูป" : "เลือกรูปจากเครื่อง"}
            </Button>
            {value && !uploading && (
              <Button
                type="button"
                size="sm"
                variant="danger"
                icon={<IconTrash size={15} />}
                onClick={() => onChange("")}
              >
                เอารูปออก
              </Button>
            )}
          </div>
          <p className="mt-2 text-meta text-ink-3">
            รูปจะถูกอัปโหลดทันทีที่เลือกไฟล์ รองรับไฟล์ภาพทั่วไป
          </p>
        </div>
      </div>
    </div>
  );
}
