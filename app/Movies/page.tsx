'use client';

import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Card from '../components/card';
import { getAllMovies } from '@/sanity/movie-utils';
import { Movie } from '../types/movie';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'

interface FilterState {
  search: string;
  minDate: string;
  maxDate: string;
  sortBy: 'latest' | 'oldest';
  genre: string;
}

function MoviesContent() {
  // State management for movies and filtering
  const [movies, setMovies] = useState<Movie[]>([]);      
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);  
  const [currentPage, setCurrentPage] = useState(1);    
  const [moviesPerPage, setMoviesPerPage] = useState(12);
  
  // Initialize filter state with default values
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minDate: '',
    maxDate: '',
    sortBy: 'latest',
    genre: 'all'
  });

  // Get genre from URL parameters if user selected a genre from navbar
  const searchParams = useSearchParams();
  const urlGenre = searchParams.get('genre');

  // Fetch movies from Sanity
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const fetchedMovies = await getAllMovies();
        setMovies(fetchedMovies);
        
        // If there's a genre in the URL, apply it as a filter
        if (urlGenre) {
          setFilters((prev: FilterState) => ({
            ...prev,
            genre: urlGenre
          }));
        }
        
        setFilteredMovies(fetchedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, [urlGenre]);

  // Apply filters when filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...movies];

      if (filters.search) {
        result = result.filter(movie =>
          movie.title.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Apply date range filter
      if (filters.minDate || filters.maxDate) {
        result = result.filter(movie => {
          const releaseDate = parseFloat(movie.releaseDate);
          const isMinDateValid = !filters.minDate || releaseDate >= parseFloat(filters.minDate);
          const isMaxDateValid = !filters.maxDate || releaseDate <= parseFloat(filters.maxDate);
          return isMinDateValid && isMaxDateValid;
        });
      }

      // Apply genre filter
      if (filters.genre && filters.genre !== 'all') {
        result = result.filter(movie =>
          movie.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
      }

      // Apply date sorting (oldest, newest)
      result.sort((a, b) => {
        const dateA = parseFloat(a.releaseDate);
        const dateB = parseFloat(b.releaseDate);
        return filters.sortBy === 'latest' ? dateB - dateA : dateA - dateB;
      });

      setFilteredMovies(result);
      setCurrentPage(1);  // Reset to first page when filters change
    };

    applyFilters();
  }, [filters, movies]);

  // Reset all filters to default values
  const resetFilters = () => {
    setFilters({
      search: '',
      minDate: '',
      maxDate: '',
      sortBy: 'latest',
      genre: 'all'
    });
  };

  // Handler for updating filter values
  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev: FilterState) => ({ ...prev, [key]: value }));
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col md:flex-row p-10">
      {/* Filters */}
      <div className="mr-8 w-full md:w-64">
        <h1 className="text-2xl font-semibold text-[#5B20B6] mb-4">Filters</h1>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Search</h2>
            <input
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium">Release Date</h2>
            <input
              type="number"
              placeholder="Min Year"
              value={filters.minDate}
              onChange={(e) => handleFilterChange('minDate', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              placeholder="Max Year"
              value={filters.maxDate}
              onChange={(e) => handleFilterChange('maxDate', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* Sort and Genre Filters */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value as 'latest' | 'oldest')}
            className="w-full px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="latest">Sort by Latest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="all">All Genres</option>
            <option value="action">Action</option>
            <option value="horror">Horror</option>
            <option value="fantasy">Fantasy</option>
            <option value="scifi">Sci-fi</option>
          </select>

          {/* Movies per page */}
          <select
            value={moviesPerPage}
            onChange={(e) => setMoviesPerPage(Number(e.target.value))}
            className="w-full px-2 py-1 border border-gray-300 rounded-md"
          >
            {[4, 8, 12, 16, 20, 24, 28].map(num => (
              <option key={num} value={num}>{num} Movies Per Page</option>
            ))}
          </select>

          {/* Reset Filters Button */}
          <button
            onClick={resetFilters}
            className="w-full bg-[#5B20B6] text-white px-4 py-2 rounded-md"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="flex-1">
        <p className="text-sm text-gray-700 mb-4">
          {filteredMovies.length > 0 ? (
            <>Showing {currentMovies.length} of {filteredMovies.length} movies</>
          ) : (
            'No movies found'
          )}
        </p>

        <div className="mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16">
          {currentMovies.map((movie: Movie) => (
            <Card key={movie._id} movie={movie} />
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredMovies.length > moviesPerPage && (
          <div className="mt-6 flex justify-center">
            <ul className="flex space-x-2">
              {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-[#5B20B6] text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Movies Page Component
const Movies = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
        <MoviesContent />
      </Suspense>
      <Footer />
    </div>
  )
}

export default Movies;
