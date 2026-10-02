# StuffNext — ระบบบริหารจัดการครุภัณฑ์โรงเรียน

ระบบทะเบียนครุภัณฑ์ของ **โรงเรียนศรีนครินทร์วิทยานุเคราะห์** (Srinakarin Inventory) พัฒนาเป็น Full-stack Web Application ด้วย Next.js, Tailwind CSS, Prisma และ PostgreSQL

ระบบนี้บันทึกว่าครุภัณฑ์แต่ละรายการอยู่ห้องไหน มีจำนวนเท่าไร และพร้อมใช้งานกี่ชิ้น ผู้ใช้ยืมครุภัณฑ์จากห้องหนึ่งไปใช้อีกห้องหนึ่งได้ และระบบเก็บประวัติการยืม-คืนไว้ตรวจสอบย้อนหลัง

> **เป้าหมาย:** เจ้าหน้าที่ตอบคำถาม "ของชิ้นนี้อยู่ไหน / ใครเอาไป / เหลือกี่ชิ้น" ได้ในไม่กี่วินาที และปิดรายการยืม-คืนได้โดยไม่ต้องจดลงกระดาษควบคู่

---

## สารบัญ

- [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
- [ผู้ใช้งานและสิทธิ์](#ผู้ใช้งานและสิทธิ์)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [หน้าเว็บ (Routes)](#หน้าเว็บ-routes)
- [API Endpoints](#api-endpoints)
- [การ Deploy ด้วย Docker](#การ-deploy-ด้วย-docker)
- [ระบบดีไซน์](#ระบบดีไซน์)

---

## ฟีเจอร์หลัก

### สำหรับผู้ใช้ทั่วไป
- **เข้าสู่ระบบ** ด้วย username / password (NextAuth Credentials + bcrypt)
- **ดูครุภัณฑ์ทั้งหมด** ค้นหาและกรองตามประเภท พร้อมยอดรวมและยอดพร้อมใช้งาน
- **ดูสถานที่ (ห้อง) ทั้งหมด** ค้นหาและกรองตามประเภทห้อง
- **ดูของภายในห้อง** และยืมของจากห้องนั้นไปห้องอื่น โดยระบุจำนวนและหมายเหตุ
- **ติดตามสถานะการยืม** ดูประวัติการยืมของตัวเองและคืนของ
- **โปรไฟล์** แก้ไขข้อมูลส่วนตัวและเปลี่ยนรหัสผ่าน

### สำหรับแอดมิน
- เพิ่ม / แก้ไข / ลบ **ครุภัณฑ์** พร้อมอัปโหลดรูปผ่าน Cloudinary
- เพิ่ม / แก้ไข / ลบ **ประเภทครุภัณฑ์**
- เพิ่ม / แก้ไข / ลบ **สถานที่ (ห้อง)** และ **ประเภทห้อง**
- **จัดของเข้าห้อง** กำหนดจำนวนครุภัณฑ์ที่พร้อมใช้และไม่พร้อมใช้ในแต่ละห้อง
- สร้าง / แก้ไข / ลบ **บัญชีผู้ใช้** และกำหนด role
- ดู **ประวัติการยืมทั้งหมด** ในระบบ

### ทั่วทั้งระบบ
- **ส่งออกเป็น Excel** (ExcelJS) ได้ทุกหน้าที่มีตาราง เพื่อนำไปทำรายงานต่อ
- UI ภาษาไทยทั้งระบบ รองรับทั้งมือถือและคอมพิวเตอร์

---

## ผู้ใช้งานและสิทธิ์

| Role | สิทธิ์ |
|------|--------|
| `user` | ดูครุภัณฑ์/สถานที่, ยืม-คืนของ, ดูประวัติของตัวเอง, แก้ไขโปรไฟล์ |
| `admin` | ทำได้ทุกอย่างของ `user` และเข้าหน้า `/admin/*` เพื่อจัดการข้อมูลทั้งหมด |

`middleware.tsx` ตรวจ JWT ของ NextAuth ทุกครั้งที่เข้าเส้นทาง `/admin` ผู้ที่ไม่ได้ล็อกอินหรือไม่ใช่ `admin` จะถูก redirect กลับหน้าแรก

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 19 |
| ภาษา | TypeScript |
| Styling | Tailwind CSS 3 + ฟอนต์ IBM Plex Sans Thai / IBM Plex Mono |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Authentication | NextAuth v4 (Credentials Provider, JWT session) + bcryptjs |
| เก็บรูปภาพ | Cloudinary |
| ส่งออก Excel | ExcelJS + file-saver |
| HTTP Client | Axios |
| Deploy | Docker, Docker Compose, Nginx (reverse proxy) |

---

## โครงสร้างโปรเจกต์

```
stuffnext/
├── app/
│   ├── page.tsx                 # หน้าแรก
│   ├── layout.tsx               # Root layout (ฟอนต์, SessionProvider, Navbar)
│   ├── login/                   # หน้าเข้าสู่ระบบ
│   ├── home/                    # รายการสถานที่ (ห้อง)
│   ├── allasset/                # รายการครุภัณฑ์ทั้งหมด + รายละเอียด [id]
│   ├── location/[id]/           # ของในห้อง + ฟอร์มยืม
│   ├── profile/                 # โปรไฟล์, เปลี่ยนรหัสผ่าน, ประวัติการยืม
│   ├── admin/                   # หน้าจัดการสำหรับแอดมิน
│   ├── api/                     # Route Handlers (REST API)
│   └── component/
│       ├── navbar/              # แถบนำทาง (desktop + drawer บนมือถือ)
│       ├── Session/             # SessionProvider ของ NextAuth
│       └── ui/                  # คอมโพเนนต์กลาง: Button, Field, Modal, Toast, Data, ImageUpload, icons
├── lib/
│   ├── authOptions.ts           # การตั้งค่า NextAuth
│   ├── prisma.ts                # Prisma client (singleton)
│   ├── cloudinary.tsx           # การตั้งค่า Cloudinary
│   ├── excel.ts                 # ตัวส่งออก Excel กลาง (exportSheet)
│   ├── format.ts                # ฟังก์ชันจัดรูปแบบข้อมูล
│   ├── types.ts                 # Type ที่ใช้ร่วมกัน
│   └── next-auth.d.ts           # ขยาย type ของ Session/JWT (id, role, username)
├── prisma/
│   ├── schema.prisma            # Schema ฐานข้อมูล
│   └── migrations/              # Migration history
├── docs/                        # design-system.json และเอกสารประกอบหน้าจอ
├── nginx/default.conf           # Reverse proxy + rate limit
├── middleware.tsx               # ป้องกันเส้นทาง /admin
├── dockerfile
├── docker-compose.yml
├── PRODUCT.md                   # บริบทผลิตภัณฑ์ ผู้ใช้ และข้อจำกัด
└── DESIGN.md                    # ระบบดีไซน์ "ทะเบียนโลหะ · Asset Tag"
```

---

## โครงสร้างฐานข้อมูล

```
Categoryroom 1───* Location *───* Asset *───1 Category
                       │   (ผ่าน AssetLocation)
                       │              │
                       └────* borrow *┘
                               │
                         User 1┘
```

| Model | หน้าที่ | ฟิลด์สำคัญ |
|-------|---------|------------|
| `Asset` | ครุภัณฑ์ | `assetid` (รหัส, unique), `name`, `img`, `categoryId`, `availableValue`, `unavailableValue` |
| `Category` | ประเภทครุภัณฑ์ | `idname` (รหัส, unique), `name` |
| `Location` | สถานที่/ห้อง | `namelocation` (unique), `nameteacher` (ผู้รับผิดชอบ), `categoryIdroom` |
| `Categoryroom` | ประเภทห้อง | `name` (unique) |
| `AssetLocation` | จำนวนครุภัณฑ์ในแต่ละห้อง | `assetId`, `locationId`, `inRoomavailableValue`, `inRoomaunavailableValue` (unique คู่ asset+location) |
| `User` | ผู้ใช้ | `username` (unique), `password` (hash), `name`, `surname`, `email`, `tel`, `image`, `role` |
| `borrow` | รายการยืม-คืน | `userId`, `assetId`, `valueBorrow`, `borrowLocationId`, `returnLocationId`, `dayReturn`, `note`, `Borrowstatus`, `ReturnStatus` |

**Enums**
- `Role`: `user`, `admin`
- `Status`: `w` (รอดำเนินการ), `c` (เสร็จสิ้น) ใช้แยกกันสำหรับสถานะการยืม (`Borrowstatus`) และสถานะการคืน (`ReturnStatus`)

> **หมายเหตุ:** foreign key หลายตัวอ้างอิงคีย์ข้อความที่มนุษย์อ่านได้ (`assetid`, `namelocation`, `Category.idname`) ไม่ใช่ `id` ตัวเลข การเปลี่ยนค่าเหล่านี้ต้องย้ายข้อมูลที่อ้างอิงไปด้วย

---

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี
- Node.js 18 ขึ้นไป (แนะนำ 20+ สำหรับ Next.js 16)
- PostgreSQL 13 ขึ้นไป (ติดตั้งเองหรือใช้ Docker/Supabase/Neon ก็ได้)
- บัญชี [Cloudinary](https://cloudinary.com/) สำหรับอัปโหลดรูป

### ขั้นตอน

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/Pisit-auu/stuffnext.git
cd stuffnext

# 2. ติดตั้ง dependencies (postinstall จะรัน prisma generate ให้อัตโนมัติ)
npm install

# 3. สร้างไฟล์ .env (ดูหัวข้อ Environment Variables)

# 4. สร้างตารางในฐานข้อมูลตาม migration
npx prisma migrate deploy
# หรือระหว่างพัฒนา: npx prisma migrate dev

# 5. รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

### สร้างแอดมินคนแรก

ระบบไม่มีหน้าสมัครสมาชิกสาธารณะ บัญชีแรกสร้างได้ 2 วิธี:

1. เรียก API สร้างผู้ใช้ แล้วแก้ role เป็น `admin` ในฐานข้อมูล

   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"changeme","name":"Admin"}'
   ```

2. เปิด Prisma Studio (`npx prisma studio`) แล้วเปลี่ยนฟิลด์ `role` ของผู้ใช้นั้นเป็น `admin`

หลังจากนั้นแอดมินสร้างบัญชีอื่นได้จากหน้า `/admin/user/singupuser`

---

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์:

```env
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/stuffnext"
# ใช้กับ migration เมื่อ DATABASE_URL ผ่าน connection pooler (เช่น Supabase/PgBouncer)
# ถ้าไม่ได้ใช้ pooler ให้ใส่ค่าเดียวกับ DATABASE_URL
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/stuffnext"

# NextAuth
NEXTAUTH_SECRET="random-secret-string"   # สร้างได้ด้วย: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

| ตัวแปร | จำเป็น | คำอธิบาย |
|--------|:------:|----------|
| `DATABASE_URL` | ✅ | Connection string ของ PostgreSQL |
| `DIRECT_URL` | ✅ | Connection ตรงสำหรับ Prisma migrate |
| `NEXTAUTH_SECRET` | ✅ | คีย์เข้ารหัส JWT ถ้าไม่ได้ตั้ง แอปจะ throw error ตอนเริ่มทำงาน |
| `NEXTAUTH_URL` | แนะนำ | URL หลักของเว็บ (จำเป็นตอน production) |
| `CLOUDINARY_CLOUD_NAME` | ✅ | ชื่อ cloud ของ Cloudinary |
| `CLOUDINARY_API_KEY` | ✅ | API key ของ Cloudinary |
| `CLOUDINARY_API_SECRET` | ✅ | API secret ของ Cloudinary |

> อย่า commit ไฟล์ `.env` ขึ้น repository

---

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | รัน development server |
| `npm run build` | build สำหรับ production |
| `npm run start` | รัน production server (ต้อง build ก่อน) |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npx prisma studio` | เปิด GUI ดู/แก้ข้อมูลในฐานข้อมูล |
| `npx prisma migrate dev` | สร้างและรัน migration ระหว่างพัฒนา |

---

## หน้าเว็บ (Routes)

### ผู้ใช้ทั่วไป

| เส้นทาง | คำอธิบาย |
|---------|----------|
| `/` | หน้าแรก |
| `/login` | เข้าสู่ระบบ |
| `/home` | รายการสถานที่/ห้องทั้งหมด ค้นหาและกรองตามประเภทห้อง |
| `/location/[id]` | ครุภัณฑ์ภายในห้อง และฟอร์มยืมของไปห้องอื่น |
| `/allasset` | ครุภัณฑ์ทั้งหมด ค้นหาและกรองตามประเภท |
| `/allasset/[id]` | รายละเอียดครุภัณฑ์และห้องที่มีของชิ้นนี้ |
| `/profile` | โปรไฟล์ของฉัน |
| `/profile/changepassword` | เปลี่ยนรหัสผ่าน |
| `/profile/history` | สถานะและประวัติการยืมของฉัน / คืนของ |

### แอดมิน (`/admin/*`)

| เส้นทาง | คำอธิบาย |
|---------|----------|
| `/admin` | แดชบอร์ดจัดการ แยกแท็บ ครุภัณฑ์ / ประเภท / สถานที่ / ประเภทห้อง |
| `/admin/createasset`, `/admin/editasset/[id]` | เพิ่ม/แก้ไขครุภัณฑ์ |
| `/admin/createcategory`, `/admin/editcategory/[id]` | เพิ่ม/แก้ไขประเภทครุภัณฑ์ |
| `/admin/createlocation`, `/admin/editlocation/[id]` | เพิ่ม/แก้ไขสถานที่ |
| `/admin/createcategoryroom`, `/admin/editcategoryroom/[id]` | เพิ่ม/แก้ไขประเภทห้อง |
| `/admin/manageroom/[id]` | จัดการครุภัณฑ์ภายในห้อง |
| `/admin/user` | จัดการผู้ใช้ |
| `/admin/user/singupuser` | สร้างบัญชีผู้ใช้ใหม่ |
| `/admin/borrowall` | ประวัติการยืมทั้งหมดในระบบ |

---

## API Endpoints

ทุก endpoint อยู่ใต้ `/api` และรับ/ส่ง JSON

### ครุภัณฑ์ — `/api/asset`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/asset` | รายการครุภัณฑ์ (รองรับ query ค้นหา/กรอง) |
| POST | `/api/asset` | เพิ่มครุภัณฑ์ |
| GET / PUT / DELETE | `/api/asset/[id]` | อ่าน / แก้ไข / ลบครุภัณฑ์ตาม `assetid` |

### ประเภทครุภัณฑ์ — `/api/category`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET / POST | `/api/category` | รายการ / เพิ่มประเภท |
| GET / PUT / DELETE | `/api/category/[id]` | อ่าน / แก้ไข / ลบประเภท |

### สถานที่ — `/api/location`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET / POST | `/api/location` | รายการ / เพิ่มสถานที่ |
| GET / PUT / DELETE | `/api/location/[id]` | อ่าน / แก้ไข / ลบสถานที่ |

### ประเภทห้อง — `/api/categoryroom`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET / POST | `/api/categoryroom` | รายการ / เพิ่มประเภทห้อง |
| GET / PUT / DELETE | `/api/categoryroom/[id]` | อ่าน / แก้ไข / ลบประเภทห้อง |

### ครุภัณฑ์ในห้อง — `/api/assetlocation`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET / POST | `/api/assetlocation` | รายการ / เพิ่มครุภัณฑ์เข้าห้อง |
| GET / PUT / DELETE | `/api/assetlocation/[id]` | อ่าน / ปรับจำนวน / นำออกจากห้อง |
| GET | `/api/assetlocationroom` | ดึงครุภัณฑ์ตามห้อง |

### การยืม-คืน — `/api/borrow`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/borrow` | รายการยืมทั้งหมด |
| POST | `/api/borrow` | สร้างรายการยืม (`userId`, `assetId`, `borrowLocationId`, `returnLocationId`, `valueBorrow`, `dayReturn?`, `note?`) |
| GET / PUT / DELETE | `/api/borrow/[id]` | อ่าน / อัปเดตสถานะ (`Borrowstatus`, `ReturnStatus`, `dayReturn`) / ลบ |
| GET | `/api/borrow/userid/[id]` | รายการยืมของผู้ใช้คนหนึ่ง |
| GET | `/api/borrow/location/[id]` | รายการยืมของห้องหนึ่ง |

### ผู้ใช้และการยืนยันตัวตน — `/api/auth`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET / POST | `/api/auth/[...nextauth]` | NextAuth (login / session / logout) |
| GET / POST | `/api/auth/signup` | รายการผู้ใช้ / สร้างผู้ใช้ใหม่ |
| GET / PUT / DELETE | `/api/auth/signup/[id]` | อ่าน / แก้ไข / ลบผู้ใช้ |
| PUT | `/api/auth/changeps/[id]` | เปลี่ยนรหัสผ่าน |

### อัปโหลดรูป — `/api/uploadimg`
| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/uploadimg` | อัปโหลดรูปขึ้น Cloudinary |
| DELETE | `/api/uploadimg` | ลบรูปออกจาก Cloudinary |

> **ข้อควรทราบด้านความปลอดภัย:** `middleware.tsx` ป้องกันเฉพาะหน้า `/admin` ส่วน API route ยังไม่ได้ตรวจ session/role ในตัว ก่อนนำขึ้นระบบที่เปิดสู่สาธารณะ ควรเพิ่มการตรวจสิทธิ์ใน Route Handler ที่แก้ไขข้อมูล

---

## การ Deploy ด้วย Docker

โปรเจกต์มีไฟล์สำหรับ deploy 3 ส่วน:

- **`dockerfile`** build แบบ multi-stage (Node 18) แล้วรันด้วย `npm start`
- **`docker-compose.yml`** ประกอบด้วย 3 service: `nextjs`, `postgres` (PostgreSQL 13) และ `nginx`
- **`nginx/default.conf`** reverse proxy ไปยัง `nextjs:3001` พร้อม rate limit (10 req/s, burst 20) และซ่อน header `Server` / `X-Powered-By`

```bash
docker compose up -d --build
docker compose exec nextjs npx prisma migrate deploy
```

> **ก่อน deploy ควรตรวจค่าเหล่านี้ให้ตรงกัน** เพราะในไฟล์ปัจจุบันยังไม่สอดคล้องกัน:
> - `docker-compose.yml` อ้าง `dockerfile: stuffnext` แต่ไฟล์จริงชื่อ `dockerfile`
> - แอปรันที่พอร์ต 3000 (`next start` ค่าเริ่มต้น และ `EXPOSE 3000`) แต่ compose และ nginx ใช้พอร์ต 3001 ให้ตั้ง `PORT=3001` ใน `.env` หรือแก้ทุกจุดให้เป็นพอร์ตเดียวกัน
> - service `nginx` mount `./nginx.conf` แต่ไฟล์จริงอยู่ที่ `nginx/default.conf` (ควร mount ไปที่ `/etc/nginx/conf.d/default.conf` และย้าย `limit_req_zone` ไปไว้ใน `http` block)
> - เมื่อใช้ Postgres ใน compose ให้ตั้ง `DATABASE_URL` ชี้ host `postgres` และเปลี่ยนรหัสผ่านเริ่มต้นใน compose ก่อนใช้งานจริง
> - Next.js 16 ต้องใช้ Node 20.9 ขึ้นไป ควรเปลี่ยน base image จาก `node:18` เป็น `node:20` หรือใหม่กว่า

---

## ระบบดีไซน์

UI ใช้ระบบดีไซน์ **"ทะเบียนโลหะ · Asset Tag"** ออกแบบให้หน้าจอดูเหมือนป้ายทะเบียนครุภัณฑ์โลหะและหน้าลิ้นชักตู้เหล็กพัสดุ

- ฟอนต์ **IBM Plex Sans Thai** สำหรับเนื้อหา และ **IBM Plex Mono** สำหรับรหัสและตัวเลข
- โทนสีพื้นเทาอุ่น ตัวอักษรสีเข้ม เขียว (`stock`) สำหรับของพร้อมใช้ และส้มสนิม (`tag`) เป็นสีเน้น
- มีสถานะ loading / empty / error ครบทุกหน้า และคำนึงถึง accessibility
- รายละเอียด token สี ตัวอักษร ระยะห่าง และหลักการออกแบบอยู่ใน [`DESIGN.md`](DESIGN.md) และ [`docs/design-system.json`](docs/design-system.json)
- บริบทผู้ใช้และข้อจำกัดของผลิตภัณฑ์อยู่ใน [`PRODUCT.md`](PRODUCT.md)

---

## ข้อมูลโรงเรียน

**โรงเรียนศรีนครินทร์วิทยานุเคราะห์**
119 ถนนเพชรเกษม ตำบลคลองทราย อำเภอนาทวี จังหวัดสงขลา 90160
อีเมล: Srinakarin.school@gmail.com · โทร: 074-371744-5, 082-5234382 · เว็บไซต์: [srinakarin.ac.th](https://srinakarin.ac.th)
