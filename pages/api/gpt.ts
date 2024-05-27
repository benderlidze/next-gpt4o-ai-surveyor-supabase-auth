import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

type ResponseData = {
  message: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const config = {
  maxDuration: 60,
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
    responseLimit: "10mb",
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    try {
      const images = req.body.images;
      console.log("images", images);
      const imagesContent = images.map((image: string) => {
        return {
          type: "image_url",
          image_url: {
            url: image,
          },
        };
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
            You are a building surveyor based in the UK. I'm going to upload numerous images of a property that I am looking to purchase. Could you please produce a professional report style response that covers the following points for each image:

              Observations of the image
              Potential Problems within the image.
              Recommendations on how to address any potential problems

              The Building Survey Report aims to:
              • help you make a reasoned and informed decision when purchasing the property, or when planning for repairs,
              maintenance or upgrading of the property;
              • provide detailed advice on condition;
              • describe the identifiable risk of potential or hidden defects;
              • where practicable and agreed, provide an estimate of costs for identified reports; and
              • make recommendations as to any further actions or advice which need to be obtained before committing to purchase



              Provide a Summary and Recommendations at the end of the report to conclude your findings on each image that has been uploaded.



              I will be looking to convert the response into a word document, therefore, each image will be included next to the description that you have provided. When formatting the response, add a header title to each section. The layout at the top of the response should read:



              Building Survey Report
              Property Address: [Insert Address]
              Report Prepared for: [Client Name]



              After completing the content for each image, add a page break.



              Please mark the placeholder for photos with something like [photo_1] so that we can match up the images.



              The font should be arial. When listing the Observations, Potential Problems and Recommendations in the reply, can these titles be bold and underlined.



              Please make it clear what the photo number or ID is that the text is referring to.



              Do not wrap the text with any additional tags or symbols.



              When relating to structural damage and crack widths. Use following guide:



              the expressions to use are as follows:



              negligible, very slight, slight, moderate, severe, and very severe are used they generally mean the following:



              Category 0 "negligible" < 0.1mm
              Category 1 "very slight" 0.1 - 2mm
              Category 2 "slight" >2 but < 5mm
              Category 3 "moderate" >5 but < 15mm
              Category 4 "severe" >15 but < 25mm
              Category 5 "very severe" >25 mm



              Additional notes include:
              -if there are any images of kitchens, please check that there is a heat and smoke detecter installed.

              Do not wrap the result text with any additional tags or symbols.
            `,
          },
          {
            role: "user",
            content: imagesContent,
          },
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      console.log("response", JSON.stringify(response));

      res.status(200).json({
        message: response.choices[0].message.content || "Empty response",
      });
    } catch (error) {
      console.error("Error with OpenAI API request:", error);
      res.status(500).json({ message: `Error processing request. ${error}` });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
