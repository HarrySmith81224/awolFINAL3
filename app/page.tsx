import Link from 'next/link';
import Card from './components/card';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { getMovies } from '@/sanity/movie-utils';
import { Suspense } from 'react';
export default async function Home() {
  const movies = await getMovies();

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      </Suspense>
      <div>
        <div className="flex flex-col items-center justify-center mt-10 space-y-4">
          <h1 className="text-4xl font-bold text-[#e43d20] text-center">
            Don&apos;t Miss Out On The Action!
          </h1>
          <p className="text-xl text-center text-gray-500">
            This is the right place to find out about all the latest movies.
          </p>
          <Link className="text-center" href={'/Movies'}>
            Movies
          </Link>
        </div>

        <div className="p-10 flex">
          <div className="mx-auto grid grid-cols-1 xl:grid-cols-4 gap-8">
            {movies.map((movie: any) => (
              <Card key={movie._id} movie={movie} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
