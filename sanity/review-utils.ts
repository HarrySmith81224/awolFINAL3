import { createClient, groq } from 'next-sanity';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-19',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: true,
});

const reviewsQuery = groq`
  *[_type == "review" && movie._ref == $movieId] {
    _id,
    userName,
    reviewText,
    rating,
    createdAt
  }
`;

export async function createReview(movieId: string, reviewText: string, rating: number, userName: string) {
  const currentDate = new Date().toISOString();

  const reviewData = {
    movie: {
      _type: 'reference',
      _ref: movieId,
    },
    userName,
    reviewText,
    rating,
    createdAt: currentDate,
  };

  const result = await client.create({
    _type: 'review',
    ...reviewData,
  });

  return result;
}

export async function getReviewsByMovieId(movieId: string) {
  const params = { movieId };
  const reviews = await client.fetch(reviewsQuery, params);
  return reviews;
}
