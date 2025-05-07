
import React from "react";
import AlbumGallery from "@/components/AlbumGallery";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-album-light">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-album-dark to-primary bg-clip-text text-transparent">
            Digital Memories Now
          </h1>
          <p className="text-xl text-muted-foreground">
            Create beautiful digital albums from your favorite photos
          </p>
        </header>
        
        <main>
          <AlbumGallery />
        </main>
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Digital Memories Now. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
