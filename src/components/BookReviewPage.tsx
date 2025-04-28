import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { 
  EditOutlined, 
  PlusOutlined, 
  CloseOutlined,
  BookOutlined,
  UserOutlined,
  TagOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";

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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {book.cover_image ? (
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-32 h-44 object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x200?text=No+Cover';
            }}
          />
        ) : (
          <div className="w-32 h-44 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
            <BookOutlined className="text-gray-400 dark:text-gray-500 text-3xl" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{book.title}</h1>
          
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <UserOutlined className="text-gray-400" />
            <span>{book.author}</span>
          </div>
          
          <div className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-xs font-medium text-blue-700 dark:text-blue-300 mb-3 gap-1">
            <TagOutlined />
            <span>{book.category.name}</span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm">{book.description}</p>
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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Write a Review</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <CloseOutlined />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="ulasan">
            Your Review
          </label>
          <textarea
            id="ulasan"
            value={ulasan}
            onChange={(e) => setUlasan(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Share your thoughts about this book..."
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
          >
            <PlusOutlined /> Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

const ReviewList = ({ reviews }: { reviews: ReviewType[] }) => {
  if (reviews.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">No reviews for this book yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <ClockCircleOutlined className="text-gray-400" />
            <span>Reviewed on {new Date(review.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm">{review.ulasan}</p>
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
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400">
        <div className="animate-spin inline-block size-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!bookData?.data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500 dark:text-gray-400">
        Book not found
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-3xl">
      <BookInfo book={bookData.data} />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Reader Reviews</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center gap-1"
          >
            <EditOutlined /> Write Review
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