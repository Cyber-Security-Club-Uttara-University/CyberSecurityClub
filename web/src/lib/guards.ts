import { NextResponse } from "next/server";
import { getCurrentUser, type CurrentUser } from "@/lib/session";
import {
  canAccessSection,
  canEditSettings,
  canManageUsers,
  canViewLogs,
  type Role,
} from "@/lib/roles";

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export const forbidden = (message = "You do not have access to this resource") =>
  NextResponse.json({ error: message }, { status: 403 });

/** Loads the current user or returns an unauthorized response. */
export async function requireUser(): Promise<CurrentUser | NextResponse> {
  const user = await getCurrentUser();
  return user ?? unauthorized();
}

export function isResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}

/** Section content requires the role to be allowed that section. */
export async function requireSection(
  sectionKey: string
): Promise<CurrentUser | NextResponse> {
  const user = await requireUser();
  if (isResponse(user)) return user;
  if (!canAccessSection(user.role, sectionKey)) {
    return forbidden(`Your role cannot edit "${sectionKey}"`);
  }
  return user;
}

export async function requireData(): Promise<CurrentUser | NextResponse> {
  const user = await requireUser();
  if (isResponse(user)) return user;
  return user;
}

export async function requireCapability(
  role: Role,
  capability: "users" | "logs" | "settings"
): Promise<NextResponse | null> {
  const allowed =
    capability === "users"
      ? canManageUsers(role)
      : capability === "logs"
        ? canViewLogs(role)
        : canEditSettings(role);
  if (allowed) return null;
  return forbidden();
}
