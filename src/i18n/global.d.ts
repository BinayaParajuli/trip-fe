import messages from "@/messages/en.json";
import { routing } from "@/i18n/routing";

// Typed translation keys: a missing or misspelt key in t("...") is a type error. en.json is the source of truth.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
