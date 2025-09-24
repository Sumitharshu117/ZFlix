import React, { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import useSwr from 'swr';
import fetcher from '@/lib/fetcher';
import { MovieInterface } from '@/types';

export default function Search() {
  const [suggestions, setSuggestions] = useState<MovieInterface[]>([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback(async (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);

    if (term) {
      // Make API call for suggestions as the user types
      try {
        const res = await fetcher(`/api/search?query=${term}`);
        setSuggestions(res);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleSuggestionClick = (movieId: string) => {
    // Navigate to the movie's watch page on click
    router.push(`/watch/${movieId}`);
    setSuggestions([]); // Clear suggestions after clicking
  };

  return (
    <div className="relative flex-1">
      <input
        type="text"
        placeholder="Search movies..."
        className="block w-full rounded-md border border-gray-500 px-3 py-1 text-sm text-white bg-zinc-800 focus:outline-none"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-zinc-800 border border-gray-500 rounded-b-md">
          {suggestions.map((movie) => (
            <div
              key={movie.id}
              className="p-2 cursor-pointer hover:bg-zinc-700 transition"
              onClick={() => handleSuggestionClick(movie.id)}
            >
              <p className="text-white">{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}