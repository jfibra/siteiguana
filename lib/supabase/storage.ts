import { getSupabaseBrowserClient, getSupabaseServerClient } from "./supabase"

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME || "user-websites"

export async function uploadProfileImage(file: File, userId: string): Promise<{ publicUrl?: string; error?: Error }> {
  try {
    const supabase = getSupabaseServerClient()

    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 50MB limit")
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload JPEG, PNG, WebP, or GIF images only.")
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()?.toLowerCase()
    const fileName = `profile-${userId}-${Date.now()}.${fileExt}`
    const filePath = `profiles/${userId}/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage.from("user-profiles").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (error) {
      throw error
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("user-profiles").getPublicUrl(filePath)

    return { publicUrl: urlData.publicUrl }
  } catch (error) {
    return { error: error as Error }
  }
}

export async function uploadWebsiteAsset(
  file: File,
  userId: string,
  websiteId: string,
  assetType: "logo" | "preview_image" | "profile" | "other" = "other",
): Promise<{ publicUrl: string | null; error: Error | null; path: string | null }> {
  const supabase = getSupabaseBrowserClient()
  const fileExt = file.name.split(".").pop()
  const fileName = `${assetType}-${Date.now()}.${fileExt}`

  // Handle profile images differently
  const filePath = assetType === "profile" ? `profiles/${userId}/${fileName}` : `${userId}/${websiteId}/${fileName}`

  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file)

  if (error) {
    console.error("Error uploading file:", error)
    return { publicUrl: null, error, path: null }
  }

  const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return { publicUrl: urlData?.publicUrl || null, error: null, path: filePath }
}
