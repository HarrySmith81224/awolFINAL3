'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { Movie } from '../types/movie';
import Reviews from './Review';

interface MovieDetailsProps {
  movie: Movie;
}

// skeleton for movie details page, retrieves information based on the slug passed through from a clicked movie card
function MovieDetails({ movie }: MovieDetailsProps) {

  return (
    <div>
      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Movie cover */}
          <div className="relative shadow-xl aspect-[3/4] rounded-2xl overflow-hidden">
          <Image src={movie.cover} fill={true} alt="art" />
          </div>

          {/* Movie Details */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-4xl font-semibold text-[#5B20B6]">
              {movie.title}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-[#5B20B6] text-white rounded-full">
                {movie.genre}
              </span>
              <span className="text-gray-600">
                Released: {movie.releaseDate}
              </span>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              {movie.synopsis}
            </p>

            {movie.trailer && (
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${movie.trailer}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            <button
              className={`text-white px-6 py-3 rounded-md bg-[#5B20B6] hover:bg-[#4C1D95] duration-200`}
            >
              I have watched this!
            </button>
          </div>
        </div>

        {/* Review Section */}
        <Reviews movie={movie} />
        
      </div>
    </div>
  );
}

export default MovieDetails;
