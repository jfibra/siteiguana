import { createSupabaseClient } from "./client"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes
const MAX_FILES_PER_USER = 8
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export async function uploadImageToS3(
  file: File,
  userId: string,
  websiteId: string,
  onProgress?: (progress: UploadProgress) => void,
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.",
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File size too large. Maximum size is 50MB.",
      }
    }

    const supabase = createSupabaseClient()

    // Check existing files count for user
    const { data: existingFiles, error: countError } = await supabase.storage
      .from("websites_assets")
      .list(`${userId}/${websiteId}`, {
        limit: MAX_FILES_PER_USER + 1,
      })

    if (countError) {
      return {
        success: false,
        error: "Failed to check existing files.",
      }
    }

    if (existingFiles && existingFiles.length >= MAX_FILES_PER_USER) {
      return {
        success: false,
        error: `Maximum of ${MAX_FILES_PER_USER} images allowed per website.`,
      }
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `image-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/${websiteId}/${fileName}`

    // Upload file with progress tracking
    const { data, error } = await supabase.storage.from("websites_assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("websites_assets").getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Upload failed: ${error.message || "Unknown error"}`,
    }
  }
}

export async function deleteImageFromS3(filePath: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()

    const { error } = await supabase.storage.from("websites_assets").remove([filePath])

    return !error
  } catch (error) {
    console.error("Delete failed:", error)
    return false
  }
}

export async function getUserImageCount(userId: string, websiteId: string): Promise<number> {
  try {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase.storage.from("websites_assets").list(`${userId}/${websiteId}`)

    if (error) return 0
    return data?.length || 0
  } catch (error) {
    return 0
  }
}

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.",
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size too large. Maximum size is 50MB.",
    }
  }

  return { valid: true }
}
