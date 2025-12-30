"use client";

import React, { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";

export type Language = "ko" | "en";
export type ThemeMode = "light" | "dark";

export type AppSettings = {
  language: Language;
  theme: ThemeMode;
};

type Ctx = {
  settings: AppSettings;
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
};

const KEY = "toss-inapp-settings-v1";
const DEFAULT: AppSettings = { language: "ko", theme: "light" };

const SettingsContext = createContext<Ctx | null>(null);

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

function readInitial(): AppSettings {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const language: Language = parsed.language === "en" ? "en" : "ko";
    const theme: ThemeMode = parsed.theme === "dark" ? "dark" : "light";
    return { language, theme };
  } catch {
    return DEFAULT;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // ✅ 처음 렌더부터 localStorage 기반으로 상태가 잡힘 (light인데 화면 dark 같은 불일치 줄어듦)
  const [settings, setSettings] = useState<AppSettings>(readInitial);

  // ✅ DOM 적용을 useLayoutEffect로: 화면 깜빡임/불일치 최소화
  useLayoutEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    applyTheme(settings.theme);
  }, [settings]);

  const value = useMemo<Ctx>(
    () => ({
      settings,
      setLanguage: (lang) => setSettings((p) => ({ ...p, language: lang })),
      toggleTheme: () =>
        setSettings((p) => ({ ...p, theme: p.theme === "light" ? "dark" : "light" })),
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
