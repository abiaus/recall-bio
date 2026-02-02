"use server";

import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";

export async function exportMemoriesToMarkdown(locale: string): Promise<{
  success: boolean;
  content?: string;
  error?: string;
}> {
  // Mantener compatibilidad con versión anterior (solo Markdown)
  const zipResult = await exportMemoriesToZip(locale);
  if (!zipResult.success || !zipResult.zipBuffer) {
    return zipResult;
  }

  // Convertir Uint8Array a Buffer para JSZip
  const buffer = Buffer.from(zipResult.zipBuffer);

  // Extraer solo el Markdown del ZIP para compatibilidad
  const zip = await JSZip.loadAsync(buffer);
  const markdownFile = zip.file("memorias.md");
  if (!markdownFile) {
    return { success: false, error: "No se pudo extraer el Markdown del ZIP" };
  }

  const markdownContent = await markdownFile.async("string");
  return { success: true, content: markdownContent };
}

export async function exportMemoriesToZip(locale: string): Promise<{
  success: boolean;
  zipBuffer?: Uint8Array;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  try {
    // Obtener el nombre del usuario desde el perfil
    const { data: profile } = await supabase
      .schema("public")
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();

    const displayName = profile?.display_name || user.email || "Usuario";

    // Obtener todas las memorias del usuario (sin límite)
    const { data: memories, error: memoriesError } = await supabase
      .schema("public")
      .from("memories")
      .select(
        "id, content_text, prompt_date, created_at, questions!inner(text, text_es)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }); // Más antiguas primero

    if (memoriesError) {
      return { success: false, error: memoriesError.message };
    }

    if (!memories || memories.length === 0) {
      return { success: false, error: "No hay memorias para exportar" };
    }

    // Obtener todos los archivos de audio del usuario
    const { data: audioFiles, error: audioError } = await supabase
      .schema("public")
      .from("memory_media")
      .select("memory_id, storage_path, storage_bucket")
      .eq("user_id", user.id)
      .eq("kind", "audio");

    if (audioError) {
      console.error("Error obteniendo archivos de audio:", audioError);
      // Continuar sin audio si hay error
    }

    // Generar contenido Markdown
    const lines: string[] = [];

    // Encabezado
    lines.push(`# Memorias de ${displayName}`);
    lines.push("");
    lines.push(`Generado el: ${new Date().toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`);
    lines.push("");
    lines.push("---");
    lines.push("");

    // Procesar cada memoria
    for (const memory of memories) {
      const question = Array.isArray(memory.questions)
        ? memory.questions[0]
        : memory.questions;

      // Usar el texto de la pregunta según el locale
      const questionText =
        locale === "es" && question.text_es
          ? question.text_es
          : question.text;

      // Formatear fecha de respuesta
      const responseDate = memory.prompt_date
        ? new Date(memory.prompt_date)
        : new Date(memory.created_at);

      const formattedDate = responseDate.toLocaleDateString(
        locale === "es" ? "es-ES" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      // Agregar sección de memoria
      lines.push(`## ${formattedDate} - ${questionText}`);
      lines.push("");

      // Agregar respuesta de texto o indicador de audio
      if (memory.content_text && memory.content_text.trim()) {
        lines.push(memory.content_text);
      } else {
        const audioMessage =
          locale === "es"
            ? "*Esta memoria contiene una grabación de audio.*"
            : "*This memory contains an audio recording.*";
        lines.push(audioMessage);
      }

      lines.push("");
      lines.push("---");
      lines.push("");
    }

    const markdownContent = lines.join("\n");

    // Crear ZIP
    const zip = new JSZip();

    // Agregar Markdown al ZIP
    zip.file("memorias.md", markdownContent);

    // Descargar y agregar archivos de audio al ZIP
    if (audioFiles && audioFiles.length > 0) {
      // Descargar archivos en paralelo usando Promise.allSettled
      const downloadPromises = audioFiles.map(async (audioFile) => {
        try {
          const { data, error } = await supabase.storage
            .from(audioFile.storage_bucket)
            .download(audioFile.storage_path);

          if (error || !data) {
            console.error(`Error descargando audio ${audioFile.storage_path}:`, error);
            return null;
          }

          // Convertir Blob a Buffer
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          // Extraer nombre del archivo del path
          const pathParts = audioFile.storage_path.split("/");
          const filename = pathParts[pathParts.length - 1];

          // Agregar al ZIP en carpeta audio/{memory_id}/
          const zipPath = `audio/${audioFile.memory_id}/${filename}`;
          zip.file(zipPath, buffer);

          return { success: true, memoryId: audioFile.memory_id };
        } catch (err) {
          console.error(`Error procesando audio ${audioFile.storage_path}:`, err);
          return null;
        }
      });

      // Esperar todas las descargas (incluso si algunas fallan)
      await Promise.allSettled(downloadPromises);
    }

    // Generar ZIP como Buffer y convertir a Uint8Array para serialización
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    // Convertir Buffer a Uint8Array para serialización en Next.js
    const zipUint8Array = new Uint8Array(zipBuffer);

    return { success: true, zipBuffer: zipUint8Array };
  } catch (error) {
    console.error("Error exporting memories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
