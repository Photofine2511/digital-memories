import { Album } from "@/types/album";
import { api } from "./api";

export const albumStorage = {
  // Save an album to MongoDB via API
  async saveAlbum(album: Album): Promise<Album> {
    try {
      if (album._id) {
        // Update existing album
        return await api.updateAlbum(album._id, album);
      } else {
        // Create new album
        return await api.createAlbum(album);
      }
    } catch (error) {
      console.error("Error saving album:", error);
      throw error;
    }
  },
  
  // Get all albums from MongoDB via API
  async getAlbums(): Promise<Album[]> {
    try {
      return await api.getAlbums();
    } catch (error) {
      console.error("Error getting albums:", error);
      return [];
    }
  },
  
  // Get a specific album by ID from MongoDB via API
  async getAlbum(id: string): Promise<Album | undefined> {
    try {
      return await api.getAlbumById(id);
    } catch (error) {
      console.error(`Error getting album ${id}:`, error);
      return undefined;
    }
  },
  
  // Verify album password
  async verifyPassword(id: string, password: string): Promise<boolean> {
    try {
      const result = await api.verifyAlbumPassword(id, password);
      return result.verified;
    } catch (error) {
      console.error(`Error verifying password for album ${id}:`, error);
      return false;
    }
  },
  
  // Delete an album by ID from MongoDB via API
  async deleteAlbum(id: string): Promise<void> {
    try {
      await api.deleteAlbum(id);
    } catch (error) {
      console.error(`Error deleting album ${id}:`, error);
      throw error;
    }
  },
  
  // Compress album data by reducing image quality or removing unnecessary data
  compressAlbums(albums: Album[]): Album[] {
    return albums.map(album => {
      // Create a compressed version of each album
      return {
        ...album,
        images: album.images.map(img => ({
          ...img,
          // Use a thumbnail version for storage if the URL is from an image service
          url: this.getCompressedImageUrl(img.url)
        }))
      };
    });
  },

  // Helper to get a compressed version of an image URL
  getCompressedImageUrl(url: string): string {
    // If this is a data URL (base64), we could compress it
    // For now, we're just returning the original URL
    // In a real app, you might use a service like ImageKit's transformation parameters
    return url;
  }
};
