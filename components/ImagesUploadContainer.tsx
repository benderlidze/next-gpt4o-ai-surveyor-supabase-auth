"use client";
import { useState } from "react";

import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";

export const ImagesUploadContainer = () => {
  const [urls, setUrls] = useState<string[]>([]);
  const [base64Strings, setBase64Strings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const urls = fileArray.map((file) => URL.createObjectURL(file));
      setUrls(urls);

      const base64Promises = fileArray.map((file) => convertToBase64(file));
      Promise.all(base64Promises).then((base64Array) => {
        setBase64Strings(base64Array);
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitImages = () => {
    console.log("base64Strings", base64Strings);
    setIsLoading(true);
    setResponse("");

    fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: base64Strings }),
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
      if (number && urls && urls[number - 1]) {
        const imageURL = urls[number - 1];
        return `![photo_${number}](${imageURL})`;
      }
      return text;
    });
  }

  const generateDoc = async (text: string) => {
    const textWithImages = replacePhotos(text);

    const processor = unified()
      .use(markdown)
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
    <div className="image-container">
      Upload
      <div className="upload-container border border-black border-dashed p-20 ">
        <input
          type="file"
          className="input-file"
          accept=".png, .jpg, .jpeg"
          onChange={onChange}
          multiple={true}
        />
      </div>
      <div className="flex flex-row gap-2 items-center justify-center m-2">
        {urls.map((url, index) => (
          <div key={index} className="w-20 h-20 overflow-hidden">
            <img
              src={url}
              className="object-cover w-full h-full"
              alt={`uploaded preview ${index}`}
            />
          </div>
        ))}
      </div>
      {urls.length > 0 && (
        <button
          onClick={handleSubmitImages}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      )}
      {isLoading && <p>Loading...</p>}
      {response && <p>{response}</p>}
      {response && (
        <button
          onClick={() => generateDoc(response)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Generate doc
        </button>
      )}
    </div>
  );
};
