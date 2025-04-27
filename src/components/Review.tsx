import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";

// Types
type ReviewType = {
  id: number;
  ulasan: string;
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
};

type CreateReviewDTO = {
  bookId: number;
  ulasan: string;
};

// API Functions
const fetchReviews = async (token: string | null) => {
  return await axios.get<ReviewType[]>("/api/review", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchBookReviews = async (bookId: number, token: string | null) => {
  return await axios.get<ReviewType[]>(`/api/review/book/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchBooks = async (token: string | null) => {
  return await axios.get<BookType[]>("/api/books", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const createReview = async (review: CreateReviewDTO, token: string | null) => {
  return await axios.post("/api/review", review, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const updateReview = async (id: number, review: CreateReviewDTO, token: string | null) => {
  return await axios.put(`/api/review/${id}`, review, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const deleteReview = async (id: number, token: string | null) => {
  return await axios.delete(`/api/review/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Components
const ReviewCard = ({ 
  review, 
  onEdit, 
  onDelete 
}: { 
  review: ReviewType; 
  onEdit: (review: ReviewType) => void; 
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 max-w-xl mx-auto">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-xl font-semibold mb-1">{review.book.title}</h2>
          <p className="text-sm text-gray-500 mb-1">Category: {review.book.category.name}</p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(review.updated_at).toLocaleDateString()}
          </p>
        </div>
        {review.book.cover_image && (
          <img
            src={review.book.cover_image}
            alt={review.book.title}
            className="w-20 h-28 object-cover rounded-md"
          />
        )}
      </div>
      <p className="text-gray-700 mb-4">{review.ulasan}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => onEdit(review)}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(review.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ReviewForm = ({
  review,
  onSubmit,
  onCancel
}: {
  review: Partial<ReviewType> | null;
  onSubmit: (data: CreateReviewDTO) => void;
  onCancel: () => void;
}) => {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<CreateReviewDTO>({
    bookId: review?.book_id || 0,
    ulasan: review?.ulasan || ""
  });

  const { data: booksData } = useQuery({
    queryKey: ["booksList"],
    queryFn: () => fetchBooks(getToken())
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "bookId" ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {review ? "Edit Review" : "Add New Review"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="bookId">
            Book
          </label>
          <select
            id="bookId"
            name="bookId"
            value={formData.bookId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a book</option>
            {booksData?.data.map(book => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="ulasan">
            Review
          </label>
          <textarea
            id="ulasan"
            name="ulasan"
            value={formData.ulasan}
            onChange={handleChange}
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
            {review ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FilterPanel = ({
  selectedBookId,
  setSelectedBookId
}: {
  selectedBookId: number | null;
  setSelectedBookId: (id: number | null) => void;
}) => {
  const { getToken } = useAuth();
  const { data: booksData } = useQuery({
    queryKey: ["booksList"],
    queryFn: () => fetchBooks(getToken())
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="w-2/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Book
          </label>
          <select
            value={selectedBookId || ""}
            onChange={(e) => setSelectedBookId(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Reviews</option>
            {booksData?.data.map(book => (
              <option key={book.id} value={book.id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        {selectedBookId && (
          <button
            onClick={() => setSelectedBookId(null)}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition mt-5"
          >
            Clear Filter
          </button>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center max-w-xl mx-auto">
      <h3 className="text-lg font-medium text-gray-700 mb-2">No reviews found</h3>
      <p className="text-gray-500 mb-4">You haven't added any reviews yet.</p>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Add Your First Review
      </button>
    </div>
  );
};

// Main Component
const Review = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewType | null>(null);

  // Queries
  const { data: allReviewsData, isLoading: isLoadingAllReviews } = useQuery({
    queryKey: ["reviewsList"],
    queryFn: () => fetchReviews(getToken()),
    enabled: !selectedBookId
  });

  const { data: bookReviewsData, isLoading: isLoadingBookReviews } = useQuery({
    queryKey: ["bookReviews", selectedBookId],
    queryFn: () => fetchBookReviews(selectedBookId as number, getToken()),
    enabled: !!selectedBookId
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newReview: CreateReviewDTO) => createReview(newReview, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewsList"] });
      if (selectedBookId) {
        queryClient.invalidateQueries({ queryKey: ["bookReviews", selectedBookId] });
      }
      setShowForm(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, review }: { id: number; review: CreateReviewDTO }) => 
      updateReview(id, review, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewsList"] });
      if (selectedBookId) {
        queryClient.invalidateQueries({ queryKey: ["bookReviews", selectedBookId] });
      }
      setShowForm(false);
      setEditingReview(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id, getToken()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewsList"] });
      if (selectedBookId) {
        queryClient.invalidateQueries({ queryKey: ["bookReviews", selectedBookId] });
      }
    }
  });

  // Event Handlers
  const handleAddClick = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleEditClick = (review: ReviewType) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = (data: CreateReviewDTO) => {
    if (editingReview) {
      updateMutation.mutate({ id: editingReview.id, review: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  // Determine which reviews to show
  const reviews = selectedBookId ? bookReviewsData?.data : allReviewsData?.data;
  const isLoading = selectedBookId ? isLoadingBookReviews : isLoadingAllReviews;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Book Reviews</h1>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
          >
            <span className="mr-1">+</span> Add Review
          </button>
        )}
      </div>

      {showForm ? (
        <ReviewForm
          review={editingReview || null}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <FilterPanel
            selectedBookId={selectedBookId}
            setSelectedBookId={setSelectedBookId}
          />

          {isLoading ? (
            <div className="text-center py-10">Loading reviews...</div>
          ) : reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState onAdd={handleAddClick} />
          )}
        </>
      )}
    </div>
  );
};

export default Review;