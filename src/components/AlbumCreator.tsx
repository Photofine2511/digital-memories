import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Album, ImageItem } from "@/types/album";
import ImageUploader from "./ImageUploader";
import ImageSelector from "./ImageSelector";
import { albumStorage } from "@/lib/albumStorage";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Switch } from "@/components/ui/switch";

const AlbumCreator: React.FC = () => {
  const [title, setTitle] = useState("");
  const [photographerName, setPhotographerName] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImagesUploaded = (newImages: ImageItem[]) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
    setError(null); // Clear any previous errors when new images are added
  };

  const handleSelectCover = (imageId: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        isCover: img.id === imageId,
      }))
    );
    setError(null); // Clear any previous errors
  };

  const handleRemoveImage = async (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId);
    
    if (imageToRemove && imageToRemove.fileId) {
      try {
        // Delete from ImageKit
        await api.deleteImage(imageToRemove.fileId);
      } catch (error) {
        console.error("Failed to delete image from server:", error);
        // Continue with removal from UI even if server delete fails
      }
    }
    
    setImages(images.filter((img) => img.id !== imageId));
  };

  const handleCreateAlbum = async () => {
    // Validate inputs
    if (!title.trim()) {
      toast({
        title: "Missing Title",
        description: "Please provide a title for your album.",
        variant: "destructive",
      });
      return;
    }

    if (!photographerName.trim()) {
      toast({
        title: "Missing Photographer Name",
        description: "Please provide the name of the photographer.",
        variant: "destructive",
      });
      return;
    }

    if (isPasswordProtected && !password.trim()) {
      toast({
        title: "Missing Password",
        description: "Please provide a password for your protected album.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload at least one image for your album.",
        variant: "destructive",
      });
      return;
    }

    // Check if a cover image is selected
    const hasCoverImage = images.some((img) => img.isCover);
    if (!hasCoverImage) {
      toast({
        title: "No Cover Selected",
        description: "Please select a cover image for your album.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create the album object
      const coverImage = images.find((img) => img.isCover)?.url || "";
      const newAlbum: Album = {
        title,
        photographerName,
        isPasswordProtected,
        password: isPasswordProtected ? password : "",
        coverImage,
        images,
      };

      // Save to MongoDB via API
      const savedAlbum = await albumStorage.saveAlbum(newAlbum);

      // Show success message
      toast({
        title: "Album Created",
        description: "Your digital album has been created successfully.",
      });

      // Navigate to the album viewer
      navigate(`/album/${savedAlbum._id}`);
    } catch (error) {
      console.error("Error creating album:", error);
      
      // Display a more helpful error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create album. Please try again.";
      
      setError(errorMessage);
      
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center sm:text-left">Create Digital Album</CardTitle>
        <CardDescription>Upload photos and create a beautiful digital album to share</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Album Title</Label>
          <Input
            id="title"
            placeholder="Enter album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="photographerName">
            Photographer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="photographerName"
            placeholder="Enter photographer's name"
            value={photographerName}
            onChange={(e) => setPhotographerName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 border p-4 rounded-md">
          <div className="flex items-center justify-between">
            <Label htmlFor="password-protection" className="cursor-pointer">
              Password Protection
            </Label>
            <Switch
              id="password-protection"
              checked={isPasswordProtected}
              onCheckedChange={setIsPasswordProtected}
            />
          </div>
          
          {isPasswordProtected && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="password">Album Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Only people with this password will be able to view the album.
              </p>
            </div>
          )}
        </div>

        <ImageUploader onImagesUploaded={handleImagesUploaded} />

        <div className="space-y-2">
          <Label className="text-lg font-medium">Preview & Select Cover</Label>
          <ImageSelector
            images={images}
            onSelectCover={handleSelectCover}
            onRemoveImage={handleRemoveImage}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button onClick={handleCreateAlbum} disabled={isCreating}>
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isCreating ? "Creating..." : "Create Album"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlbumCreator;
