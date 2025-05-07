
import React from "react";
import { ImageItem } from "@/types/album";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Album } from "lucide-react";

interface ImageSelectorProps {
  images: ImageItem[];
  onSelectCover: (imageId: string) => void;
  onRemoveImage: (imageId: string) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  images,
  onSelectCover,
  onRemoveImage,
}) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8">
        <p className="text-gray-500">No images uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className={cn(
            "relative group rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border-2",
            image.isCover ? "border-album-dark ring-2 ring-album-dark" : "border-transparent"
          )}
        >
          <img
            src={image.url}
            alt="Album image"
            className="w-full h-40 object-cover"
          />
          
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSelectCover(image.id)}
              className="mb-2"
            >
              <Album className="mr-2 h-4 w-4" />
              Set as Cover
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemoveImage(image.id)}
            >
              Remove
            </Button>
          </div>
          
          {image.isCover && (
            <Badge className="absolute top-2 left-2 bg-album-dark">
              Cover
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageSelector;
