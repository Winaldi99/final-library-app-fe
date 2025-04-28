// CategoryList.tsx
import { CategoryType } from "../pages/Category";
import { EyeOutlined, EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

interface CategoryListProps {
  categories: CategoryType[];
  onEdit: (category: CategoryType) => void;
  onView: (category: CategoryType) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const CategoryList = ({ 
  categories, 
  onEdit, 
  onView, 
  onPageChange, 
  currentPage 
}: CategoryListProps) => {
  return (
    <div>
      {categories.length === 0 ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No categories found. Add a new category to get started!</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Created
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{category.description}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(category.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onView(category)}
                        className="text-blue-500 hover:text-blue-700 mr-2 inline-flex items-center gap-1"
                      >
                        <EyeOutlined />
                      </button>
                      <button
                        onClick={() => onEdit(category)}
                        className="text-green-500 hover:text-green-700 inline-flex"
                      >
                        <EditOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50 flex items-center justify-center text-gray-500 dark:text-gray-400 disabled:text-gray-300 dark:disabled:text-gray-600"
          >
            <LeftOutlined />
          </button>
          <span className="px-3 py-1.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm">
            {currentPage}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="p-1.5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400"
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;