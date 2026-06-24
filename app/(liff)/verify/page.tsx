import { VerifyForm } from "@/components/liff/verify-form";
import { getDemoStore } from "@/lib/data/stores";

export default function VerifyPage() {
  const demo = getDemoStore();
  return (
    <VerifyForm
      demoName={demo.name}
      demoPhone={demo.phone}
      demoCode={demo.accessCode}
    />
  );
}
