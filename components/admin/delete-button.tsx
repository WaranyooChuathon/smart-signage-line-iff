"use client";

import { deleteStoreAction } from "@/app/admin/(panel)/stores/actions";

export function DeleteStoreButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteStoreAction}
      onSubmit={(e) => {
        if (!confirm(`ลบร้าน "${name}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        ลบ
      </button>
    </form>
  );
}
