---
name: ทะเบียนโลหะ · Asset Tag
description: ระบบทะเบียนครุภัณฑ์โรงเรียนศรีนครินทร์วิทยานุเคราะห์ ที่หน้าจอทำตัวเป็นป้ายทะเบียนโลหะและหน้าลิ้นชักตู้เหล็กพัสดุ
colors:
  ground: "#ededea"
  ground-sunk: "#e3e3df"
  plate: "#ffffff"
  plate-hover: "#fafaf8"
  plate-rail: "#1d2021"
  edge: "#d3d3cd"
  edge-strong: "#b9b9b1"
  ink: "#17191a"
  ink-hover: "#2c3032"
  ink-2: "#4c5052"
  ink-3: "#6e7375"
  ink-on-rail: "#f2f2ef"
  ink-on-rail-2: "#a9adaa"
  stock: "#1a6b37"
  stock-soft: "#e4f0e7"
  tag: "#b23a0b"
  tag-hover: "#8f2e08"
  tag-soft: "#fbebe2"
  alert: "#a81e14"
  alert-soft: "#f8e7e5"
  alert-edge: "#e2b7b3"
typography:
  display:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.015em"
  subhead:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0.06em"
  code:
    fontFamily: "IBM Plex Mono, IBM Plex Sans Thai, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.04em"
  micro:
    fontFamily: "IBM Plex Mono, IBM Plex Sans Thai, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.08em"
rounded:
  plate: "2px"
  hair: "1px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  rail:
    backgroundColor: "{colors.plate-rail}"
    textColor: "{colors.ink-on-rail}"
    height: "3.5rem"
    padding: "0 0.75rem"
  plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "1rem"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plate}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.plate}"
  button-secondary:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-secondary-hover:
    backgroundColor: "{colors.plate-hover}"
    textColor: "{colors.ink}"
  button-borrow:
    backgroundColor: "{colors.tag}"
    textColor: "{colors.plate}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-borrow-hover:
    backgroundColor: "{colors.tag-hover}"
    textColor: "{colors.plate}"
  button-return:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.stock}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-return-hover:
    backgroundColor: "{colors.stock-soft}"
    textColor: "{colors.stock}"
  button-danger:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.alert}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-danger-hover:
    backgroundColor: "{colors.alert-soft}"
    textColor: "{colors.alert}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.plate}"
    padding: "0 0.875rem"
    height: "2.5rem"
  button-quiet-hover:
    backgroundColor: "{colors.ground-sunk}"
    textColor: "{colors.ink}"
  button-sm:
    height: "2rem"
    padding: "0 0.625rem"
    typography: "{typography.meta}"
  input:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
    rounded: "{rounded.plate}"
    padding: "0 0.75rem"
    height: "2.5rem"
    typography: "{typography.body}"
  input-disabled:
    backgroundColor: "{colors.ground-sunk}"
    textColor: "{colors.ink-3}"
  tag-strip:
    backgroundColor: "{colors.ground-sunk}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.hair}"
    padding: "0.125rem 0.4rem"
    typography: "{typography.code}"
  tag-strip-hover:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink}"
  status-chip-stock:
    backgroundColor: "{colors.stock-soft}"
    textColor: "{colors.stock}"
    rounded: "{rounded.plate}"
    padding: "0.125rem 0.375rem"
  status-chip-tag:
    backgroundColor: "{colors.tag-soft}"
    textColor: "{colors.tag}"
    rounded: "{rounded.plate}"
    padding: "0.125rem 0.375rem"
  status-chip-neutral:
    backgroundColor: "{colors.ground-sunk}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.plate}"
    padding: "0.125rem 0.375rem"
  status-chip-alert:
    backgroundColor: "{colors.alert-soft}"
    textColor: "{colors.alert}"
    rounded: "{rounded.plate}"
    padding: "0.125rem 0.375rem"
  table-header:
    backgroundColor: "#f7f7f5"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    padding: "0.625rem 0.75rem"
---

# Design System: ทะเบียนโลหะ · Asset Tag

## Overview

**Creative North Star: "ทะเบียนโลหะ — ป้ายครุภัณฑ์บนหน้าลิ้นชักตู้เหล็ก"**

