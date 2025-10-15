import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ImageCanvas } from "@/components/ImageCanvas";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'full' | 'cropped'>('full');

  const handleImageUpload = (imageUrl: string, type: 'full' | 'cropped') => {
    setUploadedImage(imageUrl);
    setImageType(type);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImageType('full');
  };

  return (
    <>
      {!uploadedImage ? (
        <UploadZone onImageUpload={handleImageUpload} />
      ) : (
        <ImageCanvas imageUrl={uploadedImage} imageType={imageType} onReset={handleReset} />
      )}
    </>
  );
};

export default Index;
