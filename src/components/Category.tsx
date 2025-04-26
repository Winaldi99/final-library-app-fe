// Category.tsx - Main component
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import axios from "../utils/AxiosInstance";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import CategoryDetail from "./CategoryDetail";

export type CategoryType = {
  id: number;
  name: string;
  description: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

const fetchCategoryList = async (token: string | null, page = 1, limit = 10) => {
  return await axios.get<CategoryType[]>(`/api/category?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const Category = () => {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { data: categoryData, refetch: refetchCategories } = useQuery({
    queryKey: ["categoryList", currentPage],
    queryFn: () => fetchCategoryList(getToken(), currentPage)
  });

  const handleAddNewClick = () => {
    setSelectedCategory(null);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    setIsFormOpen(true);
  };

  const handleViewClick = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsFormOpen(false);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCloseDetail = () => {
    setSelectedCategory(null);
  };

  const handleFormSubmit = () => {
    refetchCategories();
    setIsFormOpen(false);
  };

  const handleDeleteSuccess = () => {
    refetchCategories();
    setSelectedCategory(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={handleAddNewClick}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Add New Category
        </button>
      </div>
      
      {/* Category List Section */}
      {categoryData && (
        <CategoryList 
          categories={categoryData.data} 
          onEdit={handleEditClick} 
          onView={handleViewClick}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
      )}
      
      {/* Category Form Modal */}
      {isFormOpen && (
        <CategoryForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          category={isEditMode ? selectedCategory : null}
          isEditMode={isEditMode}
        />
      )}
      
      {/* Category Detail Modal */}
      {selectedCategory && !isFormOpen && (
        <CategoryDetail
          category={selectedCategory}
          onClose={handleCloseDetail}
          onEdit={() => handleEditClick(selectedCategory)}
          onDelete={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Category;