// BookForm.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import { BookType, CategoryType } from "./Books";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  book: BookType | null;
  isEditMode: boolean;
  categories: CategoryType[];
}

interface FormData {
  title: string;
  author: string;
  categoryId: number;
  imageUrl: string;
}

const BookForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  book, 
  isEditMode,
  categories 
}: BookFormProps) => {
  const { getToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    author: "",
    categoryId: categories.length > 0 ? categories[0].id : 0,
    imageUrl: ""
  });

  useEffect(() => {
    // If editing an existing book, populate the form
    if (isEditMode && book) {
      setFormData({
        title: book.title,
        author: book.author,
        categoryId: book.category_id,
        imageUrl: book.image_url
      });
    }
  }, [isEditMode, book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "categoryId" ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditMode && book) {
        // Update existing book
        await axios.put(`/books/${book.id}`, formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        // Create new book
        await axios.post("/books", formData, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      onSubmit();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while saving the book");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? "Edit Book" : "Add New Book"}
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.length === 0 && (
                <option value="">No categories available</option>
              )}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
              <div className="w-full h-40 overflow-hidden rounded border border-gray-200">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                  }} 
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;