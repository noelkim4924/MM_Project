import { useState } from "react";
import { categories, subcategories } from "../data/dummyCategories";

const MainSection = ({ onCategorySelect, onSubcategorySelect }) => { // ✅ 여기 수정!
  const [currentView, setCurrentView] = useState("main");

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "detailed") {
      onSubcategorySelect("all"); // ✅ 여기에서 전체 세부 카테고리 표시
      return;
    }
    if (subcategories[categoryId]) {
      setCurrentView(categoryId);
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="p-4 grid grid-cols-3 gap-4 w-full h-full">
      {currentView === "main" ? (
        categories.map((category) => (
          <div
            key={category.id}
            className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex items-center justify-center text-center w-full h-full"
            onClick={() => handleCategoryClick(category.id)}
          >
            <h3 className="text-lg font-bold">{category.name}</h3>
          </div>
        ))
      ) : (
        <>
          {subcategories[currentView].map((subcategory) => (
            <div
              key={subcategory}
              className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex items-center justify-center text-center w-full h-full"
              onClick={() => onSubcategorySelect(subcategory)}
            >
              <h3 className="text-lg font-bold">{subcategory}</h3>
            </div>
          ))}
          <div
            className="p-4 border rounded-lg shadow bg-gray-200 cursor-pointer hover:bg-gray-300 transition flex items-center justify-center text-center"
            onClick={() => setCurrentView("main")}
          >
            <h3 className="text-lg font-bold">뒤로 가기</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default MainSection;
