"use server";

import { createClient } from "@/lib/supabase/server";

export async function inviteHeir(
  heirEmail: string,
  relationship?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .insert({
      owner_user_id: user.id,
      heir_email: heirEmail,
      relationship: relationship || null,
      status: "invited",
      release_mode: "hybrid",
    });

  if (error) {
    return { success: false, error: error.message };
  }

  // TODO: Send invitation email via Supabase Edge Function or external service

  return { success: true };
}

export async function acceptInvitation(
  legacyAccessId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .update({
      status: "accepted",
      heir_user_id: user.id,
    })
    .eq("id", legacyAccessId)
    .eq("heir_email", user.email!);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function activateLegacyAccess(
  legacyAccessId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .update({
      status: "active",
      effective_at: new Date().toISOString(),
    })
    .eq("id", legacyAccessId)
    .eq("owner_user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log audit
  await supabase
    .schema("recallbio")
    .from("audit_logs")
    .insert({
      actor_user_id: user.id,
      action: "activate_legacy_access",
      entity: "legacy_access",
      entity_id: legacyAccessId,
      metadata: { legacy_access_id: legacyAccessId },
    });

  return { success: true };
}

export async function revokeLegacyAccess(
  legacyAccessId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .update({
      status: "revoked",
    })
    .eq("id", legacyAccessId)
    .eq("owner_user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Log audit
  await supabase
    .schema("recallbio")
    .from("audit_logs")
    .insert({
      actor_user_id: user.id,
      action: "revoke_legacy_access",
      entity: "legacy_access",
      entity_id: legacyAccessId,
      metadata: { legacy_access_id: legacyAccessId },
    });

  return { success: true };
}
