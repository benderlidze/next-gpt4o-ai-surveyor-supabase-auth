"use client";
import { ImageUploadContainer } from "@/components/ImageUploadContainer";
import { GenerateReport } from "@/components/GenerateReport";
import { useState } from "react";

export const Report = () => {
  const [images, setImages] = useState<string[]>([]);

  console.log("images", images);
  return (
    <div className="flex flex-col items-center w-full mx-auto  p-6 rounded-lg ">
      <ImageUploadContainer images={images} setImages={setImages} />
      <GenerateReport images={images} />
    </div>
  );
};
