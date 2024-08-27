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

export const placeRouter = createTRPCRouter({
  ragQuery: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ input }) => {
      const selectedPlaces = jsonData.sort(() => 0.5 - Math.random()).slice(0, 4);

      const formattedPlaces = selectedPlaces.map((place: any, index: number) => `
        ${index + 1}. Name: ${place.title}
           Category: ${place.categoryName}
           Rating: ${place.totalScore}/5 (${place.reviewsCount} reviews)
           Address: ${place.street}, ${place.city}, ${place.state}
           Phone: ${place.phone}
      `).join("\n\n");

      const prompt = `
      Suggest 3-4 restaurants from the following numbered list:

      ${formattedPlaces}

      User Query: ${input.query}

      Provide a brief recommendation for each restaurant based only on the information given above. 
      Start each recommendation with the restaurant's number and name, followed by its phone number in parentheses.
      For example: "1. Restaurant Name (Phone: 123-456-7890): ..."
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "user", content: prompt }],
      });

      const aiResponse = response.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      return {
        aiResponse,
        relevantPlaces: selectedPlaces,
      };
    }),



   genericQuery: publicProcedure
  .input(z.object({
    query: z.string(),
  }))
  .mutation(async ({ input }) => {
    const isRelatedToRestaurants = /restaurant|food|dining|eat/i.test(input.query);
    if (!isRelatedToRestaurants) {
      return "I am an AI recommender for restaurants, I'm sorry I can't help you with that.";
    }
    return "Please provide more details or ask about our restaurant recommendations.";
  }),

});