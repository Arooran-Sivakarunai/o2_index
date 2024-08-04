"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function EnvironmentalForm() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6">
      <h1 className="text-blue-700 font-semibold text-4xl mb-6">The O2 Index</h1>
      <label
        htmlFor="inputField"
        className="text-blue-700 font-semibold text-lg mb-4"
      >
        Enter A City Near you!
      </label>
      <input
        id="inputField"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
        className="w-full max-w-xs p-3 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
      <Link href={"dataDisplay/" + inputValue}>
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </Link>
    </div>
  );
}
