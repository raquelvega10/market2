import { Category, SubCategory } from '../lib/supabase';
import { ChevronRight } from 'lucide-react';

interface CategorySidebarProps {
  categories: Category[];
  subCategories: SubCategory[];
  selectedCategory: string | null;
  selectedSubCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  onSubCategorySelect: (subCategory: string | null) => void;
}

export function CategorySidebar({
  categories,
  subCategories,
  selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect,
}: CategorySidebarProps) {
  const filteredSubCategories = subCategories.filter(
    (sub) => sub.category_name === selectedCategory
  );

  return (
    <aside className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24 max-h-[calc(100vh-7rem)]">
      <div className="bg-gradient-to-r from-brand-green to-brand-green-dark p-4">
        <h2 className="text-xl font-bold text-white">Categorías</h2>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        <button
          onClick={() => {
            onCategorySelect(null);
            onSubCategorySelect(null);
          }}
          className={`w-full px-4 py-3 text-left font-medium transition-all border-b border-gray-100 flex items-center justify-between ${
            selectedCategory === null
              ? 'bg-brand-green bg-opacity-20 text-gray-900 border-l-4 border-brand-green'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span>Todos los productos</span>
          {selectedCategory === null && <ChevronRight className="w-5 h-5 text-brand-green" />}
        </button>

        {categories.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => {
                if (selectedCategory === category.name) {
                  onCategorySelect(null);
                  onSubCategorySelect(null);
                } else {
                  onCategorySelect(category.name);
                  onSubCategorySelect(null);
                }
              }}
              className={`w-full px-4 py-3 text-left font-medium transition-all border-b border-gray-100 flex items-center justify-between ${
                selectedCategory === category.name
                  ? 'bg-brand-green bg-opacity-20 text-gray-900 border-l-4 border-brand-green'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{category.name}</span>
              {selectedCategory === category.name && (
                <ChevronRight className="w-5 h-5 text-brand-green" />
              )}
            </button>

            {selectedCategory === category.name && filteredSubCategories.length > 0 && (
              <div className="bg-gray-50">
                {filteredSubCategories.map((subCategory) => (
                  <button
                    key={subCategory.id}
                    onClick={() => onSubCategorySelect(subCategory.name)}
                    className={`w-full px-8 py-2.5 text-left text-sm transition-all border-b border-gray-200 flex items-center justify-between ${
                      selectedSubCategory === subCategory.name
                        ? 'bg-brand-green text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{subCategory.name}</span>
                    {selectedSubCategory === subCategory.name && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
