import { useState, useRef, useEffect } from "react";
import { sanitizeText } from "../utils/security";

interface DraggableTextProps {
  text: string | string[];
  initialX: number;
  initialY: number;
  isDigital?: boolean;
  initialWidth?: number;
  initialHeight?: number;
  initialFontSize?: number;
  backgroundColor?: string;
  fontFamily?: string;
  fontWeight?: number;
  textColor?: string;
}

export const DraggableText = ({
  text,
  initialX,
  initialY,
  isDigital = false,
  initialWidth = 80,
  initialHeight = 40,
  initialFontSize = 10,
  backgroundColor = "black",
  fontFamily = '"Segoe UI Variable", "Segoe UI", "Arial", sans-serif',
  fontWeight = 500,
  textColor = "#ffffff"
}: DraggableTextProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [editableText, setEditableText] = useState(text);

  // Update editableText when text prop changes
  useEffect(() => {
    setEditableText(text);
  }, [text]);

  // Update fontSize when initialFontSize prop changes
  useEffect(() => {
    setFontSize(initialFontSize);
  }, [initialFontSize]);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, fontSize: 0 });
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    try {
      e.stopPropagation();
      setIsMouseDown(true);
      setMouseDownPos({ x: e.clientX, y: e.clientY });
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    } catch (error) {
      console.error('Error in handleMouseDown:', error);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      fontSize: fontSize,
    });
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const touch = e.touches[0];
    setResizeStart({
      x: touch.clientX,
      y: touch.clientY,
      width: size.width,
      height: size.height,
      fontSize: fontSize,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      try {
        if (isMouseDown && !isResizing) {
          const deltaX = Math.abs(e.clientX - mouseDownPos.x);
          const deltaY = Math.abs(e.clientY - mouseDownPos.y);
          if (deltaX > 5 || deltaY > 5) {
            setIsDragging(true);
          }
        }

        if (isDragging) {
          setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          });
        }
        if (isResizing) {
          const deltaX = e.clientX - resizeStart.x;
          const deltaY = e.clientY - resizeStart.y;
          const newWidth = Math.max(50, resizeStart.width + deltaX);
          const newHeight = Math.max(20, resizeStart.height + deltaY);
          const scale = newWidth / resizeStart.width;
          const newFontSize = Math.max(8, Math.min(20, resizeStart.fontSize * scale));

          setSize({ width: newWidth, height: newHeight });
          setFontSize(newFontSize);
        }
      } catch (error) {
        console.error('Error in handleMouseMove:', error);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      try {
        const touch = e.touches[0];
        if (!touch) return;
        
        if (isDragging) {
          setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y,
          });
        }
        if (isResizing) {
          const deltaX = touch.clientX - resizeStart.x;
          const deltaY = touch.clientY - resizeStart.y;
          const newWidth = Math.max(50, resizeStart.width + deltaX);
          const newHeight = Math.max(20, resizeStart.height + deltaY);
          const scale = newWidth / resizeStart.width;
          const newFontSize = Math.max(8, Math.min(20, resizeStart.fontSize * scale));
          
          setSize({ width: newWidth, height: newHeight });
          setFontSize(newFontSize);
        }
      } catch (error) {
        console.error('Error in handleTouchMove:', error);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setIsMouseDown(false);
    };

    if (isMouseDown || isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: true });
      document.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, isMouseDown, mouseDownPos]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const sanitized = sanitizeText(e.target.value);
    setEditableText(sanitized);
  };

  const displayText = Array.isArray(editableText) ? editableText.join('\n') : editableText;

  return (
    <div
      ref={elementRef}
      className={`absolute select-none rounded-lg ${
        isDigital ? "font-digital font-bold" : "font-sans"
      } ${isDragging || isResizing ? "opacity-80" : ""} flex items-center justify-center cursor-grab active:cursor-grabbing p-1`}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
        fontFamily: fontFamily,
        fontWeight: fontWeight,
        fontSize: "12px",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <textarea
        value={displayText}
        onChange={handleTextChange}
        className="w-full h-full bg-transparent resize-none border-none outline-none text-right cursor-grab active:cursor-grabbing"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          color: textColor
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-transparent hover:bg-white/10 rounded-tl-lg rounded-br-lg transition-colors"
        onMouseDown={handleResizeMouseDown}
        onTouchStart={handleResizeTouchStart}
      />
    </div>
  );
};

