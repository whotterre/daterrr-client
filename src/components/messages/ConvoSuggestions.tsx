'use client'
import React, { useContext, useEffect, useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { RotateCw, ChevronDown, ChevronUp } from 'lucide-react';
import { MessageContext } from '@/contexts/MessageContext';


const colors = [
  'bg-pink-100 text-pink-800',
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-yellow-100 text-yellow-800',
  'bg-indigo-100 text-indigo-800',
];

export default function ConvoSuggestions(props: any) {
  const messageContext = useContext(MessageContext)!
  const { setMessageText } = messageContext
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!
  });

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            parts: [
              {
                text:
                  'Generate 5-7 casual, funny, and witty conversation starters for a dating app. \
                  Return ONLY a JavaScript array of strings (no markdown, no numbers, no extra text). \
                  Make them feel human and not AI-generated.',
              },
            ],
          },
        ],
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = text.startsWith('[') ? JSON.parse(text) : [text];
          setSuggestions(parsed.filter((s: string) => s.trim().length > 0));
        } catch (e) {
          setSuggestions([text]);
        }
      } else {
        setSuggestions(["How's your day going?"]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to load suggestions. Try again!');
      setSuggestions([
        'If you could have dinner with any fictional character, who would it be?',
        "What's the most spontaneous thing you've ever done?",
        'Pineapple on pizza: yes or no? (This is important!)',
        "What's your go-to karaoke song?",
        "What's the weirdest food combination you actually enjoy?",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="w-full p-4 border rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Icebreakers</h3>
        <div className="flex gap-2 items-center">
          <button
            onClick={fetchSuggestions}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${isLoading ? 'bg-gray-100' : 'bg-gray-100 hover:bg-gray-200'}`}
            aria-label="Refresh suggestions"
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-600 hover:text-gray-800 transition"
            aria-label="Toggle collapse"
          >
            {isCollapsed ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

          <div className="relative">
            {isLoading ? (
              <div className="flex space-x-3 overflow-hidden py-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-64 h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-64 p-4 rounded-xl cursor-pointer transition-transform hover:scale-105 ${
                      colors[index % colors.length]
                    }`}
                    onClick={() => setMessageText(suggestion)}
                  >
                    <p className="font-medium">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
