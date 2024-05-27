"use client";
import { useState } from "react";

import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";

type GenerateReportProps = {
  images: string[];
};

export const GenerateReport = ({ images }: GenerateReportProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>();

  const handleSubmitImages = () => {
    console.log("base64Strings", images);

    if (images.length === 0) {
      setResponse("No images to process.");
      return;
    }

    setIsLoading(true);
    setResponse("");

    fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: images }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);

        setIsLoading(false);

        if (data.error) {
          setResponse(data.error);
          return;
        }
        setResponse(data.message);
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
        setResponse("Error processing request.");
      });
  };

  const fetchImage = async (
    url: string
  ): Promise<{ image: ArrayBuffer; width: number; height: number }> => {
    const image = new Image();
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve({
          image: buf,
          width: 200,
          height: 200,
        });
      };
      image.onerror = reject;
      image.src = URL.createObjectURL(new Blob([buf], { type: "image/png" }));
    });
  };

  function replacePhotos(text: string) {
    return text.replace(/\[photo_(\d+)\]/g, (match, number) => {
      if (number && images && images[number - 1]) {
        const imageURL = images[number - 1];
        return `![photo_${number}](${imageURL})`;
      }
      return text;
    });
  }

  const generateDoc = async (text: string) => {
    const textWithImages = replacePhotos(text);

    const processor = unified()
      .use(markdown as any)
      .use(docx, {
        output: "blob",
        imageResolver: fetchImage,
      } as any);

    try {
      const doc = await processor.process(textWithImages);
      const result = await doc.result; // Wait for the result Promise to resolve
      const link = document.createElement("a");
      link.download = "example.docx";
      link.href = URL.createObjectURL(result as Blob);
      link.click();
    } catch (error) {
      console.error("Error generating docx:", error);
    }
  };

  return (
    <div className="image-container flex flex-col items-center">
      {images.length > 0 && (
        <button
          onClick={handleSubmitImages} // Call handleClick on button click
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          2. Generate report
        </button>
      )}
      {isLoading && <p>Loading...</p>}
      {response && (
        <div className="max-h-40 overflow-auto my-4 border border-blue-100">
          {response}
        </div>
      )}
      {response && (
        <button
          onClick={() => generateDoc(response)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          3. Generate doc
        </button>
      )}
    </div>
  );
};
