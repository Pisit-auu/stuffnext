// สร้าง (หรืออัปเดต) บัญชี superadmin จาก env
//   SUPERADMIN_USERNAME=... SUPERADMIN_PASSWORD=... npx prisma db seed
// ไม่มีรหัสผ่านอยู่ในโค้ด — ต้องส่งผ่าน env เท่านั้น
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const username = process.env.SUPERADMIN_USERNAME?.trim() || "superadmin";
const password = process.env.SUPERADMIN_PASSWORD;

if (!password || password.length < 12) {
  console.error("ต้องตั้ง SUPERADMIN_PASSWORD (อย่างน้อย 12 ตัวอักษร) ก่อนรัน seed");
  process.exit(1);
}

const hashed = await bcrypt.hash(password, 12);

const user = await prisma.user.upsert({
  where: { username },
  update: { password: hashed, role: "superadmin" },
  create: {
    username,
    password: hashed,
    role: "superadmin",
    name: "Super",
    surname: "Admin",
  },
  select: { id: true, username: true, role: true },
});

console.log(`superadmin พร้อมใช้งาน: ${user.username} (id ${user.id})`);
await prisma.$disconnect();
