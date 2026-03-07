"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteMemory(memoryId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Not authenticated" };
        }

        // Fetch media associated with this memory to delete from storage
        const { data: mediaFiles } = await supabase
            .from("memory_media")
            .select("storage_path, storage_bucket")
            .eq("memory_id", memoryId)
            .eq("user_id", user.id);

        if (mediaFiles && mediaFiles.length > 0) {
            // Group by bucket
            const bucketMap = new Map<string, string[]>();
            mediaFiles.forEach((media) => {
                if (!bucketMap.has(media.storage_bucket)) {
                    bucketMap.set(media.storage_bucket, []);
                }
                bucketMap.get(media.storage_bucket)!.push(media.storage_path);
            });

            // Delete files from storage
            for (const [bucket, paths] of bucketMap.entries()) {
                const { error: storageError } = await supabase.storage
                    .from(bucket)
                    .remove(paths);

                if (storageError) {
                    console.error(`Error deleting files from bucket ${bucket}:`, storageError);
                    // Decide whether to fail the whole deletion or continue.
                    // Usually continuing is okay if the DB row gets deleted (cascade or trigger).
                }
            }
        }

        // Delete the memory record. 
        // Note: cascade rules in DB should handle the memory_media rows deletion.
        const { error } = await supabase
            .from("memories")
            .delete()
            .eq("id", memoryId)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting memory from DB:", error);
            return { success: false, error: "Failed to delete memory" };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error deleting memory:", error);
        return { success: false, error: "Unexpected error" };
    }
}
