import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AlbumQRCodeProps {
  albumId: string;
  title: string;
}

const AlbumQRCode: React.FC<AlbumQRCodeProps> = ({ albumId, title }) => {
  const [copied, setCopied] = useState(false);
  
  // Create the full album URL for the QR code
  const albumUrl = `${window.location.origin}/album/${albumId}`;
  
  // Handle QR code download
  const handleDownload = () => {
    const canvas = document.getElementById('album-qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const svgElement = canvas.querySelector('svg');
    if (!svgElement) return;
    
    // Create a canvas element to draw the SVG
    const canvasElement = document.createElement('canvas');
    canvasElement.width = 512;
    canvasElement.height = 512;
    const ctx = canvasElement.getContext('2d');
    
    if (!ctx) return;
    
    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    // Create an image from the SVG
    const img = new Image();
    img.onload = () => {
      // Draw the image on the canvas
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
      ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
      
      // Convert canvas to PNG and download
      const pngUrl = canvasElement.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
      toast({
        title: "QR Code Downloaded",
        description: "Your album QR code has been downloaded.",
      });
    };
    img.src = url;
  };
  
  // Handle sharing album link
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} - Digital Album`,
          text: `Check out my digital photo album: ${title}`,
          url: albumUrl,
        });
      } else {
        await navigator.clipboard.writeText(albumUrl);
        setCopied(true);
        toast({
          title: "Link Copied",
          description: "Album link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  
  return (
    <Card className="p-6 flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4">Album QR Code</h3>
      
      <div id="album-qr-code" className="bg-white p-4 rounded-lg mb-4">
        <QRCodeSVG
          value={albumUrl}
          size={200}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>
      
      <p className="text-sm text-center text-muted-foreground mb-4">
        Scan this QR code to view the album or share it with others
      </p>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-4 w-4" />
          {copied ? "Copied!" : "Share Link"}
        </Button>
      </div>
    </Card>
  );
};

export default AlbumQRCode; 