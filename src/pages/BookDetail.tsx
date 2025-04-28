// BookDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { BookType } from "./Books";
import { CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Book Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseOutlined />
          </button>
        </div>

        {error && (
          <div className="m-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-2/5">
              {book.image_url ? (
                <img
                  src={book.image_url}
                  alt={book.title}
                  className="w-full h-56 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x400?text=Image+Not+Found";
                  }}
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                  <span className="text-gray-500 dark:text-gray-400">
                    No Image
                  </span>
                </div>
              )}
            </div>

            <div className="w-full sm:w-3/5">
              <div className="bg-blue-100 dark:bg-blue-900/30 inline-block px-2 py-0.5 rounded text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                {book.category?.name || "Uncategorized"}
              </div>

              <h1 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                {book.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                by {book.author}
              </p>

              <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex">
                  <span className="w-24 font-medium">Added on:</span>
                  <span>{formatDate(book.created_at)}</span>
                </div>

                {book.updated_at !== book.created_at && (
                  <div className="flex">
                    <span className="w-24 font-medium">Updated:</span>
                    <span>{formatDate(book.updated_at)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={onEdit}
                  className="px-3 py-1.5 bg-blue-500 text-white rounded flex items-center gap-1 hover:bg-blue-600 text-sm"
                >
                  <EditOutlined /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-white dark:bg-transparent border border-red-500 text-red-500 rounded flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/30 text-sm"
                >
                  <DeleteOutlined /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="mt-4 p-3 border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/30 rounded">
              <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-red-600 dark:text-red-300 text-sm mb-3">
                Are you sure you want to delete "{book.title}"?
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
