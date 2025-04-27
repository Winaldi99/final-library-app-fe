import { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  Plus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";

// Define types based on your backend
interface Review {
  id: number;
  book_id: number;
  ulasan: string;
  created_at: string;
  book: {
    id: number;
    title: string;
    author: string;
    image_url: string;
    category: {
      name: string;
    };
  };
}

interface Book {
  id: number;
  title: string;
  author: string;
  image_url: string;
}

export default function BookReviewSystem() {
  // State management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"my-reviews" | "book-reviews">(
    "my-reviews"
  );
  const [selectedBookForView, setSelectedBookForView] = useState<number | null>(
    null
  );

  // Mock authentication token (in a real app, get from context or state management)
  const token = "your-auth-token";

  // Fetch user reviews
  const fetchUserReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/review?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews by book ID
  const fetchBookReviews = async (bookId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/review/book/${bookId}?page=${page}&limit=${limit}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching book reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch books (mock implementation - in a real app would call your API)
  const fetchBooks = async () => {
    // This would be an actual API call in your application
    // For now, using placeholder data
    setBooks([
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        image_url: "/api/placeholder/60/90"
      },
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        image_url: "/api/placeholder/60/90"
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        image_url: "/api/placeholder/60/90"
      }
    ]);
  };

  // Create a new review
  const createReview = async () => {
    if (!selectedBook || !reviewText.trim()) return;

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: selectedBook.id,
          ulasan: reviewText
        })
      });

      if (response.ok) {
        setReviewText("");
        setSelectedBook(null);
        setIsModalOpen(false);
        fetchUserReviews();
      }
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  // Update a review
  const updateReview = async () => {
    if (!editingReviewId || !selectedBook || !reviewText.trim()) return;

    try {
      const response = await fetch(`/api/review/${editingReviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: selectedBook.id,
          ulasan: reviewText
        })
      });

      if (response.ok) {
        setEditingReviewId(null);
        setReviewText("");
        setSelectedBook(null);
        setIsModalOpen(false);
        fetchUserReviews();
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/review/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUserReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Edit review - open modal with existing data
  const editReview = (review: Review) => {
    setEditingReviewId(review.id);
    setReviewText(review.ulasan);
    setSelectedBook({
      id: review.book.id,
      title: review.book.title,
      author: review.book.author,
      image_url: review.book.image_url
    });
    setIsModalOpen(true);
  };

  // Load initial data
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch appropriate reviews when page, viewMode, or selectedBookForView changes
  useEffect(() => {
    if (viewMode === "my-reviews") {
      fetchUserReviews();
    } else if (viewMode === "book-reviews" && selectedBookForView) {
      fetchBookReviews(selectedBookForView);
    }
  }, [page, viewMode, selectedBookForView]);

  // Modal component for adding/editing reviews
  const ReviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingReviewId ? "Edit Review" : "Add New Review"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Book
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedBook?.id || ""}
              onChange={(e) => {
                const bookId = parseInt(e.target.value);
                const book = books.find((b) => b.id === bookId) || null;
                setSelectedBook(book);
              }}
            >
              <option value="">-- Select a Book --</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} by {book.author}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md h-32"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md"
              onClick={() => {
                setIsModalOpen(false);
                setEditingReviewId(null);
                setReviewText("");
                setSelectedBook(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={editingReviewId ? updateReview : createReview}
              disabled={!selectedBook || !reviewText.trim()}
            >
              {editingReviewId ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Review card component
  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-start">
          <img
            src={review.book.image_url || "/api/placeholder/60/90"}
            alt={review.book.title}
            className="w-16 h-24 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{review.book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">
              by {review.book.author}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              Genre: {review.book.category?.name || "Uncategorized"}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Reviewed: {new Date(review.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-800">{review.ulasan}</p>
          </div>
        </div>

        {viewMode === "my-reviews" && (
          <div className="flex justify-end mt-3 space-x-2">
            <button
              onClick={() => editReview(review)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => deleteReview(review.id)}
              className="p-1 text-red-600 hover:text-red-800"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Reviews</h1>

        <div className="flex space-x-2">
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={viewMode}
            onChange={(e) => {
              setViewMode(e.target.value as "my-reviews" | "book-reviews");
              setPage(1);
            }}
          >
            <option value="my-reviews">My Reviews</option>
            <option value="book-reviews">Book Reviews</option>
          </select>

          {viewMode === "book-reviews" && (
            <select
              className="p-2 border border-gray-300 rounded-md text-sm"
              value={selectedBookForView || ""}
              onChange={(e) => {
                const bookId = parseInt(e.target.value);
                setSelectedBookForView(bookId);
                setPage(1);
              }}
            >
              <option value="">Select a Book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          )}

          {viewMode === "my-reviews" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
            >
              <Plus size={16} className="mr-1" /> Add Review
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <Search />
        <input type="text" placeholder="Search reviews..." />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">
              {viewMode === "my-reviews"
                ? "You haven't written any reviews yet."
                : "No reviews available for this book."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="p-2 border border-gray-300 rounded-md mr-2 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="py-2 px-4">Page {page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={reviews.length < limit}
          className="p-2 border border-gray-300 rounded-md ml-2 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && <ReviewModal />}
    </div>
  );
}
