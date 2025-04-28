// Books.tsx - Main component
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import BookList from "./BookList";
import BookForm from "./BookForm";
import BookDetail from "./BookDetail";
import { PlusOutlined } from "@ant-design/icons";

export type BookType = {
  id: number;
  title: string;
  author: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type CategoryType = {
  id: number;
  name: string;
};

const fetchBookList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<BookType[]>(`/api/books?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const fetchCategories = async (token: string | null) => {
  return await axios.get<CategoryType[]>("/api/category", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Books = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: bookData, refetch: refetchBooks } = useQuery({
    queryKey: ["bookList", currentPage],
    queryFn: () => fetchBookList(getToken(), currentPage)
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(getToken())
  });

  const handleAddNewClick = () => {
    setSelectedBook(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (book: BookType) => {
    setSelectedBook(book);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (book: BookType) => {
    setSelectedBook(book);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedBook(null);
  };

  const handleFormSubmit = () => {
    refetchBooks();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchBooks();
    setSelectedBook(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200">My Books Collection</h1>
        <button
          onClick={handleAddNewClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-1 text-sm transition-colors duration-200"
        >
          <PlusOutlined /> Add Book
        </button>
      </div>
      
      {/* Book List Section */}
      {bookData && (
        <BookList 
          books={bookData.data} 
          onEdit={handleEditClick} 
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
      
      {/* Book Form Modal */}
      {isFormOpen && (
        <BookForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          book={isEditMode ? selectedBook : null}
          isEditMode={isEditMode}
          categories={categoryData?.data || []}
        />
      )}
      
      {/* Book Detail Modal */}
      {selectedBook && !isFormOpen && (
        <BookDetail
          book={selectedBook}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedBook)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Books;