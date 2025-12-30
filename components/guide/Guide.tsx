"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../settings/SettingsContext";

type Props = { totalSteps: number };

export default function Guide({ totalSteps }: Props) {
  const { settings } = useSettings();
  const [current, setCurrent] = useState(1);
  const itemsRef = useRef<Array<HTMLDivElement | null>>([]);

  const steps = useMemo(() => {
    const ko = [
      "인스타그램 설정에서 Accounts Center로 이동",
      "Your information and permissions 선택",
      "Download your information 선택",
      "Some of your info 선택",
      "Connections 선택",
      "Followers and following 체크",
      "Format: JSON 선택",
      "Download to device 선택",
      "Create files(내보내기 만들기) 진행",
      "ZIP 다운로드 후 이 앱에 업로드",
    ];

    const en = [
      "Open Instagram settings → Accounts Center",
      "Select Your information and permissions",
      "Select Download your information",
      "Choose Some of your info",
      "Select Connections",
      "Check Followers and following",
      "Choose format: JSON",
      "Choose Download to device",
      "Create files (export request)",
      "Download ZIP and upload here",
    ];

    const desc = settings.language === "en" ? en : ko;

    return Array.from({ length: totalSteps }).map((_, i) => {
      const idx = i + 1;
      const file = `/guide/step${String(idx).padStart(2, "0")}.png`;
      return { idx, file, text: desc[i] ?? `Step ${idx}` };
    });
  }, [settings.language, totalSteps]);

  useEffect(() => {
    const els = itemsRef.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];

        if (!visible) return;

        const idx = Number(
          (visible.target as HTMLElement).dataset["step"] ?? "1"
        );
        if (idx >= 1 && idx <= totalSteps) setCurrent(idx);
      },
      { root: null, threshold: [0.2, 0.4, 0.6] }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [totalSteps]);

  return (
    <section className="relative">
      {/* 중앙 상단 진행도 표시 */}
      <div className="sticky top-14 z-30 flex justify-center pt-3">
        <div className="progress rounded-full border px-4 py-2 text-sm shadow-sm backdrop-blur">
          {current}/{totalSteps}
        </div>
      </div>

      {/* 가이드 카드들 */}
      <div className="mt-4 space-y-6">
        {steps.map((s, i) => (
          <div
            key={s.idx}
            ref={(el) => {
              itemsRef.current[i] = el;
            }}
            data-step={s.idx}
            className="card rounded-2xl border p-4 shadow-sm"
          >
            <div className="imgWrap overflow-hidden rounded-xl border">
              <img src={s.file} alt={`step ${s.idx}`} className="h-auto w-full" />
            </div>

            <div className="mt-3 text-sm">
              <span className="mr-2 font-semibold">{s.idx}.</span>
              {s.text}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .progress {
          border-color: var(--card-border);
          background: color-mix(in srgb, var(--bg) 85%, transparent);
          color: var(--muted-fg);
        }

        .card {
          border-color: var(--card-border);
          background: var(--card);
          color: var(--muted-fg);
        }

        .card .font-semibold {
          color: var(--fg);
        }

        .imgWrap {
          border-color: var(--card-border);
          background: var(--muted);
        }
      `}</style>
    </section>
  );
}
