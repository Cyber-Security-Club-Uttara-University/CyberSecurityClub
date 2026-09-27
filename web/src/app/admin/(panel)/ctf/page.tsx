import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { canManageCtf } from "@/lib/roles";
import { getSettings } from "@/lib/content";
import { DEFAULTS } from "@/content/defaults";
import {
  CONFIG_BLOCK_KEY,
  DEFAULT_STREAK_LEVELS,
  EMPTY_CTF_CONFIG,
  PLAYERS_BLOCK_KEY,
  STREAK_LEVELS_BLOCK_KEY,
  normalizeConfig,
  normalizePlayers,
  normalizeStreakLevels,
} from "@/content/ctf";
import CtfAdmin from "@/components/admin/CtfAdmin";

export const dynamic = "force-dynamic";

export default async function CtfAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canManageCtf(user.role)) redirect("/admin");

  const [playersBlock, configBlock, eventBlock, levelsBlock, settings] = await Promise.all([
    db.contentBlock.findUnique({ where: { key: PLAYERS_BLOCK_KEY } }),
    db.contentBlock.findUnique({ where: { key: CONFIG_BLOCK_KEY } }),
    db.contentBlock.findUnique({ where: { key: "ctf-events" } }),
    db.contentBlock.findUnique({ where: { key: STREAK_LEVELS_BLOCK_KEY } }),
    getSettings(),
  ]);

  const eventSource: unknown[] =
    Array.isArray(eventBlock?.data) && eventBlock.data.length > 0
      ? eventBlock.data
      : (DEFAULTS["ctf-events"] ?? []);

  // "Overall" is a computed view, not an event you can record points against.
  const eventTabs = eventSource
    .map((e) => String((e as Record<string, unknown>)?.tab ?? "").trim())
    .filter((t) => t && t.toLowerCase() !== "overall");

  return (
    <CtfAdmin
      initialPlayers={normalizePlayers(
        playersBlock?.data ?? (DEFAULTS["ctf-players"] as unknown[]) ?? null
      )}
      initialConfig={configBlock ? normalizeConfig(configBlock.data) : EMPTY_CTF_CONFIG}
      initialLevels={normalizeStreakLevels(levelsBlock?.data ?? DEFAULT_STREAK_LEVELS)}
      eventTabs={eventTabs}
      portalUrl={settings.ctfPortalUrl || ""}
    />
  );
}
