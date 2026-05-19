import { create } from "zustand";
import { persist } from "zustand/middleware";

type Locale = "id" | "en";

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: "id",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "woodloop-locale" }
  )
);

// Cache messages
const messagesCache: Record<string, Record<string, string>> = {};

async function loadMessages(locale: Locale): Promise<Record<string, string>> {
  if (messagesCache[locale]) return messagesCache[locale];

  // Dynamic import — hanya load file yang diperlukan
  const mod = locale === "en"
    ? await import("@/i18n/en.json")
    : await import("@/i18n/id.json");

  // Flatten nested keys: "auth.login_title" → "Masuk"
  function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, val] of Object.entries(obj)) {
      const k = prefix ? `${prefix}.${key}` : key;
      if (typeof val === "string") result[k] = val;
      else if (typeof val === "object" && val !== null)
        Object.assign(result, flatten(val as Record<string, unknown>, k));
    }
    return result;
  }

  const flat = flatten(mod.default || mod);
  messagesCache[locale] = flat;
  return flat;
}

export function useTranslation() {
  const { locale, setLocale } = useLocaleStore();
  const messages = messagesCache[locale] ?? {};

  function t(key: string, fallback?: string): string {
    return messages[key] || fallback || key;
  }

  return { t, locale, setLocale, loadMessages };
}
