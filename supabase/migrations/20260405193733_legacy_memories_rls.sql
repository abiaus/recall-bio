-- Permitir que un heredero pueda hacer SELECT a las memorias si el legacy_access está activo.
CREATE POLICY "Heirs can view memories of active legacies" ON "public"."memories"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.legacy_access la
    WHERE la.owner_user_id = memories.user_id
    AND la.heir_user_id = auth.uid()
    AND la.status = 'active'
  )
);
