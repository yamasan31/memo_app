import React from 'react';
import { NoteColor } from '../types';

interface ColorPickerProps {
  onSelectColor: (color: NoteColor) => void;
  currentColor: NoteColor;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onSelectColor, currentColor }) => {
  const colors: { name: NoteColor; bgClass: string; borderClass: string }[] = [
    { name: 'default', bgClass: 'bg-white', borderClass: 'border-gray-300' },
    { name: 'red', bgClass: 'bg-red-100', borderClass: 'border-red-200' },
    { name: 'orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-200' },
    { name: 'yellow', bgClass: 'bg-yellow-100', borderClass: 'border-yellow-200' },
    { name: 'green', bgClass: 'bg-green-100', borderClass: 'border-green-200' },
    { name: 'teal', bgClass: 'bg-teal-100', borderClass: 'border-teal-200' },
    { name: 'blue', bgClass: 'bg-blue-100', borderClass: 'border-blue-200' },
    { name: 'purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-200' },
    { name: 'pink', bgClass: 'bg-pink-100', borderClass: 'border-pink-200' },
  ];

  return (
    <div className="absolute bottom-full mb-2 left-0 bg-white shadow-lg rounded-lg p-2 z-10 flex space-x-1">
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          className={`w-6 h-6 rounded-full border ${color.bgClass} ${
            color.borderClass
          } hover:shadow-md transition-shadow focus:outline-none ${
            currentColor === color.name ? 'ring-2 ring-gray-400' : ''
          }`}
          onClick={() => onSelectColor(color.name)}
          title={`色: ${color.name}`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;