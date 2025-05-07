/**
 * ImageKit.io utility for uploading and managing images
 */
import { toast } from "@/components/ui/use-toast";
import { api } from "./api";
import { ImageItem } from "@/types/album";

interface ImageKitConfig {
  publicKey: string;
  urlEndpoint: string;
  authenticationEndpoint: string;
}

class ImageKitService {
  private config: ImageKitConfig = {
    publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "public_Ma/GzYXuWrzkHPH1rdSLqvo9b/M=",
    urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/arjunb",
    authenticationEndpoint: `${import.meta.env.VITE_API_URL || ''}/api/upload/auth`,
  };

  // Upload image to ImageKit through our backend
  async uploadImage(file: File): Promise<string> {
    try {
      const image: ImageItem = await api.uploadImage(file);
      return image.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "There was a problem uploading your image. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Delete image from ImageKit
  async deleteImage(fileId: string): Promise<boolean> {
    try {
      await api.deleteImage(fileId);
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting your image.",
        variant: "destructive",
      });
      return false;
    }
  }
}

export const imageKitService = new ImageKitService();
