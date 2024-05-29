"use client";
import { use, useEffect, useState } from "react";

import { unified } from "unified";
import markdown from "remark-parse";
import docx from "remark-docx";
import remarkHtml from "remark-html";
import Resizer from "react-image-file-resizer";

type GenerateReportProps = {
  images: string[];
};

export const GenerateReport = ({ images }: GenerateReportProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>();

  useEffect(() => {
    if (images.length > 0) {
      setResponse(null);
    }
  }, [images]);

  const handleSubmitImages = async () => {
    console.log("base64Strings", images);

    if (images.length === 0) {
      setResponse("No images to process.");
      return;
    }

    setIsLoading(true);
    setResponse("");

    const resizedImages = async () => {
      try {
        const resized = await Promise.all(
          images.map(async (image) => {
            try {
              const resizedImage = await new Promise(async (resolve) => {
                const blob = await fetch(image).then((r) => r.blob());
                Resizer.imageFileResizer(
                  blob,
                  300,
                  300,
                  "JPEG",
                  100,
                  0,
                  (uri) => {
                    resolve(uri);
                  },
                  "base64"
                );
              });
              return resizedImage;
            } catch (error) {
              console.error("Error resizing image:", error);
              return null; // or handle the error as needed
            }
          })
        );
        return resized.filter((image) => image !== null);
      } catch (error) {
        console.error("Error resizing images:", error);
        return [];
      }
    };

    const resimages = await resizedImages();

    console.log("images", images);
    console.log("resimages", resimages);

    fetch("/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: resimages }),
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

  function replacePhotos(text: string, html: boolean = false) {
    return text.replace(/\[photo_(\d+)\]/g, (match, number) => {
      if (number && images && images[number - 1]) {
        const imageURL = images[number - 1];
        if (html) {
          return `<img src="${imageURL}" alt="photo_${number}" width="200" height="200" />`;
        }
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

  const generateHTML = async (text: string) => {
    //const processor = unified().use(markdown).use(html); // Use remark-html to convert Markdown to HTML
    const processor = unified().use(markdown).use(remarkHtml);
    try {
      const html = await processor.process(text);
      return html.value;
    } catch (error) {
      console.error("Error generating HTML:", error);
      return null;
    }
  };

  const ResponseHTML = ({ response }: { response: string }) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
      generateHTML(response)
        .then((htmlResult) => {
          const withPhoto = replacePhotos(htmlResult as string, true);
          setHtml(withPhoto);
        })
        .catch((error) => {
          console.error("Error generating HTML:", error);
          setHtml(null);
        });
    }, [response]);

    return html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null;
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="image-container flex flex-col items-center">
      {images.length > 0 && !response && (
        <button
          onClick={handleSubmitImages} // Call handleClick on button click
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          2. Generate report
        </button>
      )}
      {isLoading && <div className="m-3">Loading...</div>}

      {response && (
        <button
          onClick={() => generateDoc(response)}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Download report
        </button>
      )}

      {response && (
        <div className="p-2 overflow-auto my-4 border border-blue-100">
          <ResponseHTML response={response} />
        </div>
      )}
    </div>
  );
};
