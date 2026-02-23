"use server";

import crypto from "crypto";

export async function generateUploadSignature(folder: string) {
  const timestamp = Math.round(new Date().getTime() / 1000).toString();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  
  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET is not set");
  }

  // Cloudinary signature string needs to be strictly ordered alphabetically
  const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  
  const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}
