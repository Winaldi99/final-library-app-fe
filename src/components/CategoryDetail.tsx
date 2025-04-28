// CategoryDetail.tsx
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { CategoryType } from "./Category";
import { CloseOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface CategoryDetailProps {
  category: CategoryType;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryDetail = ({ category, onClose, onEdit, onDelete }: CategoryDetailProps) => {
  const { getToken } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");

    try {
      await axios.delete(`/api/category/${category.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      onDelete();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
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
    <div className="fixed inset-0 bg-slate-100 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Category Details</h2>
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
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">{category.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm">{category.description}</p>
          </div>

          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex">
              <span className="font-medium w-28">Created:</span>
              <span>{formatDate(category.created_at)}</span>
            </div>
            <div className="flex">
              <span className="font-medium w-28">Last updated:</span>
              <span>{formatDate(category.updated_at)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-blue-500 text-white rounded flex items-center gap-1 hover:bg-blue-600 text-sm"
            >
              <EditOutlined /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 bg-white border border-red-500 text-red-500 rounded flex items-center gap-1 hover:bg-red-50 text-sm"
            >
              <DeleteOutlined /> Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="mx-4 mb-4 p-3 border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/30 rounded">
            <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">Confirm Deletion</h3>
            <p className="text-red-600 dark:text-red-300 text-sm mb-3">
              Are you sure you want to delete "{category.name}"?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 bg-white border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm"
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
  );
};

export default CategoryDetail;