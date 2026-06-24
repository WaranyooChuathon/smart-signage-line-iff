# Feature Spec — FAB Speed Dial (radial)

Feature ย่อยของ Smart Signage Line-LIFF (ดู [SPEC หลัก](../../SPEC.md)) — ไม่กระทบสถาปัตยกรรมเดิม

## 1. Objective
เพิ่มปุ่มลอย (Floating Action Button) ที่กดแล้ว **บานออกเป็นรัศมี (flower/arc)** เผยลิงก์นำทาง
ให้ผู้ใช้ข้ามไปหน้าต่างๆ และกลับ "หน้าเริ่มต้น" (`/`) ได้สะดวก ทั้งฝั่ง LIFF (มือถือ) และ Management (เว็บ)

## 2. Scope
- **`<SpeedDial>`** client component (reusable): ปุ่มหลักลอยมุมจอ → กดแล้ว action items บานเป็นรัศมี + backdrop กดปิด
  - props: `items: { href; label; icon }[]` · ตำแหน่ง (default bottom-right) · ทิศบาน
  - แต่ละ item = ลิงก์ (`next/link`) + label tooltip · ปิดอัตโนมัติเมื่อ navigate
- **LIFF**: Speed Dial มี 6 รายการ — Dashboard / Area / Store Visits / Flow / Content + **หน้าเริ่มต้น** (`/`)
  - วางเหนือ TabBar (ไม่ทับ) · ใช้ token ธีม LIFF
- **Management**: Speed Dial มี 4 รายการ — ร้านค้า / Audit Log / Analytics + **หน้าเริ่มต้น** (`/`)
  - วางมุมขวาล่าง

### Out of scope
- ไม่แก้ TabBar / AdminNav เดิม (Speed Dial เป็นทางลัดเสริม)
- ไม่ทำ drag, ไม่เก็บ state ข้าม session

## 3. Design
- บานรัศมีจากปุ่มหลัก (มุมขวาล่าง → กระจายเป็น quarter-arc ขึ้นบน-ซ้าย)
- ปุ่มหลัก: ไอคอน `+`/เมนู → หมุนเป็น `×` ตอนเปิด · มี backdrop จาง ๆ กดพื้นที่ว่างเพื่อปิด
- animation: stagger ออกทีละปุ่ม (transition transform/opacity) · `prefers-reduced-motion` = ไม่มี animation
- a11y: ปุ่มหลัก `aria-expanded` + `aria-label` · ปิดด้วย `Esc` · items โฟกัสได้

## 4. Acceptance
- [ ] กดปุ่มหลัก → items บานเป็นรัศมี · กดอีกครั้ง/กด backdrop/Esc → ปิด
- [ ] LIFF: เข้าถึง 5 หน้า + กลับ `/` ได้จาก Speed Dial ทุกหน้าใน `(app)`
- [ ] Management: เข้าถึง 3 หน้า + กลับ `/` ได้จากทุกหน้าใน `(panel)`
- [ ] ไม่ทับ TabBar (LIFF) / เนื้อหา · responsive · ไม่มี console error
- [ ] keyboard + reduced-motion ใช้งานได้ · build + lint เขียว

## 5. Files (คาดการณ์)
- `components/ui/speed-dial.tsx` (client, reusable)
- `components/liff/liff-speed-dial.tsx` (config 6 รายการ) → ใส่ใน `app/(liff)/(app)/layout.tsx`
- `components/admin/admin-speed-dial.tsx` (config 4 รายการ) → ใส่ใน `app/admin/(panel)/layout.tsx`

## 6. Boundaries
- **Always:** client component (`"use client"`, usePathname/Link) · ตาม Next 16 patterns · ใช้ design token เดิม
- **Ask first:** เปลี่ยน/ลบ TabBar หรือ AdminNav
- **Never:** เพิ่ม dependency ใหม่ (เขียน CSS/Tailwind เอง) · แตะ data layer/auth
