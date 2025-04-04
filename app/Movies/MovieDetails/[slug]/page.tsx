import NavBar from '@/app/components/NavBar';
import MovieDetails from '../../../components/MovieDetails';

import { getMovieBySlug } from '@/sanity/movie-utils';
import Footer from '@/app/components/Footer';
import { Suspense } from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
  // Extract the movie slug from the URL parameters
  const { slug } = await params;

  // Fetch movie data from Sanity using the slug
  const movie = await getMovieBySlug(slug);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />
      </Suspense>
      <div className="mb-20">
        {/* [0] = Pass the first result into the component */}
        <MovieDetails movie={movie[0]} />
      </div>
      <Footer />
    </div>
  );
}
