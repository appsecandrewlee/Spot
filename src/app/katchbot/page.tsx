/* eslint-disable */
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { FiMenu, FiMic, FiSend, FiStar } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { api } from '~/trpc/react';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"} w-4 h-4`}
        />
      ))}
    </div>
  );
};

function KatchBotPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');
  const [input, setInput] = useState(initialPrompt ?? '');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, relevantPlaces?: any[] }>>([]);

  const ragQuery = api.place.ragQuery.useMutation();
  const genericQuery = api.place.genericQuery.useMutation();

  useEffect(() => {
    const saveData = async () => {
        const response = await fetch('/api/result', { method: 'POST' });
        const data = await response.json();     
    };

    saveData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);

    const isRestaurantRelated = /restaurant|eat|food|dining/i.test(input);

    try {
      if (isRestaurantRelated) {
        const result = await ragQuery.mutateAsync({ query: input });
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: result.aiResponse,
          relevantPlaces: result.relevantPlaces
        }]);
      } else {
        const response = await genericQuery.mutateAsync({ query: input });
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' }]);
    }
    setInput('');
  };

  return (
    <div className="flex flex-col h-screen bg-pink-50">
      <header className="p-4 flex justify-between items-center">
        <FiMenu className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold text-pink-500">S</h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-1 p-4 flex flex-col items-center relative overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-2">Hello there!</h2>
        <p className="text-lg text-center mb-4">Let's find the perfect spot for your next outing!</p>

        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-[20rem] font-bold text-pink-300">
          </div>
        </div>

        <div className="w-full mt-4 overflow-y-auto flex-grow">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.role === 'user'
                  ? 'bg-blue-100 mr-auto'
                  : 'bg-green-100 ml-auto'
              } max-w-[80%]`}
            >
              <strong className={message.role === 'user' ? 'text-blue-600' : 'text-green-600'}>
                {message.role === 'user' ? 'You: ' : 'KatchBot: '}
              </strong>
              {message.content}
              {message.relevantPlaces && message.relevantPlaces.map((place, placeIndex) => (
                <div key={placeIndex} className="mt-2 bg-white rounded p-2">
                  <h3 className="font-bold">{place.title}</h3>
                  <StarRating rating={place.totalScore || 0} />
                  {place.imageUrl && (
                    <Image
                      src={place.imageUrl}
                      alt={place.title}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-t-3xl flex items-center">
        <input
          type="text"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message SpotBot"
        />
        <button type="button" className="p-2">
          <FiMic className="text-xl text-pink-500" />
        </button>
        <button type="submit" className="p-2">
          <FiSend className="text-xl text-pink-500" />
        </button>
      </form>
    </div>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <KatchBotPage />
    </Suspense>
  );
}