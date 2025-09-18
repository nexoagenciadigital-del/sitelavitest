import React from 'react';
import { Category } from '../types';

interface CategoriesProps {
  categories: Category[];
  onCategorySelect: (categoryName: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ categories, onCategorySelect }) => {
  const handleCategoryClick = (categoryName: string | null) => {
    onCategorySelect(categoryName);
  };

  return (
    <section id="categorias" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Nossas Categorias</h2>
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Carregando categorias...</p>
            <div className="animate-pulse mt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-xl h-48"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
              onClick={() => handleCategoryClick(null)}
            >
              <div className="relative h-40 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                <span className="text-white text-2xl font-bold z-10">Todos</span>
                <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                  Ver Todos
                </h3>
              </div>
            </div>
            
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden group"
                onClick={() => handleCategoryClick(category.name)}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={category.image_url || 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold z-10">{category.name}</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;