import { createClient, groq } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: true,
});

// Get a single movie by slug when user selects one
export async function getMovieBySlug(slug: any) {
  const movie = await client.fetch(
    groq`*[_type == "movie" && slug.current == $slug]{
        _id,
      title,
      slug,
      releaseDate,
      genre,
      synopsis,
      "cover": cover.asset->url,
      "slug": slug.current,
      "scenes": scenes[].asset->url,
      trailer,
    }`,
    { slug }
  );

  return movie;
}

// Get all movies
export async function getAllMovies() {
  const movies = await client.fetch(
    groq`*[_type == "movie"]{
        _id,
        title,
        slug,
        releaseDate,
        genre,
        synopsis,
        "cover": cover.asset->url,
        "slug": slug.current,
        "scenes": scenes[].asset->url,
        trailer,
    }`
  );

  return movies;
}

// Get 4 movies for home page
export async function getMovies() {
  const movies = await client.fetch(
    groq`*[_type == "movie"] [0...4] {
        _id,
        title,
        slug,
        releaseDate,
        genre,
        synopsis,
        "cover": cover.asset->url,
        "slug": slug.current,
        "scenes": scenes[].asset->url,
        trailer,
    }`
  );

  return movies;
}
