"use client";
import React, { useRef, DragEvent, ChangeEvent } from "react";

type ImageUploadContainerProps = {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ImageUploadContainer = ({
  images,
  setImages,
}: ImageUploadContainerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setImages((prevImages) => [...prevImages, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current?.click(); // Use ref to click the file input
  };

  return (
    <div className="w-full">
      <div
        id="dropzone"
        className="flex flex-col items-center justify-center  p-4 mb-4 border-2 border-dashed rounded-lg cursor-pointer text-gray-700 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <p className="mb-2 text-center">Drag & drop images here</p>
        <p className="text-center">or</p>
        <button
          onClick={handleClick} // Call handleClick on button click
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          1. Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef} // Assign ref to the input
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleInputChange}
        />
      </div>
      <div
        id="imagePreview"
        className="mt-4 max-h-100 overflow-y-auto grid grid-cols-2 gap-4"
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="preview"
            className="w-full h-32 object-cover rounded-md"
          />
        ))}
      </div>
    </div>
  );
};
