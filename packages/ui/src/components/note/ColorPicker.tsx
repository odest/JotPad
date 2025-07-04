import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from 'react-colorful';
import { Button } from "@repo/ui/components/button";

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onColorChange, className = "" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 p-0 border-2"
        style={{ borderColor: color }}
      >
        <div
          className="w-4 h-4 rounded-sm"
          style={{ backgroundColor: color }}
        />
      </Button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-3 bg-background border rounded-lg shadow-lg z-50">
          <HexColorPicker
            color={color}
            onChange={onColorChange}
            className="w-40 h-40"
          />
        </div>
      )}
    </div>
  );
} 