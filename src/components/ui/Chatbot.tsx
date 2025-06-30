'use client';

import { useState } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
          <div className="bg-purple-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold">InternBot</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
              ✕
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-600">
            <p className="mb-2">Hi! I'm here to help you find internships 😊</p>
            {/* Add message bubble rendering here */}
          </div>
          <form className="flex border-t p-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 px-2 py-1 border rounded-l-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700"
        >
          💬
        </button>
      )}
    </div>
  );
}
