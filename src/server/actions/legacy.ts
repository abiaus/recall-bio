"use server";

import { createClient } from "@/lib/supabase/server";
import { sendLegacyInvitationEmail } from "@/lib/email/resend";

export async function inviteHeir(
    heirEmail: string,
    relationship?: string,
    locale?: string
): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "No autenticado" };
    }

    // Insertar con returning para obtener el token generado
    const { data: insertedData, error } = await supabase
        .schema("public")
        .from("legacy_access")
        .insert({
            owner_user_id: user.id,
            heir_email: heirEmail,
            relationship: relationship || null,
            status: "invited",
            release_mode: "hybrid",
        })
        .select("invitation_token")
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    if (!insertedData?.invitation_token) {
        return { success: false, error: "Error al generar token de invitación" };
    }

    // Enviar email de invitación
    const ownerName = user.user_metadata?.full_name || user.email || "Un usuario";
    const emailResult = await sendLegacyInvitationEmail({
        to: heirEmail,
        ownerName,
        relationship,
        invitationToken: insertedData.invitation_token,
        locale: (locale as "en" | "es") || "es",
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

export async function verifyInvitationToken(
    token: string
): Promise<{ valid: boolean; error?: string; heirEmail?: string }> {
    const supabase = await createClient();

    // Buscar invitación por token
    const { data: invitation, error: fetchError } = await supabase
        .schema("public")
        .from("legacy_access")
        .select("id, heir_email, status, invitation_expires_at")
        .eq("invitation_token", token)
        .single();

    if (fetchError || !invitation) {
        return { valid: false, error: "Invitación no encontrada o inválida" };
    }

    // Verificar que no esté expirada
    if (invitation.invitation_expires_at) {
        const expiresAt = new Date(invitation.invitation_expires_at);
        if (expiresAt < new Date()) {
            return { valid: false, error: "La invitación ha expirado" };
        }
    }

    // Verificar que esté en estado "invited"
    if (invitation.status !== "invited") {
        return { valid: false, error: "Esta invitación ya fue procesada" };
    }

    return { valid: true, heirEmail: invitation.heir_email };
}

export async function acceptInvitationByToken(
    token: string
): Promise<{ success: boolean; error?: string; legacyId?: string; requiresAuth?: boolean; heirEmail?: string }> {
    const supabase = await createClient();

    // Buscar invitación por token
    const { data: invitation, error: fetchError } = await supabase
        .schema("public")
        .from("legacy_access")
        .select("id, heir_email, status, invitation_expires_at")
        .eq("invitation_token", token)
        .single();

    if (fetchError || !invitation) {
        return { success: false, error: "Invitación no encontrada o inválida" };
    }

    // Verificar que no esté expirada
    if (invitation.invitation_expires_at) {
        const expiresAt = new Date(invitation.invitation_expires_at);
        if (expiresAt < new Date()) {
            return { success: false, error: "La invitación ha expirado" };
        }
    }

    // Verificar que esté en estado "invited"
    if (invitation.status !== "invited") {
        return { success: false, error: "Esta invitación ya fue procesada" };
    }

    // Verificar si el usuario está autenticado
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Usuario no autenticado - necesita login/signup
        return {
            success: false,
            error: "Debes iniciar sesión para aceptar esta invitación",
            requiresAuth: true,
            heirEmail: invitation.heir_email,
            legacyId: invitation.id,
        };
    }

    // Verificar que el email del usuario coincida con el heredero
    if (user.email !== invitation.heir_email) {
        return {
            success: false,
            error: `El email de tu cuenta (${user.email}) no coincide con el email de la invitación (${invitation.heir_email})`,
            heirEmail: invitation.heir_email,
        };
    }

    // Aceptar la invitación
    const { error: updateError } = await supabase
        .schema("public")
        .from("legacy_access")
        .update({
            status: "accepted",
            heir_user_id: user.id,
            invitation_token: null, // Invalidar token (single-use)
        })
        .eq("id", invitation.id)
        .eq("invitation_token", token);

    if (updateError) {
        return { success: false, error: updateError.message };
    }

    return { success: true, legacyId: invitation.id };
}
