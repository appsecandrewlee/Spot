/* eslint-disable */
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const dataPath = path.join(process.cwd(), 'data.json');
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const placeRouter = createTRPCRouter({
  ragQuery: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ input }) => {
      let relevantPlaces = jsonData.filter((place: { title: string; categoryName: string; description: string; }) =>
        place.title.toLowerCase().includes(input.query.toLowerCase()) ||
        place.categoryName.toLowerCase().includes(input.query.toLowerCase()) ||
        place.description.toLowerCase().includes(input.query.toLowerCase())
      );

      if (relevantPlaces.length < 3) {
        relevantPlaces = shuffleArray(jsonData).slice(0, 5);
      } else {
        relevantPlaces = shuffleArray(relevantPlaces).slice(0, Math.min(5, relevantPlaces.length));
      }

      const formattedPlaces = relevantPlaces.map((place: { title: any; categoryName: any; totalScore: any; reviewsCount: any; street: any; city: any; state: any; website: any; phone: any; description: any; }) => `
        Name: ${place.title}
        Category: ${place.categoryName}
        Rating: ${place.totalScore}/5 (${place.reviewsCount} reviews)
        Address: ${place.street}, ${place.city}, ${place.state}
        Website: ${place.website}
        Phone: ${place.phone}
        Description: ${place.description}
      `).join("\n\n");

      const prompt = `
      You are an AI assistant providing restaurant recommendations. You must ONLY use the information provided below about restaurants. Do not make any assumptions or provide any information not explicitly stated in the data given.

      Available restaurant information:

      ${formattedPlaces}

      User Query: ${input.query}

      Guidelines for your response:
      1. Recommend 3 to 5 restaurants from the list provided above.
      2. Provide a brief description of each recommended restaurant based on the given information.
      3. If the query doesn't closely match any restaurants in the list, provide diverse recommendations from the available options.
      4. Do not invent or assume any information not present in the restaurant data.
      5. If asked about details not provided, state that this information is not available.

      Provide a response based strictly on the available restaurant information and the user's query.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: "user", content: prompt }],
      });

      const aiResponse = response.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      return {
        aiResponse,
        relevantPlaces,
      };
    }),
});