import { useState, useEffect } from "react";
import axios from "axios";

interface Review {
  id: number;
  comment: string;
  rating?: number;
  reviewer_name?: string;
}

interface ReviewSectionProps {
  propertyId: number | string;
}

const ReviewSection = ({ propertyId }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!propertyId) return;

      try {
        const response = await axios.get(`/api/properties/${propertyId}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border p-2 rounded shadow">
          {review.reviewer_name && (
            <p className="font-semibold">{review.reviewer_name}</p>
          )}
          <p>{review.comment}</p>
          {review.rating !== undefined && (
            <p className="text-yellow-500">Rating: {review.rating}/5</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
