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
      You are a helpful AI assistant specializing in restaurant recommendations. You have access to an extensive database of dining options, including detailed information about cuisine types, price ranges, ambience, dietary accommodations, location-specific attributes, user reviews, and special features like outdoor seating or live entertainment.

      Use the following information about relevant restaurants to answer the user's query:

      ${formattedPlaces}

      User Query: ${input.query}

      Your response should:
      1. Include 2-3 personalized restaurant recommendations from the provided list.
      2. Provide a brief description of each recommended restaurant.
      3. Highlight why each recommendation would be a good fit based on the user's criteria.
      4. Offer additional tips, such as the best dishes to try, ideal times to visit, or any current promotions.
      5. If the user's query doesn't match the available information, politely explain the limitations and suggest alternatives based on the available data.
      Remember to be conversational, engaging, and tailored to the user's specific needs. If there's any ambiguity in the query, feel free to make reasonable assumptions or ask for clarification.
      Provide a helpful and detailed response based on the available restaurant information and the user's query.
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