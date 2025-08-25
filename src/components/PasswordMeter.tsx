// components/PasswordMeter.tsx
"use client";
import { useMemo } from "react";

export default function PasswordMeter({ value }: { value: string }) {
  const score = useMemo(() => {
    let s = 0;
    if (value.length >= 6) s++;
    if (value.length >= 10) s++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) s++;
    if (/\d/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return Math.min(s, 5);
  }, [value]);

  const label = ["Muito fraca","Fraca","Ok","Forte","Excelente"][Math.max(0, score-1)] || "Muito fraca";

  return (
    <div className="mt-2">
      <div className="h-2 w-full rounded bg-[#E2E8F0] overflow-hidden">
        <div
          className="h-2 transition-all"
          style={{
            width: `${(score/5)*100}%`,
            background: "#0F766E",
          }}
        />
      </div>
      <div className="mt-1 text-xs text-[#475569]">{label}</div>
    </div>
  );
}
