'use client';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { createReview, getReviewsByMovieId } from '@/sanity/review-utils';
import { toast } from 'react-hot-toast';
import { useSession } from "next-auth/react";
import { Movie } from '../types/movie';
import { Review } from '../types/review';

interface ReviewProps {
  movie: Movie;
}

function Reviews({ movie }: ReviewProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name;
  
  // State management for review form and data
  const [rating, setRating] = useState<number>(0);        // Selected star rating (0-5)
  const [reviewText, setReviewText] = useState<string>('');     // Review text input
  const [reviews, setReviews] = useState<Review[]>([]);   // Array of all reviews
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);  // Form submission state

  // Fetch reviews when component mounts or movie changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (movie?._id) {
        try {
          const fetchedReviews = await getReviewsByMovieId(movie._id);
          setReviews(fetchedReviews);
        } catch (error) {
          toast.error('Failed to load reviews');
          console.error('Error fetching reviews:', error);
        }
      }
    };

    fetchReviews();
  }, [movie?._id]);

  // Handle input changes
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewText(e.target.value);
  };

  // Handle review submission
  const handleAddReview = async () => {
    // Check if user is logged in
    if (!session) {
      toast.error('Please sign in to leave a review');
      return;
    }

    // Check if review text is not empty
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }

    // Check if rating is selected
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setIsSubmitting(true);
      // Create new review in Sanity
      const newReview = await createReview(
        movie._id,
        reviewText.trim(),
        rating,
        userName || 'Anonymous'
      );

      // Update local state with new review
      setReviews(prev => [...prev, newReview]);
      setReviewText('');
      setRating(0);
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Failed to add review');
      console.error('Error adding review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {/* Review Form - Only shown to logged-in users */}
      {session ? (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          {/* Star Rating Selection */}
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="focus:outline-none"
              >
                <FaStar
                  size={24}
                  style={{
                    color: star <= rating ? '#FFD700' : '#E5E7EB',
                    cursor: 'pointer'
                  }}
                />
              </button>
            ))}
          </div>

          {/* Review Text Input and Submit Button */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Write your review..."
              value={reviewText}
              onChange={handleTextChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#5B20B6]"
              disabled={isSubmitting}
            />
            <button
              onClick={handleAddReview}
              disabled={isSubmitting}
              className="bg-[#5B20B6] text-white px-6 py-2 rounded-md hover:bg-[#4C1D95] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      ) : (
        // Message shown to non-logged-in users
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 text-center">
          <p className="text-gray-500">Please sign in to leave a review</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          // Message shown when no reviews exist
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          // Display all reviews
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{review.userName}</h3>
                  {/* Star rating */}
                  <div className="flex space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={16}
                        style={{ color: '#FFD700' }}
                      />
                    ))}
                  </div>
                </div>
                {/* Review date */}
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {/* Review text */}
              <p className="text-gray-700">{review.reviewText}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reviews;
