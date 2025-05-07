export interface ImageItem {
  id: string;
  url: string;
  fileId: string; // ImageKit file ID for deleting
  isCover: boolean;
  createdAt: string;
  width?: number; // Image width for aspect ratio handling
  height?: number; // Image height for aspect ratio handling
}

export interface Album {
  _id?: string; // MongoDB ID
  id?: string; // Keeping for backward compatibility
  title: string;
  photographerName: string; // Required field for photographer name
  isPasswordProtected?: boolean;
  password?: string; // Password for protected albums
  coverImage: string;
  images: ImageItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordVerification {
  verified: boolean;
}
