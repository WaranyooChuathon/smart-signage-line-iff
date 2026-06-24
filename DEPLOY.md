# Deploy Runbook — Cloudflare Workers + D1

แอปนี้ deploy บน **Cloudflare Workers** (ผ่าน `@opennextjs/cloudflare`) ใช้ **Cloudflare D1**
มี **env-toggle**: ไม่ตั้ง `DATA_SOURCE` → mock ล้วน (กดเล่นได้ทันที) · ตั้ง `DATA_SOURCE=real` → อ่านจาก D1

> 🔒 publish เฉพาะโฟลเดอร์ `web/` — โฟลเดอร์ระดับบน (PrototypeHTML, SPEC, tasks) ไม่ต้อง push

🧑 = ผู้ใช้ทำเอง · ✅ = เตรียม/ทำไว้แล้ว

---

## สถานะที่ทำไว้แล้ว ✅
- ติดตั้ง `@opennextjs/cloudflare` + `wrangler` · `open-next.config.ts` · `next.config.ts` (initOpenNextCloudflareForDev)
- `wrangler.jsonc` — ผูก D1 binding `DB` (db: `d1-tutorial-line-liff-signage`) + cron `5 17 * * *` (00:05 ไทย)
- `lib/db/client.ts#getDb()` → `drizzle(getCloudflareContext().env.DB)`
- **Schema migrate ขึ้น remote D1 แล้ว** (11 ตาราง — ยืนยันด้วย `wrangler d1 execute ... --remote`)
- Seed route `app/api/seed` (POST/GET, ป้องกันด้วย `AUTH_SECRET`)

## ขั้นที่ 1 — ก่อน push (company-safe) 🧑
- [ ] แก้ `GITHUB_URL` / `RESUME_URL` ใน `app/page.tsx`
- [ ] `git status` ต้องไม่เห็น `.env.local`
- [ ] (ออปชัน) ใส่ live URL ใน `README.md`

## ขั้นที่ 2 — Push ขึ้น GitHub 🧑
```bash
cd web
git init && git add . && git commit -m "Smart Signage Line-LIFF portfolio"
git branch -M main
git remote add origin https://github.com/<you>/smart-signage-liff.git
git push -u origin main
```

## ขั้นที่ 3 — ตั้ง secret + deploy 🧑
```bash
wrangler secret put AUTH_SECRET           # วางค่าเดียวกับใน .env.local
npx wrangler deploy --var DATA_SOURCE:real   # หรือเพิ่ม "vars":{"DATA_SOURCE":"real"} ใน wrangler.jsonc
# วิธีหลัก:
npm run deploy                            # opennextjs-cloudflare build && deploy
```
> ถ้าจะรันแบบ **mock** บน Workers (ไม่ใช้ D1): ข้าม secret/DATA_SOURCE ได้เลย

## ขั้นที่ 4 — Seed ข้อมูลลง D1 🧑
หลัง deploy แล้ว (มี URL เช่น `https://smart-signage-liff.<you>.workers.dev`):
```bash
curl "https://<your-worker-url>/api/seed?key=<AUTH_SECRET>"
```
จะสร้าง demo admin + demo stores + ข้อมูลสถิติของ "เมื่อวาน/วันนี้" ให้ทุกร้าน (idempotent รันซ้ำได้)

## ขั้นที่ 5 — ยืนยัน 🧑
- [ ] เปิด URL → landing + LIFF demo + admin login (`admin@demo.local` / `demo1234`)
- [ ] ถ้า `DATA_SOURCE=real` → หน้า LIFF/Analytics อ่านจาก D1 จริง
- [ ] Cron trigger เห็น schedule ใน Cloudflare dashboard (รัน seed รายวัน)

---

## คำสั่งที่เกี่ยวข้อง
```bash
npm run dev            # dev (mock default)
npm run preview        # build + รันบน workerd จริงในเครื่อง (ทดสอบ binding/real ก่อน deploy)
npm run deploy         # deploy ขึ้น Cloudflare Workers
npm run cf-typegen     # regen type ของ binding หลังแก้ wrangler.jsonc
npm run db:generate    # สร้าง migration จาก schema (drizzle)
npm run db:apply       # apply migration ขึ้น remote D1 (ทำไปแล้ว)
```

### หมายเหตุ
- การ seed ต้องยิงที่ worker ที่ deploy แล้ว (binding ชี้ remote D1) — `next dev` ในเครื่องจะชี้ D1 local (miniflare) แทน
- ต้องการ cron ที่ Cloudflare เรียก seed อัตโนมัติ: ใช้ Cron Trigger + scheduled handler หรือยิง `/api/seed` จาก GitHub Actions cron ก็ได้
