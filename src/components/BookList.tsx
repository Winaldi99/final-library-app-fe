// BookList.tsx
import { BookType } from "./Books";

interface BookListProps {
  books: BookType[];
  onEdit: (book: BookType) => void;
  onView: (book: BookType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const BookList = ({ books, onEdit, onView, onPageChange, currentPage }: BookListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          No books found. Add a new book to your collection!
        </div>
      ) : (
        books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={() => onEdit(book)}
            onView={() => onView(book)}
          />
        ))
      )}
      
      {/* Pagination */}
      <div className="col-span-full flex justify-center mt-6">
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 rounded bg-indigo-100">
            Page {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

interface BookCardProps {
  book: BookType;
  onEdit: () => void;
  onView: () => void;
}

const BookCard = ({ book, onEdit, onView }: BookCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
      <div className="relative h-64">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-100 px-2 py-1 rounded-lg text-xs font-medium text-indigo-800">
          {book.category?.name || "Uncategorized"}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={onView}
            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
          >
            View Details
          </button>
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookList;