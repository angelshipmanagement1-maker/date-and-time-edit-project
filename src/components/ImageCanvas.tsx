import { useRef, useState } from "react";
import { DraggableText } from "./DraggableText";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Upload, Settings } from "lucide-react";

interface ImageCanvasProps {
  imageUrl: string;
  imageType?: 'full' | 'cropped';
  onReset: () => void;
}

export const ImageCanvas = ({ imageUrl, imageType = 'full', onReset }: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [time, setTime] = useState("11:57");
  const [date, setDate] = useState("11-10-2023");
  const [timeWithAmPm, setTimeWithAmPm] = useState("11:57 AM");
  const [text1, setText1] = useState("11:23 AM");
  const [text2, setText2] = useState(["11:29", "13-10-2025"]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [customFontSizes, setCustomFontSizes] = useState({
    timeFontSize: '',
    dateFontSize: ''
  });
  const [useCustomFontSizes, setUseCustomFontSizes] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setText1(timeWithAmPm);
    setText2([time, date]);
    setUseCustomFontSizes(true);
    setIsFormVisible(false);
  };

  const handleFontSizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUseCustomFontSizes(true);
    setIsFormVisible(false);
  };

  const resetFontSizes = () => {
    setUseCustomFontSizes(false);
    setCustomFontSizes({ timeFontSize: '', dateFontSize: '' });
  };

  return (
    <div className="fixed inset-0 bg-background">
      <div className="absolute top-100 right-18 z-50 flex gap-2">
        <Button onClick={() => setIsFormVisible(!isFormVisible)} variant="secondary" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <Button onClick={onReset} variant="secondary" size="sm">
          <Upload className="w-4 h-4" />
        </Button>
      </div>

      {isFormVisible && (
        <div className="absolute top-16 right-4 z-50 bg-background border rounded-lg p-4 shadow-lg w-96 max-h-96 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Text Content</h3>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="time">Time (e.g., "11:57")</Label>
                  <Input
                    id="time"
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="11:57"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date (e.g., "11-10-2023")</Label>
                  <Input
                    id="date"
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="11-10-2023"
                  />
                </div>
                <div>
                  <Label htmlFor="timeWithAmPm">Time with AM/PM (e.g., "11:57 AM")</Label>
                  <Input
                    id="timeWithAmPm"
                    type="text"
                    value={timeWithAmPm}
                    onChange={(e) => setTimeWithAmPm(e.target.value)}
                    placeholder="11:57 AM"
                  />
                </div>
                <Button type="submit" size="sm" className="w-full">
                  Apply Text Changes
                </Button>
              </form>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Font Sizes</h3>
              <form onSubmit={handleFontSizeSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="timeFontSize">Time Font Size (px)</Label>
                    <Input
                      id="timeFontSize"
                      type="number"
                      value={customFontSizes.timeFontSize}
                      onChange={(e) => setCustomFontSizes(prev => ({ ...prev, timeFontSize: e.target.value }))}
                      placeholder="10"
                      min="6"
                      max="24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateFontSize">Date Font Size (px)</Label>
                    <Input
                      id="dateFontSize"
                      type="number"
                      value={customFontSizes.dateFontSize}
                      onChange={(e) => setCustomFontSizes(prev => ({ ...prev, dateFontSize: e.target.value }))}
                      placeholder="7"
                      min="6"
                      max="24"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1">
                    Set Font Sizes
                  </Button>
                  <Button type="button" onClick={resetFontSizes} variant="outline" size="sm">
                    Reset
                  </Button>
                </div>
              </form>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setIsFormVisible(false)} variant="secondary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={canvasRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
      >
        <img
          src={imageUrl}
          alt="Uploaded screenshot"
          className="max-w-full max-h-full object-contain"
          onLoad={(e) => {
            const img = e.currentTarget;
            setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          }}
        />

        <DraggableText
          text={text2}
          initialX={imageType === 'cropped' ? 1783 : 1722}
          initialY={imageType === 'cropped' ? 910 : 912}
          initialWidth={80}
          initialHeight={43.8}
          initialFontSize={useCustomFontSizes && customFontSizes.dateFontSize ? parseInt(customFontSizes.dateFontSize) : 7}
          backgroundColor={imageType === 'cropped' ? "#eadacc" : "#1d2526"}
          textColor={imageType === 'cropped' ? "#000000" : "#ffffff"}
        />
        <DraggableText
          text={text1}
          initialX={imageType === 'cropped' ? 56.80 : 128}
          initialY={imageType === 'cropped' ? 854 : 860}
          isDigital
          initialWidth={70}
          initialHeight={30}
          initialFontSize={useCustomFontSizes && customFontSizes.timeFontSize ? parseInt(customFontSizes.timeFontSize) : 10}
          backgroundColor="#131313"
          fontFamily='"Google Sans", "Roboto", "Arial", sans-serif'
        />
      </div>
    </div>
  );
};


