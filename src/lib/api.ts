import { Album, ImageItem, PasswordVerification } from "@/types/album";

// When using Render deployment, ensure the API URL is correctly formatted with /api
let API_URL = '';

// Log the environment variable to help with debugging
console.log("API URL from env:", import.meta.env.VITE_API_URL);

// Handle different scenarios for API_URL
if (import.meta.env.VITE_API_URL) {
  // Remove trailing slash if present
  API_URL = import.meta.env.VITE_API_URL.endsWith('/') 
    ? import.meta.env.VITE_API_URL.slice(0, -1) 
    : import.meta.env.VITE_API_URL;
  
  // For Render deployment, ensure the URL includes /api
  if (API_URL.includes('onrender.com') && !API_URL.endsWith('/api')) {
    // If URL doesn't end with /api but also doesn't have a path after the domain
    if (API_URL.match(/onrender\.com\/?$/)) {
      API_URL = `${API_URL}/api`;
    }
  }
} else {
  API_URL = '/api';
}

console.log("Final API URL:", API_URL);

export const api = {
  // Albums
  async getAlbums(): Promise<Album[]> {
    try {
      const response = await fetch(`${API_URL}/albums`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching albums:', error);
      throw error;
    }
  },

  async getAlbumById(id: string): Promise<Album | undefined> {
    try {
      const response = await fetch(`${API_URL}/albums/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching album ${id}:`, error);
      throw error;
    }
  },

  async verifyAlbumPassword(id: string, password: string): Promise<PasswordVerification> {
    try {
      const response = await fetch(`${API_URL}/albums/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error verifying password for album ${id}:`, error);
      throw error;
    }
  },

  async createAlbum(album: Omit<Album, '_id'>): Promise<Album> {
    try {
      const response = await fetch(`${API_URL}/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(album),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating album:', error);
      throw error;
    }
  },

  async updateAlbum(id: string, albumData: Partial<Album>): Promise<Album> {
    try {
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(albumData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating album ${id}:`, error);
      throw error;
    }
  },

  async deleteAlbum(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/albums/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting album ${id}:`, error);
      throw error;
    }
  },

  // Images
  async uploadImage(file: File): Promise<ImageItem> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Get the ImageItem from response
      const imageItem = await response.json();
      
      // Add image dimensions by loading the image
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Add width and height to the imageItem
          resolve({
            ...imageItem,
            width: img.width,
            height: img.height
          });
        };
        img.onerror = () => {
          // If we can't load the image, just return the original item
          resolve(imageItem);
        };
        img.src = imageItem.url;
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async deleteImage(fileId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/upload/${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error deleting image ${fileId}:`, error);
      throw error;
    }
  },

  async getImageKitAuthParams(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/upload/auth`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting auth params:', error);
      throw error;
    }
  }
}; 