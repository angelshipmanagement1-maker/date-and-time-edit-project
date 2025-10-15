import { useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { validateImageFile, isValidImageDataUrl } from "../utils/security";

interface UploadZoneProps {
  onImageUpload: (imageUrl: string, type: 'full' | 'cropped') => void;
}

export const UploadZone = ({ onImageUpload }: UploadZoneProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: 'full' | 'cropped' = 'full') => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string' && isValidImageDataUrl(result)) {
            onImageUpload(result, type);
          } else {
            toast.error("Invalid image file");
          }
        } catch (error) {
          console.error('Error reading file:', error);
          toast.error("Failed to read image file");
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string' && isValidImageDataUrl(result)) {
            onImageUpload(result, 'full'); // Default to full screen for drag and drop
          } else {
            toast.error("Invalid image file");
          }
        } catch (error) {
          console.error('Error reading file:', error);
          toast.error("Failed to read image file");
        }
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Screenshot Timestamp Editor
          </h1>
          <p className="text-muted-foreground text-lg">
            Add draggable timestamps to your screenshots
          </p>
        </div>

        <div className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary transition-colors">
          <Upload className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <p className="text-foreground mb-6">
            Drop your screenshot here or choose an option below
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => document.getElementById('full-upload')?.click()}>
              Full Screen Screenshot
            </Button>
            <Button onClick={() => document.getElementById('cropped-upload')?.click()} variant="secondary">
              Cropped Image Screenshot
            </Button>
          </div>
          <input
            id="full-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => handleFileChange(e, 'full')}
            className="hidden"
          />
          <input
            id="cropped-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => handleFileChange(e, 'cropped')}
            className="hidden"
          />
          <p className="text-sm text-muted-foreground mt-4">
            Supports PNG and JPG files
          </p>
        </div>
      </div>
    </div>
  );
};
