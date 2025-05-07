import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Album } from "@/types/album";
import { albumStorage } from "@/lib/albumStorage";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Lock, Eye, EyeOff, QrCode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AlbumQRCode from "./AlbumQRCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AlbumViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("photos");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get the tab parameter from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam === 'share') {
      setActiveTab('share');
    }
  }, []);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!id) {
        setError("Album ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const foundAlbum = await albumStorage.getAlbum(id);
        if (foundAlbum) {
          setAlbum(foundAlbum);
          // If album is not password protected, mark as verified
          if (!foundAlbum.isPasswordProtected) {
            setIsPasswordVerified(true);
          }
          setError(null);
        } else {
          setError("Album not found");
        }
      } catch (err) {
        console.error(`Error fetching album ${id}:`, err);
        setError("Failed to load album data. Please try again later.");
        toast({
          title: "Error",
          description: "Could not load album data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id, toast]);

  const handleVerifyPassword = async () => {
    if (!id || !passwordInput.trim()) return;
    
    setIsCheckingPassword(true);
    setPasswordError(null);
    
    try {
      const isVerified = await albumStorage.verifyPassword(id, passwordInput);
      
      if (isVerified) {
        setIsPasswordVerified(true);
        setPasswordError(null);
      } else {
        setPasswordError("Incorrect password. Please try again.");
        toast({
          title: "Authentication Failed",
          description: "The password you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error verifying password:", err);
      setPasswordError("Failed to verify password. Please try again.");
      toast({
        title: "Verification Error",
        description: "An error occurred while verifying the password.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingPassword(false);
    }
  };

  const handleDeleteAlbum = async () => {
    if (!album || !album._id) return;
    
    setIsDeleting(true);
    try {
      await albumStorage.deleteAlbum(album._id);
      toast({
        title: "Album Deleted",
        description: "Your album has been deleted successfully.",
      });
      navigate("/");
    } catch (err) {
      console.error(`Error deleting album ${album._id}:`, err);
      toast({
        title: "Deletion Failed",
        description: "Could not delete the album. Please try again.",
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-2">Loading album...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardContent className="pt-6 text-center">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <p className="text-xl font-semibold text-destructive">Album not found</p>
          <p className="text-muted-foreground my-4">The album you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate("/")}>Go Back to Home</Button>
        </CardContent>
      </Card>
    );
  }

  // Password protection screen
  if (album.isPasswordProtected && !isPasswordVerified) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center">
            <Lock className="mr-2 h-5 w-5" />
            Password Protected Album
          </CardTitle>
          <CardDescription>
            This album is password protected. Please enter the password to view it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="album-password">Password</Label>
              <div className="relative">
                <Input
                  id="album-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter album password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyPassword();
                    }
                  }}
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
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyPassword} 
                disabled={isCheckingPassword || !passwordInput.trim()}
              >
                {isCheckingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Album"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Album content (only shown when verified or not password protected)
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold">{album.title}</CardTitle>
            <p className="text-sm font-medium mt-1">
              By {album.photographerName}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Created on {new Date(album.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
            <TabsTrigger value="share">Share Album</TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos">
            <Carousel className="w-full">
              <CarouselContent>
                {album.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="p-0 flex items-center justify-center">
                          {image.width && image.height ? (
                            <AspectRatio ratio={image.width / image.height} className="bg-muted">
                              <img
                                src={image.url}
                                alt="Album image"
                                className="object-contain w-full h-full rounded-md"
                              />
                            </AspectRatio>
                          ) : (
                            <div className="relative w-full">
                              <div className="pt-[56.25%]">
                                <img
                                  src={image.url}
                                  alt="Album image"
                                  className="absolute inset-0 object-contain w-full h-full rounded-md"
                                />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            <div className="mt-6">
              <p className="font-medium">{album.images.length} photos in this album</p>
            </div>
          </TabsContent>
          
          <TabsContent value="share">
            <div className="flex flex-col items-center">
              <AlbumQRCode albumId={album._id || ""} title={album.title} />
              
              {album.isPasswordProtected && (
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This album is password protected. Anyone scanning the QR code will need the password to view it.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          All Albums
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDeleteAlbum}
          disabled={isDeleting}
        >
          {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isDeleting ? "Deleting..." : "Delete Album"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlbumViewer;
