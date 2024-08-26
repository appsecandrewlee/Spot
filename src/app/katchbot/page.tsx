/* eslint-disable */

'use client';

import React from 'react';
import { useChat } from 'ai/react';
import { FiMenu, FiMapPin, FiClock, FiMic, FiSend } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

export default function KatchBotPage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get('prompt');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chatbot',
    initialInput: initialPrompt ?? '',
  });

  return (
    <div className="flex flex-col h-screen bg-pink-50">
      <header className="p-4 flex justify-between items-center">
        <FiMenu className="text-2xl text-gray-600" />
        <h1 className="text-2xl font-bold text-pink-500">KatchBot</h1>
        <div className="w-6"></div> 
      </header>

      <main className="flex-1 p-4 flex flex-col items-center relative overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-2">Hello there!</h2>
        <p className="text-lg text-center mb-4">Let's find the perfect spot for your next outing!</p>

        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-[20rem] font-bold text-pink-300">K</span>
        </div>

        <div className="w-full mt-4 overflow-y-auto flex-grow">
          {messages.map((message) => (
            <div key={message.id} className="mb-2 p-2 rounded bg-white bg-opacity-70">
              <strong>{message.role === 'user' ? 'You: ' : 'KatchBot: '}</strong>
              {message.content}
            </div>
          ))}
        </div>
      </main>

      <div className="px-4 mb-4 flex space-x-4">
        <div className="flex-1 bg-white rounded-lg p-3 shadow">
          <FiMapPin className="text-pink-500 mb-1" />
          <h3 className="font-semibold">Moody Restaurant</h3>
          <p className="text-xs text-gray-600">Top 10 Best Vibes in Melbourne</p>
        </div>
        <div className="flex-1 bg-white rounded-lg p-3 shadow">
          <FiClock className="text-pink-500 mb-1" />
          <h3 className="font-semibold">Trendy Bar</h3>
          <p className="text-xs text-gray-600">Hotspots You Can't Miss</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white rounded-t-3xl flex items-center">
        <input
          type="text"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Message KatchBot"
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