/** รูปแบบข้อมูลกลางของทั้งระบบ — วันที่ ตัวเลข และคำสถานะ ต้องเหมือนกันทุกหน้า */

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return typeof value === "string" ? value : "—";
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** วันที่สำหรับไฟล์ Excel — คงรูปแบบเดิมที่โรงเรียนใช้อยู่ */
export function formatDateForSheet(value?: string | Date | null): string {
  if (!value) return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return typeof value === "string" ? value : "-";
  return d.toLocaleDateString("th-TH");
}

export function formatNumber(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString("th-TH");
}

/** w = รอตรวจสอบ, c = ตรวจสอบแล้ว */
export function statusLabel(status: string | null | undefined): string {
  return status === "c" ? "ตรวจสอบแล้ว" : "รอตรวจสอบ";
}

/** ดึงข้อความผิดพลาดที่อ่านรู้เรื่องออกจาก error ของ axios */
export function errorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const anyErr = error as {
      response?: { data?: { message?: string; error?: string } };
      message?: string;
    };
    // ใช้เฉพาะ message ที่เขียนมาให้คนอ่าน ส่วน error เป็นข้อความทางเทคนิคของเซิร์ฟเวอร์
    // จึงส่งไปที่ console แทนที่จะเอาขึ้นหน้าจอให้เจ้าหน้าที่อ่าน
    const humanMessage = anyErr.response?.data?.message;
    if (typeof humanMessage === "string" && humanMessage.trim()) return humanMessage;
    if (typeof console !== "undefined") console.error(error);
  }
  return fallback;
}
