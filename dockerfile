# ใช้ Node.js เวอร์ชั่นล่าสุด
FROM node:18 AS builder

# ตั้ง directory สำหรับโปรเจกต์
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json เข้ามา
COPY package*.json ./

# คัดลอกโฟลเดอร์ prisma เข้าไปใน Docker image
COPY prisma ./prisma

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# สร้างโปรเจกต์ Next.js
RUN npm run build

# ใช้ image เบาๆ สำหรับ run
FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl


WORKDIR /app

# คัดลอกไฟล์ที่ build เสร็จจากขั้นตอน builder
COPY --from=builder /app ./

# ติดตั้ง dependencies ที่จำเป็นสำหรับ production
RUN npm ci --only=production

# เปิด port 3001
EXPOSE 3000

# รันโปรเจกต์
CMD ["npm", "start"]
