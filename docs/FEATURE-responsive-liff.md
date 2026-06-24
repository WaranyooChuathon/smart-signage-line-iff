# Feature Spec — Responsive LIFF (phone-frame showcase)

Feature ย่อย (ดู [SPEC หลัก](../../SPEC.md)) — เฉพาะฝั่ง LIFF · admin ไม่แตะ (เป็น web layout อยู่แล้ว)

## 1. Objective / ปัญหา
ตอนนี้ `(liff)` ตรึง `max-w-[480px]` → บน tablet/desktop เป็นคอลัมน์แคบ + พื้นที่ข้างว่าง
LIFF เป็นแอปมือถือโดยธรรมชาติ (เปิดใน LINE) → แก้ด้วยการ **แสดงเป็นกรอบมือถือ (phone frame) กลางจอ
บนพื้นหลังตกแต่ง** เมื่อจอ ≥ tablet เพื่อให้ดูตั้งใจ + เป็น showcase ที่เหมาะกับธรรมชาติมือถือ

## 2. Scope
- **มือถือ (< md):** เต็มจอเหมือนเดิม (ไม่เปลี่ยน UX)
- **tablet/desktop (≥ md):** การ์ดอุปกรณ์ (device frame ~400×840, ขอบมน, เงา) กลางจอ บนพื้นหลัง gradient
  - เลื่อนภายในกรอบ (internal scroll) · header sticky บน · TabBar sticky ล่าง · Speed Dial pin มุมกรอบ
- **desktop (≥ lg):** เพิ่ม **side panel** ข้างกรอบ (ชื่อโปรเจกต์ + บอกว่าเป็น LINE LIFF demo + จุดเด่น + ลิงก์ Management)
- คงเลย์เอาต์มือถือ (grid 2 คอลัมน์) — ไม่ reflow เป็น grid กว้าง (ถ้าต้องการแบบนั้นคือ "Fluid responsive" คนละ option)

### Out of scope
- ไม่แตะ admin · ไม่เปลี่ยนข้อมูล/หน้า · ไม่เพิ่ม dependency

## 3. Design
- Device = container เดียวที่เป็น scroll context เสมอ (`relative overflow-hidden`, มือถือ `h-[100dvh]`, ≥md `h-[840px] max-h-[92vh] w-[400px]` + ขอบดำ rounded เลียนแบบมือถือ)
- Backdrop: ≥md ใช้ `flex items-center justify-center` + gradient เทา/เบจอุ่น
- Speed Dial เปลี่ยน anchor เป็น `absolute` (อิงกรอบ ไม่ใช่ viewport) → pin มุมกรอบทุกขนาด
- Reduced-motion / a11y เดิมคงไว้

## 4. Acceptance
- [ ] มือถือ: เหมือนเดิม (เต็มจอ, sticky header/tabbar, speed dial มุมขวาล่าง)
- [ ] tablet (~768–1024): กรอบมือถือกลางจอ บน gradient, เลื่อนในกรอบได้, ไม่มีพื้นที่ขาวว่างเก้ๆ
- [ ] desktop (≥1024): กรอบมือถือ + side panel ข้างๆ
- [ ] TabBar + Speed Dial pin อยู่กับกรอบ (ไม่ลอยไป viewport corner) ทุกขนาด
- [ ] verify page อยู่ในกรอบเช่นกัน (ไม่มี TabBar/Speed Dial)
- [ ] build + lint เขียว · ไม่มี console error

## 5. Files
- `components/ui/speed-dial.tsx` — เพิ่ม prop `anchor: "fixed" | "absolute"`
- `app/(liff)/layout.tsx` — backdrop + side panel + device(scroll) + Speed Dial (ย้ายมาที่นี่)
- `components/liff/liff-speed-dial.tsx` — client, `anchor="absolute"`, ซ่อนเมื่ออยู่ /verify
- `app/(liff)/(app)/layout.tsx` — เอา Speed Dial ออก (ย้ายขึ้น layout บน), คง main+TabBar
- `components/liff/verify-form.tsx` — `min-h-[100dvh]` → `min-h-full` (อยู่ในกรอบ)
