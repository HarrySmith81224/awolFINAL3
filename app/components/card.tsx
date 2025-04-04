import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '../types/movie';

interface CardProps {
  movie: Movie;
}

//a skeleton for the movie card which changes depending on the slug
function Card({ movie }: CardProps) {
  return (
    <Link href={`Movies/MovieDetails/${movie.slug}`}>
      <div className="relative max-w-sm cursor-pointer">
        <div className="relative h-96 w-72 overflow-hidden aspect-ratio-1 hover:scale-105 transition-transform duration-300 rounded-lg shadow-md">
        <Image src={movie.cover} fill={true} alt="art" />
          <div className="opacity-0 hover:opacity-100 duration-200 absolute inset-0 z-10 flex flex-col p-4 text-2xl text-white font-semibold bg-gradient-to-br from-[#00000079] to-70%">
            <span>{movie.title}</span>
            <span className="text-lg">{movie.releaseDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
