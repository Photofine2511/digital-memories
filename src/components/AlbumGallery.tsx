import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Album } from "@/types/album";
import { albumStorage } from "@/lib/albumStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Album as AlbumIcon, Loader2, Lock, QrCode } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Badge } from "@/components/ui/badge";

const AlbumGallery: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load albums from API
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await albumStorage.getAlbums();
        setAlbums(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch albums:", err);
        setError("Failed to load albums. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load your albums. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [toast]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Digital Albums</h2>
        <Button onClick={() => navigate("/create")}>Create New Album</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="text-center p-8 animate-fade-in">
          <CardContent className="pt-6 pb-8">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlbumIcon className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Albums</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate("/create")}>Create New Album</Button>
          </CardContent>
        </Card>
      ) : albums.length === 0 ? (
        <Card className="text-center p-8 animate-fade-in">
          <CardContent className="pt-6 pb-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <AlbumIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Albums Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first digital photo album to get started!
            </p>
            <Button onClick={() => navigate("/create")}>Create Your First Album</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {albums.map((album) => (
            <Card key={album._id || album.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 relative">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={album.coverImage} 
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                {album.isPasswordProtected && (
                  <Badge variant="secondary" className="absolute top-2 right-2 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Protected
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg line-clamp-1">{album.title}</CardTitle>
                <p className="text-sm mt-1">
                  By {album.photographerName}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {album.images.length} {album.images.length === 1 ? 'photo' : 'photos'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created {new Date(album.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => navigate(`/album/${album._id || album.id}`)}
                >
                  View Album
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/album/${album._id || album.id}?tab=share`)}
                  title="Album QR Code"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumGallery;
