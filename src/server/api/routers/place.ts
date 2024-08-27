/* eslint-disable */


import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export const placeRouter = createTRPCRouter({
  ragQuery: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const relevantPlaces = await ctx.db.place.findMany({
        where: {
          OR: [
            { title: { contains: input.query, mode: 'insensitive' } },
            { categoryName: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        take: 5, 
      });

      const formattedPlaces = relevantPlaces.map(place => `
        Name: ${place.title}
        Category: ${place.categoryName}
        Rating: ${place.totalScore}/5 (${place.reviewsCount} reviews)
        Address: ${place.street}, ${place.city}, ${place.state}
        Website: ${place.website}
        Phone: ${place.phone}
      `).join("\n\n");

      const prompt = `
        You are an AI assistant for a restaurant recommendation service. 
        Use the following information about relevant restaurants to answer the user's query:

        ${formattedPlaces}

        User Query: if the user types in ${formattedPlaces} && ${input.query} you should give them the information of all the formats. 
      
        Provide a helpful response based on the available restaurant information.
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