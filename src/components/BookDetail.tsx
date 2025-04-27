// BookDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { BookType } from "./Books";

interface BookDetailProps {
  book: BookType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BookDetail = ({ book, onClose, onEdit, onDelete }: BookDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/books/${book.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete book");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            {book.image_url ? (
              <img
                src={book.image_url}
                alt={book.title}
                className="w-full h-64 object-cover rounded-lg shadow"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>

          <div className="w-full md:w-2/3">
            <div className="bg-indigo-100 inline-block px-3 py-1 rounded-full text-sm font-medium text-indigo-800 mb-3">
              {book.category?.name || "Uncategorized"}
            </div>
            
            <h1 className="text-2xl font-bold mb-2">{book.title}</h1>
            <p className="text-gray-600 text-lg mb-4">by {book.author}</p>
            
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <span className="text-gray-500">Added on:</span>
                <span className="ml-2">{formatDate(book.created_at)}</span>
              </div>
              
              {book.updated_at !== book.created_at && (
                <div className="flex items-center">
                  <span className="text-gray-500">Last updated:</span>
                  <span className="ml-2">{formatDate(book.updated_at)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button
                onClick={onEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Edit Book
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white hover:bg-red-50 text-red-600 border border-red-600 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="mt-6 p-4 border border-red-100 bg-red-50 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">Confirm Deletion</h3>
            <p className="text-red-600 mb-4">
              Are you sure you want to delete "{book.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Book"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;