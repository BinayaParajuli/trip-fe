import { createNavigation } from "next-intl/navigation";
import { routing } from "@/i18n/routing";

// Locale-aware drop-ins for next/link and next/navigation: links keep the current language.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
