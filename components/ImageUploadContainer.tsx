"use client";
import React, { useRef, DragEvent, ChangeEvent, useState } from "react";

type ImageUploadContainerProps = {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ImageUploadContainer = ({
  images,
  setImages,
}: ImageUploadContainerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input
  const [error, setError] = useState<string>("");

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    console.log("images", images);
    console.log("files", files);

    if (images.length >= 4) {
      setError("Max number of images reached(4).");
      return;
    }

    if (images.length + files.length >= 4) {
      setError("Max number of images reached(4).");
    }

    const maxFiles = 4;
    const newImages: string[] = [];
    const maxFilesImages =
      files.length + images.length > maxFiles
        ? files.length - images.length
        : files.length;

    console.log("maxImages", maxFilesImages);

    Array.from(files)
      .slice(0, maxFilesImages)
      .forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              newImages.push(event.target.result as string);
              if (newImages.length === maxFilesImages) {
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

  const handleReset = () => {
    setImages([]);
    setError("");
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
        <div className="flex flex-row items-center justify-center gap-3">
          <button
            onClick={handleClick} // Call handleClick on button click
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            1. Upload Image
          </button>
          <button
            onClick={handleReset} // Call handleClick on button click
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Reset
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef} // Assign ref to the input
          className="hidden"
          accept="image/png, image/jpeg, image/webp, image/bmp" // Allow user to select
          multiple
          onChange={handleInputChange}
        />

        {error && <p className="mt-2 text-red-600">{error}</p>}
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