ครุภัณฑ์ทุกชิ้นในโรงเรียนมีป้ายทะเบียนติดอยู่บนตัวของจริงอยู่แล้ว โลกนี้ถือว่าหน้าจอคือป้ายเดียวกันนั้นที่ขยายให้ทั้งระบบอ่านได้ พื้นหลังคือสีเทาตู้เหล็ก (`--ground` #EDEDEA) แผ่นป้ายขาวขอบเส้นผมวางอยู่บนพื้นนั้น มุมตัดที่ 2px ไม่ใช่มุมมน และทุกหน่วยข้อมูล — ครุภัณฑ์หนึ่งชิ้น ห้องหนึ่งห้อง — เริ่มต้นด้วยแถบรหัสตัวพิมพ์ mono ที่อ่านได้เหมือนบัตรในรางเหล็ก

ระบบนี้เป็นเครื่องมือทำงาน ไม่ใช่แดชบอร์ดสำหรับดู ความหนาแน่นจึงสูง ตัวอักษรฐาน 0.9375rem แถวตารางสูงพอให้กดด้วยนิ้วแต่ไม่หลวม ไม่มีการ์ดมุมมนพร้อมตัวเลข KPI ใหญ่ ๆ ไม่มีไล่เฉดสีเพื่อความสวย ไม่มีไอคอนสี ทุกอย่างที่มีสีในหน้าจอนี้กำลังพูดถึงสถานะของของจริงในห้องจริง

จังหวะการเคลื่อนไหวคือลิ้นชักที่ถูกดึงออกมา — เลื่อนตามแกนเดียวไม่เกิน 6px ไม่มีการเด้ง ไม่มีการหมุน ไม่มีสเกล ทั้งระบบมีค่าเวลาสองค่าและเส้นโค้งเดียว

**Key Characteristics:**
- พื้นเทาตู้เหล็ก แผ่นป้ายขาว ขอบเส้นผม 1px มุม 2px
- IBM Plex Sans Thai คู่กับ IBM Plex Mono — mono ถูกจองไว้ให้รหัส ที่อยู่ และตัวเลขเท่านั้น
- สีสามสี สามความหมาย ไม่มีสีตกแต่ง
- ทุกหน่วยขึ้นต้นด้วยแถบรหัส `.tag-strip`
- ตารางบนจอกว้าง ยุบเป็นแผ่นป้ายบนจอแคบ โดยแถบรหัสยังนำหน้าเหมือนเดิม
- เงามีสามระดับ ใช้ตามหน้าที่ ไม่ใช่ตามความสวย

## Colors

พาเลตต์เป็นเทาโลหะแทบทั้งหมด แล้วปล่อยให้สีสามสีทำงานเป็นกฎหมาย ไม่ใช่เครื่องประดับ

### Primary
- **เขียวคลัง / Stock Green** (`--stock`): ของที่พร้อมใช้งานและพร้อมให้ยืม ใช้กับขีดนับ `.tick` ตัวเลขยอดคงเหลือในลิ้นชักยืม ชิปสถานะ "พร้อมใช้" และปุ่ม `return` (คืนของ) พื้นอ่อน `--stock-soft` ใช้ได้เฉพาะในชิปและแถบแจ้งผลสำเร็จ
- **ส้มป้ายยืม / Tag Orange** (`--tag`): ของที่ถูกยืมออกไปแล้วและยังไม่คืน รวมถึงรายการที่รอดำเนินการ ใช้กับขีดนับ `.tick--out` ชิป `tone="tag"` และปุ่ม `borrow` ซึ่งเป็นขาวตัวอักษรส้มขอบส้ม ไม่ถมพื้น นี่คือสีที่ผู้ใช้เห็นเป็นจุดสีเดียวในหน้าจอรายการห้อง

### Tertiary
- **แดงลบ / Delete Red** (`--alert`): การลบและความผิดพลาดเท่านั้น ปรากฏเป็นตัวอักษรและเส้นขอบ (`--alert-edge` สำหรับขอบปุ่ม) ไม่เคยเป็นพื้นปุ่ม ปุ่ม `danger` เป็นแผ่นป้ายขาวตัวอักษรแดง เพื่อให้การลบต้องอ่านก่อนกด

### Neutral
- **พื้นตู้เหล็ก / Cabinet Ground** (`--ground`): พื้นหลังของทุกหน้า
- **ร่องลิ้นชัก / Sunk Groove** (`--ground-sunk`): พื้นของสิ่งที่จมลงไปหนึ่งชั้น — แถบรหัส กล่องสรุปในลิ้นชักยืม ช่องกรอกที่ปิดใช้งาน สถานะ hover ของเมนู
- **แผ่นป้าย / Plate White** (`--plate`): ภาชนะเดียวของทั้งระบบ
- **รางเหล็ก / Rail Black** (`--plate-rail`): แถบบนสุดและส่วนท้ายหน้าแรก เป็นขอบบน-ล่างของตู้ ไม่ใช่พื้นที่เนื้อหา
- **เส้นผม / Hairline** (`--edge`) และ **ขอบหนัก** (`--edge-strong`): เส้นแบ่งทุกเส้นในระบบ ขอบหนักใช้กับสิ่งที่รับ input ได้ (ช่องกรอก ปุ่ม secondary แถบรหัส)
- **หมึก** (`--ink` / `--ink-2` / `--ink-3`): ข้อความหลัก ข้อความรอง และข้อความประกอบ/placeholder ตามลำดับ บนรางเหล็กใช้ `--ink-on-rail` และ `--ink-on-rail-2`

### Named Rules
**กฎหนึ่งสีหนึ่งความหมาย (The One Colour One Meaning Rule).** เขียว = พร้อมใช้งาน ส้ม = ถูกยืมออก/รอดำเนินการ แดง = ลบ/ผิดพลาด ห้ามยืมสีใดไปใช้เพื่อความสวยงาม เพื่อแยกหมวดหมู่ หรือเพื่อเน้นสิ่งที่ไม่ใช่สถานะเหล่านี้ ถ้าต้องเน้นอะไรสักอย่างโดยไม่ได้พูดถึงสถานะ ให้ใช้น้ำหนักตัวอักษรหรือเส้นขอบ ไม่ใช่สี

**กฎสีอยู่ที่ขอบ (The Colour At The Edge Rule).** สีปรากฏเป็นเส้นขอบ ตัวอักษร ขีดนับ และพื้นอ่อนขนาดเล็ก ขนาดใหญ่ที่สุดที่สีถมเต็มพื้นได้คือชิปและแถบแจ้งเตือน ปุ่มใส่สีที่ขอบกับตัวอักษรเท่านั้น ห้ามถมสีเป็นแผงพื้นหลังของส่วนหน้าจอ แถบหัวเรื่อง หรือการ์ดทั้งใบ

**กฎชำรุดไม่มีสี (The Broken-Is-Grey Rule).** ของที่ใช้งานไม่ได้ไม่ใช่สถานะที่ต้องรีบดู จึงใช้เทา (`--edge-strong` สำหรับ `.tick--none`, ชิป `tone="neutral"`) ไม่ใช่แดง แดงสงวนไว้ให้การกระทำที่ย้อนกลับไม่ได้เท่านั้น

## Typography

**Display / Body Font:** IBM Plex Sans Thai (fallback `system-ui, sans-serif`) น้ำหนัก 400 / 500 / 600 / 700
**Label/Mono Font:** IBM Plex Mono (fallback `var(--font-plex-thai)`, `ui-monospace`, `monospace`)

**Character:** ตระกูลเดียวกันสองหน้า — Plex Sans Thai อ่านภาษาไทยได้จริงในขนาดเล็กและมีบุคลิกวิศวกรรมมากกว่าฟอนต์ไทยระบบ ส่วน Plex Mono ทำให้รหัสครุภัณฑ์ดูเหมือนถูกปั๊มลงบนป้าย ไม่ใช่ถูกพิมพ์ลงในฟอร์ม เพราะ Plex Mono ไม่มีอักขระไทย fallback จึงตกไปที่ Plex Sans Thai ซึ่งเป็นตระกูลเดียวกัน ข้อความไทยในสไตล์ mono จึงไม่แตกทรง

### Hierarchy
- **Display** (600, 2.25rem → 3rem ที่ `sm` → 3.5rem ที่ `lg`, lh 1.12, ls -0.025em): หัวเรื่องของหน้าแรกและหน้าเข้าสู่ระบบเท่านั้น ไม่ใช้ในหน้าปฏิบัติงาน
- **Headline** (600, 1.5rem → 1.75rem ที่ `sm`, lh 1.25): ชื่อหน้าใน `PageHeader` หนึ่งอันต่อหนึ่งหน้า
- **Title** (600, 1.25rem): หัวเรื่องส่วนบนหน้าแรก
- **Subhead** (600, 0.9375rem): `SectionTitle` หัวลิ้นชัก หัวการ์ด — หัวเรื่องที่พบบ่อยที่สุดในระบบ ขนาดเท่าเนื้อความ แยกด้วยน้ำหนักอย่างเดียว
- **Body** (400, 0.9375rem, lh 1.6): เนื้อความและข้อมูลในตารางทั้งหมด ย่อหน้าคำอธิบายจำกัดที่ราว 52ch
- **Meta** (400, 0.8125rem, lh 1.45): ป้ายกำกับช่องกรอก คำใบ้ ข้อความรอง คู่กับ `--ink-2` หรือ `--ink-3`
- **Label** (600, 0.75rem, ls 0.06em, ตัวพิมพ์ใหญ่): หัวคอลัมน์ตาราง — sans ไม่ใช่ mono
- **Code** (mono 400, 0.75rem, ls 0.04em): เนื้อในของ `.tag-strip` รหัสครุภัณฑ์ ชื่อห้อง
- **Micro** (mono 400, 0.6875rem, ls 0.08–0.18em, ตัวพิมพ์ใหญ่): เส้นทาง (breadcrumb) ป้ายกำกับบนรางเหล็ก หัวข้อในส่วนท้าย ป้ายกลุ่มแอดมิน

### Named Rules
**กฎ mono สงวนไว้ให้ตัวตน (The Mono Is Identity Rule).** ตัวพิมพ์ mono ใช้ได้เฉพาะกับสิ่งที่เป็นรหัส ที่อยู่ หรือปริมาณ: `assetid`, `namelocation`, เส้นทาง URL, ยอดคงเหลือ, เบอร์โทร ห้ามใช้ mono กับประโยคหรือคำอธิบาย เพราะ mono คือสัญญาณว่า "อันนี้คือค่าที่คัดลอกไปใช้ต่อได้"

**กฎตัวเลขเรียงคอลัมน์ (The Tabular Numerals Rule).** `table` และ `.tnum` บังคับ `font-variant-numeric: tabular-nums` ตัวเลขในคอลัมน์เดียวกันต้องเรียงตรงกันเสมอ ห้ามใส่ตัวเลขจำนวนมากลงในองค์ประกอบที่ไม่ได้รับ tabular-nums

**กฎหัวเรื่องหนึ่งเดียว (The One Headline Rule).** หนึ่งหน้ามี `<h1>` เดียวและอยู่ใน `PageHeader` เสมอ ขนาดที่ใหญ่กว่านั้น (Display) เป็นของหน้าที่ต้องโน้มน้าวเท่านั้น

## Layout

ทุกหน้าใช้กรอบเดียวกันผ่าน `PageShell` (`app/component/ui/Layout.tsx`) ซึ่งมีสามความกว้าง: `wide` = 84rem (`max-w-rail`, ค่าเริ่มต้น, หน้าที่มีตาราง), `narrow` = 56rem (หน้ารายละเอียด), `form` = 42rem (หน้าฟอร์ม) ระยะขอบซ้ายขวา 1rem บนมือถือ และ 1.5rem ตั้งแต่ `sm` ขึ้นไป ระยะบนล่าง 1.5rem → 2.5rem

ลำดับแนวตั้งของหน้าปฏิบัติงานคงที่: รางเหล็กสูง 3.5rem (`--rail-h`) ค้างอยู่บนสุด → `PageHeader` เป็น `.drawer-face` เต็มความกว้าง (เส้นทาง → รหัส → ชื่อหน้า → ข้อมูลประกอบ → ปุ่มการกระทำ) → `Toolbar` (ค้นหา + ตัวกรอง) → ตาราง ระยะระหว่างสามก้อนนี้คือ 1.5rem และ 1.25rem ตามลำดับ

จังหวะระยะห่างเดินบนสเกล 0.5 / 0.75 / 1 / 1.5 / 2.5rem แผ่นป้ายในรายการห่างกัน 0.5rem ช่องตาราง 0.625rem × 0.75rem แผ่นป้ายบนจอแคบ 0.75rem × 0.875rem

จุดเปลี่ยนพฤติกรรมมีสองจุดที่มีความหมายจริง: ที่ `md` (768px) ตารางยุบเป็นแผ่นป้าย และที่ `lg` (1024px) เมนูบนรางเปลี่ยนจากปุ่มแฮมเบอร์เกอร์เป็นลิงก์เรียงแนวนอน ส่วน `sm` (640px) เป็นจุดเพิ่มความหนาแน่นอย่างเดียว ไม่เปลี่ยนโครงสร้าง

### Named Rules
**กฎที่อยู่มาก่อน (The Address First Rule).** ทุกหน้าปฏิบัติงานต้องบอกก่อนว่าผู้ใช้อยู่ตรงไหนของระบบ ด้วยเส้นทาง mono ตัวพิมพ์ใหญ่บนสุดของ `.drawer-face` และรหัสของสิ่งที่กำลังดูอยู่บรรทัดถัดมา ก่อนถึงชื่อหน้า

**กฎกรอบเดียว (The Single Frame Rule).** ห้ามสร้างความกว้างสูงสุดใหม่ ทุกหน้าเลือกจากสามค่าของ `PageShell` เท่านั้น (ปัจจุบัน 21 จาก 23 หน้าใช้ `PageShell` ข้อยกเว้นคือหน้าแรกและหน้าเข้าสู่ระบบ ซึ่งเป็นหน้าเต็มจอโดยตั้งใจ)

## Elevation & Depth

ระบบนี้ไม่แบน แต่ก็ไม่ลอย ความลึกมาจากสามชั้นตามหน้าที่: พื้นตู้ (`--ground`) → แผ่นป้ายที่วางอยู่บนพื้น (`--plate`) → สิ่งที่ถูกดึงออกมาจากหน้าจอ (modal, เมนู, ลิ้นชักเมนูมือถือ) เงามีสามค่าเท่านั้นและทั้งระบบใช้อยู่ 14 ครั้ง โดยไม่มีเงาที่เขียนขึ้นเฉพาะกิจแม้แต่ครั้งเดียว

### Shadow Vocabulary
- **plate** (`0 1px 0 var(--edge), 0 1px 2px rgb(23 25 26 / 0.05)`): แผ่นป้ายทุกใบขณะพัก รวมถึงปุ่มที่มีพื้น เป็นเส้นขอบล่างคมหนึ่งเส้นบวกความฟุ้งบางมาก — เหมือนแผ่นโลหะที่วางแนบพื้น ไม่ใช่ลอยเหนือพื้น
- **lift** (`0 8px 20px -8px rgb(23 25 26 / 0.3), 0 2px 5px rgb(23 25 26 / 0.08)`): ตอบสนอง hover ของทั้งแถวที่คลิกได้ (หน้าลิ้นชักบนหน้าแรก) และ Toast
- **drawer** (`0 24px 60px -20px rgb(23 25 26 / 0.45), 0 4px 12px rgb(23 25 26 / 0.12)`): เฉพาะสิ่งที่ถูกดึงออกมาทับหน้าจอ — `Modal`, เมนูบัญชี, ลิ้นชักเมนูมือถือ ใช้คู่กับฉากหลัง `bg-ink/45` และ `backdrop-blur-[1px]`

### Named Rules
**กฎเงาตามหน้าที่ (The Shadow-Has-A-Job Rule).** เงาบอกว่าสิ่งนั้นอยู่ชั้นไหน ไม่ได้บอกว่าสิ่งนั้นสำคัญ แผ่นป้ายพักที่ `plate` เสมอ `lift` เกิดจากการชี้เท่านั้น `drawer` ใช้ได้เฉพาะสิ่งที่มีฉากหลังทับหน้าจอจริง ห้ามเขียนค่า `box-shadow` ใหม่นอกสามค่านี้

## Shapes

รูปทรงของโลกนี้คือแผ่นโลหะที่ถูกตัด ไม่ใช่ยางที่ถูกหล่อ มุมทั้งระบบอยู่ที่ 2px (`--radius`) — เล็กพอที่จะไม่อ่านว่ามน แต่มากพอที่จะไม่คมบาดตา และมีรัศมีชั้นที่สองคือ 1px สำหรับของที่เล็กกว่านั้น: `.tag-strip`, วงแหวนโฟกัส และ skeleton การตรวจสอบทั้ง `app/` พบ `rounded-*` ที่ไม่ใช่ค่าเริ่มต้นเพียงจุดเดียว (skeleton) และไม่มี `rounded-full` หรือ `rounded-lg` เลย

เส้นเป็นเครื่องมือหลักในการแบ่งพื้นที่ ไม่ใช่ระยะห่าง: ขอบแผ่นป้าย 1px `--edge` เส้นแบ่งแถวตาราง 1px เส้นแบ่งภายในการ์ด 1px และ `Stat` ใช้เส้นตั้งซ้าย 1px แทนกล่อง

`.drawer-face` เป็นรูปทรงเฉพาะของระบบ: ไล่เฉดขาวลงเทาอ่อนแนวตั้ง (`#fdfdfc` → `#f4f4f1`) พร้อมเส้นสกัดประ (`repeating-linear-gradient` 4px เว้น 4px) พาดอยู่เหนือขอบล่าง 0.5rem อ่านเป็นร่องมือจับของลิ้นชักตู้เหล็ก

ไอคอนเขียนขึ้นเองทั้งชุดใน `app/component/ui/icons.tsx` เส้นเดี่ยวหนัก 1.5 `strokeLinecap="square"` `strokeLinejoin="miter"` บน viewBox 24 ขนาดใช้งาน 12–26px ปลายตัดตรงและมุมตัดตรงคือสิ่งที่ทำให้ไอคอนอยู่ในไวยากรณ์เดียวกับป้ายทะเบียน

### Named Rules
**กฎมุม 2px (The Two-Pixel Corner Rule).** แผ่นป้าย ปุ่ม ช่องกรอก ชิป และ modal ใช้ 2px ของที่เล็กกว่าชิป (แถบรหัส วงแหวนโฟกัส skeleton) ใช้ 1px ห้ามมุมมนแบบเม็ดยา ห้ามวงกลม ห้ามอวาตาร์กลม

**กฎเส้นก่อนช่องว่าง (The Line Before Space Rule).** เมื่อต้องแยกสองสิ่งออกจากกัน ใช้เส้น 1px `--edge` ก่อน แล้วค่อยเพิ่มระยะห่าง ระบบนี้แน่นโดยตั้งใจ ระยะห่างมีราคาแพงกว่าเส้น

## Components

### Buttons
- **Shape:** มุม 2px มีขอบเสมอ สูง 2.5rem (`md`) หรือ 2rem (`sm`) ระยะซ้ายขวา 0.875rem / 0.625rem
- **Primary:** พื้นหมึกดำ ตัวอักษรขาว ใช้กับการกระทำหลักหนึ่งเดียวของหน้า
- **Secondary (ค่าเริ่มต้น):** แผ่นป้ายขาว ขอบ `--edge-strong` hover ขอบเข้มขึ้นเป็นหมึกและพื้นเปลี่ยนเป็น `#fafaf8`
- **Quiet:** ไม่มีพื้นไม่มีขอบ hover ลงร่อง `--ground-sunk`
- **Borrow / Return / Danger:** สามปุ่มที่กฎหมายของสีบังคับอยู่ — ทั้งสามเป็นขาวและใส่สีที่ขอบกับตัวอักษร: ส้มสำหรับการยืม เขียวสำหรับการคืน แดงขอบ `--alert-edge` สำหรับการลบ
- **States:** `active:translate-y-px` (กดแล้วยุบลง 1px) `disabled:opacity-45` สถานะกำลังทำงานแทนที่ไอคอนนำด้วย `IconSpinner` และปิดการกดโดยอัตโนมัติ transition ครอบเฉพาะ `background-color, border-color, color, box-shadow, transform` ที่ 160ms

### Chips
- **StatusChip** (`app/component/ui/Data.tsx`): ขอบสีทึบ 35% พื้นสีอ่อน ตัวอักษรสีเข้ม ขนาด 0.75rem/lh 1.25rem มุม 2px มีสี่โทนตรงกับกฎหมายของสี — `stock` / `tag` / `neutral` / `alert` ชิปคือหน่วยที่ใหญ่ที่สุดที่สีถมพื้นได้

### Cards / Containers
- **`.plate`** คือภาชนะเดียวของระบบ: พื้นขาว ขอบ 1px `--edge` มุม 2px เงา `plate` ระยะภายใน 1rem–1.25rem ห้ามสร้างภาชนะแบบอื่น
- **`.drawer-face`** ใช้เป็นหัวเรื่องเท่านั้น — หัวหน้า (`PageHeader`) หัว `Modal` และแถวทางเข้าบนหน้าแรก ไม่เคยใช้ห่อเนื้อหา

### Inputs / Fields
- **Style:** สูง 2.5rem พื้นขาว ขอบ `--edge-strong` มุม 2px เงา `plate` ระยะซ้ายขวา 0.75rem placeholder ใช้ `--ink-3`
- **Focus:** ขอบเปลี่ยนเป็นหมึกพร้อมวงแหวน `ring-2 ring-ink/15` ส่วนโฟกัสทั่วไปของทั้งเอกสารคือ `outline: 2px solid var(--ink)` เยื้อง 2px รัศมี 1px
- **Error:** ขอบเปลี่ยนเป็น `--alert` ข้อความผิดพลาดอยู่ใต้ช่อง มี `IconAlert` นำหน้า `role="alert"` และผูกกับช่องผ่าน `aria-describedby` + `aria-invalid`
- **Label:** อยู่เหนือช่องเสมอ ขนาด Meta น้ำหนัก 500 สี `--ink-2` ช่องค้นหาและตัวกรองที่ยืนเดี่ยวซ่อนป้ายกำกับไว้ให้โปรแกรมอ่านหน้าจอด้วย `sr-only` — ไม่ใช่ตัดทิ้ง
- **Select:** ปิด appearance เดิมแล้ววาง `IconChevronDown` ที่ขวา 0.625rem เอง

### Navigation
รางเหล็กสูง 3.5rem ค้างบนสุด (`z-50`) พื้น `--plate-rail` ขอบล่าง `border-black/40` ซ้ายสุดคือป้ายระบบ: กล่อง mono `SNK` ระยะอักษร 0.14em ขอบขาว 25% ตามด้วยชื่อระบบภาษาไทยและบรรทัด `SRINAKARIN INVENTORY` แบบ micro ลิงก์บนรางใช้เส้นใต้หนา 2px เป็นตัวบอกตำแหน่งปัจจุบัน (`border-b-2 border-ink-rail`) ไม่ใช่พื้นสี ต่ำกว่า `lg` เมนูกลายเป็นลิ้นชักเลื่อนเข้าจากซ้าย กว้าง 17rem โดยรายการที่ active ใช้เส้นตั้งซ้าย 2px แทน

### Modal (ลิ้นชักที่ถูกดึงออกมา)
เข้าจากล่างบนมือถือ (`items-end`) และอยู่กลางจอตั้งแต่ `sm` ขึ้นไป กว้าง `md` = 28rem หรือ `lg` = 42rem สูงสุด 92vh หัวลิ้นชักเป็น `.drawer-face` แบบ sticky แสดงรหัส mono เหนือชื่อ ส่วนท้ายเป็นแถบ sticky พื้นขาวขอบบน 1px ปุ่มเรียงชิดขวาตั้งแต่ `sm` และเรียงเต็มความกว้างบนมือถือ ดักคีย์ `Tab` ไว้ในกล่อง คืนโฟกัสให้ปุ่มต้นทางเมื่อปิด และล็อกการเลื่อนของ `body` ระหว่างเปิด

### DataTable (องค์ประกอบลายเซ็น)
ตัวควบคุมเรขาคณิตของทั้งระบบ ตั้งแต่ `md` ขึ้นไปเป็นตารางจริง หัวคอลัมน์พื้น `#f7f7f5` ตัวอักษร Label ตัวพิมพ์ใหญ่ แถว hover เป็น `#fafaf8` ต่ำกว่า `md` แถวเดียวกันนั้นกลายเป็น `<li class="plate">` โดยคอลัมน์ที่ตั้ง `primary` ขึ้นไปเป็นหัวแผ่นป้าย คอลัมน์ที่เหลือกลายเป็น `<dl>` คู่ป้ายกำกับ-ค่า และคอลัมน์ที่ตั้ง `actions` ไปอยู่ท้ายแผ่นป้ายใต้เส้นแบ่ง คอลัมน์ที่ตั้ง `hideOnCard` หายไปบนจอแคบ สถานะกำลังโหลดคือ `TableSkeleton` ที่มีรูปร่างเท่าตารางจริง ไม่ใช่ spinner

### tag-strip (องค์ประกอบลายเซ็น)
แถบรหัสริมซ้ายของทุกหน่วย: mono 0.75rem ระยะอักษร 0.04em พื้น `--ground-sunk` ขอบ `--edge-strong` มุม 1px เมื่อชี้ที่แถว (`.tag-row`) หรือมีโฟกัสอยู่ในแถว แถบจะเลื่อนขวา 3px พื้นเปลี่ยนเป็นขาวและขอบเข้มขึ้น เหมือนบัตรที่ถูกดึงออกจากราง เป็นการเคลื่อนไหวเดียวที่ผูกกับข้อมูลโดยตรง

### TickBar (องค์ประกอบลายเซ็น)
ขีดตั้ง 2px × 0.875rem เรียงติดกันห่าง 2px แทนยอดคงเหลือ: เขียว = พร้อมใช้ ส้ม = ถูกยืมออก เทา = ใช้งานไม่ได้ ย่อสัดส่วนอัตโนมัติเมื่อยอดเกิน 14 (`max`) แล้วต่อท้ายด้วยตัวเลข mono `พร้อมใช้/ทั้งหมด` อ่านยอดได้ก่อนอ่านตัวเลข และมีคำอธิบายเต็มใน `title` + `sr-only` เสมอ

### Toast
แทน `alert()` ทั้งระบบ ล่างกลางจอบนมือถือ ล่างขวาตั้งแต่ `sm` มุม 2px เงา `lift` โทนสีตามกฎหมายของสี (สำเร็จ = เขียว ผิดพลาด = แดง ข้อมูล = ขาวขอบเข้ม) แสดง 4.5 วินาที และ 7 วินาทีสำหรับข้อผิดพลาด เก็บสูงสุด 4 รายการ ประกาศผ่าน `role="status" aria-live="polite"`

### EmptyState / ErrorState
ทั้งคู่เป็น `.plate` จัดกึ่งกลาง มีไอคอนเส้นเดี่ยวขนาด 22px หัวเรื่อง Subhead คำอธิบาย Meta และปุ่มทางออกหนึ่งปุ่ม `ErrorState` เพิ่มขอบ `--alert` 40% และ `role="alert"` — เป็นที่เดียวที่สีแดงแตะขอบภาชนะทั้งใบ

## Motion

เส้นโค้งเดียวทั้งระบบ `--ease: cubic-bezier(0.2, 0.8, 0.25, 1)` (ตระกูล ease-out: ออกตัวเร็ว เข้าที่นุ่ม) และเวลาสองค่า `--dur: 160ms` สำหรับการเปลี่ยนสถานะทั้งหมด (สี ขอบ เงา การเลื่อนของแถบรหัส การหมุนของลูกศร) กับ `--dur-slow: 260ms` สำหรับสิ่งที่เข้ามาใหม่ในหน้าจอ (`slide-up` ของ Modal และ Toast, `slide-in` ของลิ้นชักเมนูใช้ 160ms)

การเคลื่อนไหวทุกอย่างเป็นแกนเดียวและไม่เกิน 6px: `slide-up` เลื่อนขึ้น 6px, `slide-in` เลื่อนขวา 6px, แถบรหัสเลื่อนขวา 3px, ลูกศรเลื่อนขวา 4px, ปุ่มยุบลง 1px ไม่มีสเกล ไม่มีหมุน (ยกเว้นลูกศรของเมนูบัญชีที่พลิก 180°) ไม่มีเด้ง

`@media (prefers-reduced-motion: reduce)` ตัด animation และ transition ทั้งหมดเหลือ 0.01ms ทั่วทั้งเอกสาร

**กฎแกนเดียว (The Single Axis Rule).** ลิ้นชักเลื่อนตามรางเดียว ทุกการเคลื่อนไหวเลือกได้แกนเดียวเท่านั้น ระยะไม่เกิน 6px และต้องอยู่ใน 160ms หรือ 260ms ถ้าอยากให้บางอย่างเด่นขึ้น ให้เปลี่ยนสี น้ำหนัก หรือเส้นขอบ ไม่ใช่เพิ่มการเคลื่อนไหว

## Do's and Don'ts

### Do:
- **Do** เริ่มทุกหน่วยข้อมูลด้วย `.tag-strip` (ผ่าน `<CodeTag>`) และวางไว้ในคอลัมน์ที่ตั้ง `primary` เพื่อให้แถบรหัสยังนำหน้าเมื่อแถวยุบเป็นแผ่นป้ายบนจอแคบ
- **Do** ใช้ `DataTable` สำหรับทุกรายการที่มีมากกว่าหนึ่งคอลัมน์ มันเป็นเจ้าของกฎการยุบที่ `md` และไม่มีที่อื่นในระบบที่ควรเขียนกฎนี้ซ้ำ
- **Do** วางทุกหน้าไว้ใน `PageShell` + `PageHeader` และให้ `PageHeader` มี `trail` เสมอในหน้าปฏิบัติงาน
- **Do** ใช้มุม 2px กับทุกภาชนะ และ 1px กับของที่เล็กกว่าชิป
- **Do** ใช้ `useToast()` แทน `alert()` ทุกกรณี และผูกโทนของ toast เข้ากับกฎหมายของสี
- **Do** ใช้ `TickBar` เมื่อจะแสดงยอดคงเหลือ ให้ผู้ใช้อ่านสัดส่วนได้ก่อนอ่านตัวเลข
- **Do** ให้ทุกช่องกรอกมี `<label>` จริง ถ้าออกแบบให้ไม่เห็น ให้ซ่อนด้วย `sr-only` ไม่ใช่ตัดออก
- **Do** เขียนไอคอนใหม่ในสไตล์ของ `icons.tsx` — เส้นเดี่ยว 1.5 ปลายตัดตรง มุมตัดตรง viewBox 24

### Don't:
- **Don't** ถมสีเขียว/ส้ม/แดงเป็นพื้นหลังของส่วนหน้าจอ แถบหัวเรื่อง หรือการ์ดทั้งใบ ขนาดใหญ่ที่สุดที่สีถมพื้นได้คือชิปและแถบแจ้งเตือน ปุ่มไม่ถมสีสถานะ
- **Don't** ใช้สีส้มกับสิ่งที่ไม่ใช่การยืมออกหรือรายการที่รอดำเนินการ (เครื่องหมาย `*` ของช่องบังคับใช้ `--ink-3` เพราะ "บังคับกรอก" ไม่ใช่สถานะของของจริง)
- **Don't** ใช้สีแดงกับของที่ชำรุด ของที่ใช้งานไม่ได้เป็นเทา แดงสงวนไว้ให้การลบและความผิดพลาดเท่านั้น
- **Don't** เขียน `box-shadow` ค่าใหม่ เลือกจาก `plate` / `lift` / `drawer`
- **Don't** ใช้มุมมนแบบเม็ดยา วงกลม หรืออวาตาร์กลม — ระบบนี้ไม่มี `rounded-full` แม้แต่จุดเดียว
- **Don't** ใช้ตัวพิมพ์ mono กับประโยคหรือคำอธิบาย mono สงวนไว้ให้รหัส ที่อยู่ และปริมาณ
- **Don't** สร้างความกว้างสูงสุดใหม่ หรือระยะขอบหน้าใหม่ นอกเหนือจากสามค่าของ `PageShell`
- **Don't** เพิ่มการเคลื่อนไหวสองแกน สเกล หรือการเด้ง และอย่าใช้เวลานอกเหนือจาก 160ms / 260ms
- **Don't** นำ antd หรือไลบรารี UI อื่นกลับเข้ามา ระบบนี้เป็นเจ้าของปุ่ม ช่องกรอก ตาราง modal และไอคอนของตัวเองครบแล้ว
- **Don't** ใช้ spinner กลางจอเป็นสถานะกำลังโหลด ใช้ `TableSkeleton` หรือ `Skeleton` ที่มีรูปร่างเท่าของจริง
