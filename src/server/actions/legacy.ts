"use server";

import { createClient } from "@/lib/supabase/server";
import { sendLegacyInvitationEmail } from "@/lib/email/resend";

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
        .schema("public")
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

    // Enviar email de invitación
    const ownerName = user.user_metadata?.full_name || user.email || "Un usuario";
    const emailResult = await sendLegacyInvitationEmail({
        to: heirEmail,
        ownerName,
        relationship,
    });

    // Si el email falla, logueamos pero no fallamos la operación completa
    // (el registro ya está en la BD, el usuario puede aceptar desde la app)
    if (!emailResult.success) {
        console.error("Error al enviar email de invitación:", emailResult.error);
        // Continuamos con éxito porque el registro se creó correctamente
    }

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
        .schema("public")
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
        .schema("public")
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
        .schema("public")
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
        .schema("public")
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
        .schema("public")
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
