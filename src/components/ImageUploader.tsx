import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageItem } from "@/types/album";
import { imageKitService } from "@/lib/imageKit";
import { toast } from "@/components/ui/use-toast";
import { Image, Loader2, UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  onImagesUploaded: (images: ImageItem[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setTotalFiles(files.length);
    setCurrentFileIndex(0);
    
    try {
      const uploadedImages: ImageItem[] = [];
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFileIndex(i + 1);
        setCurrentFileName(file.name);
        setUploadProgress(0); // Reset progress for new file
        
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image.`,
            variant: "destructive",
          });
          continue;
        }

        // Simulate progress updates (since we can't get real progress from the API)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + Math.random() * 10;
            return newProgress >= 90 ? 90 : newProgress; // Cap at 90% until actual completion
          });
        }, 300);

        // Upload directly to API which handles ImageKit
        const image = await api.uploadImage(file);
        
        // Clear interval and set to 100%
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        uploadedImages.push(image);
        
        // Small delay to show 100% before moving to next file
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (uploadedImages.length > 0) {
        onImagesUploaded(uploadedImages);
        toast({
          title: "Upload successful",
          description: `${uploadedImages.length} images uploaded.`,
        });
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your images.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="images" className="text-lg font-medium">Upload Images</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="secondary"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isUploading ? "Uploading..." : "Browse"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Select multiple images to create your album
        </p>
      </div>

      {isUploading && (
        <div className="space-y-2 p-4 border rounded-md bg-muted/20">
          <div className="flex justify-between text-sm">
            <span>Uploading image {currentFileIndex} of {totalFiles}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground truncate">
            {currentFileName}
          </p>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Total progress: {Math.round((currentFileIndex - 1 + uploadProgress/100) / totalFiles * 100)}%</span>
          </div>
          <Progress 
            value={(currentFileIndex - 1 + uploadProgress/100) / totalFiles * 100} 
            className="h-1"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
