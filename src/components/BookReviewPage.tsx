import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";

// Types
type ReviewType = {
  id: number;
  ulasan: string;
  user_id: number;
  book_id: number;
  created_at: string;
  updated_at: string;
  book: {
    id: number;
    title: string;
    cover_image?: string;
    category: {
      id: number;
      name: string;
    };
  };
};

type BookType = {
  id: number;
  title: string;
  author: string;
  description: string;
  cover_image?: string;
  category: {
    id: number;
    name: string;
  };
};

type CreateReviewDTO = {
  bookId: number;
  ulasan: string;
};

// API Functions
const fetchBook = async (bookId: number, token: string | null) => {
  return await axios.get<BookType>(`/api/books/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchBookReviews = async (bookId: number, token: string | null) => {
  return await axios.get<ReviewType[]>(`/api/review/book/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const createReview = async (review: CreateReviewDTO, token: string | null) => {
  return await axios.post("/api/review", review, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Components
const BookInfo = ({ book }: { book: BookType }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {book.cover_image && (
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full md:w-48 h-64 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
          <p className="text-gray-600 mb-2">by {book.author}</p>
          <p className="text-blue-500 inline-block px-3 py-1 bg-blue-100 rounded-full text-sm mb-3">
            {book.category.name}
          </p>
          <p className="text-gray-700">{book.description}</p>
        </div>
      </div>
    </div>
  );
};

const ReviewForm = ({
  bookId,
  onSubmit,
  onCancel
}: {
  bookId: number;
  onSubmit: (data: CreateReviewDTO) => void;
  onCancel: () => void;
}) => {
  const [ulasan, setUlasan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ bookId, ulasan });
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="ulasan">
            Your Review
          </label>
          <textarea
            id="ulasan"
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewList = ({ reviews }: { reviews: ReviewType[] }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-2xl p-6 text-center">
        <p className="text-gray-500">No reviews for this book yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white shadow-md rounded-2xl p-4">
          <p className="text-sm text-gray-500 mb-2">
            Reviewed on {new Date(review.created_at).toLocaleDateString()}
          </p>
          <p className="text-gray-700">{review.ulasan}</p>
        </div>
      ))}
    </div>
  );
};

// Main Component
const BookReviewPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  
  const numericBookId = parseInt(bookId || "0");

  // Queries
  const { data: bookData, isLoading: isLoadingBook } = useQuery({
    queryKey: ["book", numericBookId],
    queryFn: () => fetchBook(numericBookId, getToken()),
    enabled: !!numericBookId
  });

  const { data: reviewsData, isLoading: isLoadingReviews } = useQuery({
    queryKey: ["bookReviews", numericBookId],
    queryFn: () => fetchBookReviews(numericBookId, getToken()),
    enabled: !!numericBookId
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newReview: CreateReviewDTO) => createReview(newReview, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookReviews", numericBookId] });
      setShowForm(false);
    }
  });

  // Event Handlers
  const handleFormSubmit = (data: CreateReviewDTO) => {
    createMutation.mutate(data);
  };

  if (isLoadingBook || isLoadingReviews) {
    return <div className="container mx-auto px-4 py-10 text-center">Loading...</div>;
  }

  if (!bookData?.data) {
    return <div className="container mx-auto px-4 py-10 text-center">Book not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <BookInfo book={bookData.data} />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Reader Reviews</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Write a Review
          </button>
        )}
      </div>

      {showForm ? (
        <ReviewForm
          bookId={numericBookId}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      ) : null}

      <ReviewList reviews={reviewsData?.data || []} />
    </div>
  );
};

export default BookReviewPage;