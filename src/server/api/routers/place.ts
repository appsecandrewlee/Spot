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
      // Select 4 random places
      const selectedPlaces = jsonData.sort(() => 0.5 - Math.random()).slice(0, 4);

      // Format the places to include in the OpenAI prompt
      const formattedPlaces = selectedPlaces.map((place: any, index: number) => `
        ${index + 1}. Image URL: ${place.imageUrl || 'No image available'}
           Name: ${place.title}
           Category: ${place.categories || "check back for category!"}
           Location: ${place.city}, ${place.state}
           Phone: ${place.phone}
           Review: ${place.review}
           Total Score: ${place.totalScore || 'Not available'}
      `).join("\n\n");

      // Generate the prompt for OpenAI
      const prompt = `
      Recommend 1-2 restaurants from the following numbered list:

      ${formattedPlaces}

      User Query: ${input.query}

      For each restaurant, provide its Location, Name, Category, Phone, Review, and location. 
      If Review is undefined, don't reveal it. If Total Score is available, include it.
      Format each recommendation as follows:
      "[Number]\n. 
      [Restaurant Name]\n
      [Category]\n 
      [Phone]\n
      [Review]\n
      in [Location]\n
      Total Score: [Total Score]\n
      then briefly 2 sentences to explain the restaurant, that can be made up"

      Do not include the image URL in your response.
      `;

      // Call OpenAI with the formatted prompt
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "user", content: prompt }],
      });

      // Extract the response from OpenAI
      const aiResponse = response.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

      // Return the AI response and relevant places, including totalScore
      return {
        aiResponse,
        relevantPlaces: selectedPlaces.map((place: { imageUrl: any; title: any; categoryName: any; city: any; state: any; totalScore: number }) => ({
          imageUrl: place.imageUrl || null,
          title: place.title,
          categoryName: place.categoryName || null,
          location: `${place.city}, ${place.state}`,
          totalScore: place.totalScore || null, // Add totalScore to the response
        })),
      };
    }),

    genericQuery: publicProcedure
    .input(z.object({
      query: z.string(),
    }))
    .mutation(async ({ input }) => {
      const isRelatedToRestaurants = /restaurant|food|dining|eat/i.test(input.query);
      
      if (isRelatedToRestaurants) {
        return "Please provide more details or ask about our restaurant recommendations.";
      }

      const prompt = `
        You are an AI assistant primarily focused on restaurant recommendations. 
        However, you've been asked a question that's not related to restaurants: "${input.query}"
        
        Please provide a very brief (1-2 sentences) response to the query, 
        followed by a polite reminder that you specialize in restaurant recommendations 
        and suggest using a more general AI like ChatGPT for detailed answers on other topics.

        Your response should be informative yet concise, and maintain a friendly tone.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150  
      });

      return response.choices[0]?.message?.content ?? 
        "I'm sorry, I couldn't generate a response. As a restaurant recommendation AI, I might not be the best source for this information. Perhaps try asking ChatGPT for a more comprehensive answer.";
    }),
});