
import React from "react";
import AlbumViewer from "@/components/AlbumViewer";

const ViewAlbum: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-album-light">
      <div className="container mx-auto px-4 py-8">
        <main>
          <AlbumViewer />
        </main>
      </div>
    </div>
  );
};

export default ViewAlbum;
