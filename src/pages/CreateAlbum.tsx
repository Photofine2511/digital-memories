
import React from "react";
import AlbumCreator from "@/components/AlbumCreator";

const CreateAlbum: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-album-light">
      <div className="container mx-auto px-4 py-8">
        <main>
          <AlbumCreator />
        </main>
      </div>
    </div>
  );
};

export default CreateAlbum;
