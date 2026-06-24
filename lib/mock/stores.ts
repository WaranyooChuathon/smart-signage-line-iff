import type { StoreCategory } from "./types";

export interface DemoStore {
  id: string;
  name: string;
  subtitle: string;
  email: string;
  phone: string;
  accessCode: string;
  category: StoreCategory;
  lat: number;
  lng: number;
}

// Fictional, brand-free demo stores (company-safe). Credentials are fake and
// intentionally public — shown on the LIFF verify screen for the demo.
export const DEMO_STORES: DemoStore[] = [
  {
    id: "demo-riverside",
    name: "Riverside Commons",
    subtitle: "ลานกิจกรรมริมน้ำ",
    email: "hello@riverside.example",
    phone: "0812345678",
    accessCode: "DEMO01",
    category: "retail",
    lat: 18.7883,
    lng: 98.9853,
  },
  {
    id: "demo-central-court",
    name: "Central Court",
    subtitle: "โซนอาหารชั้น 2",
    email: "hello@centralcourt.example",
    phone: "0823456789",
    accessCode: "CC2026",
    category: "cafe",
    lat: 13.7466,
    lng: 100.5347,
  },
  {
    id: "demo-garden-walk",
    name: "Garden Walk",
    subtitle: "ทางเดินสวนกลางเมือง",
    email: "hello@gardenwalk.example",
    phone: "0834567890",
    accessCode: "GW2026",
    category: "service",
    lat: 7.8804,
    lng: 98.3923,
  },
];

export const DEFAULT_DEMO_STORE = DEMO_STORES[0];
