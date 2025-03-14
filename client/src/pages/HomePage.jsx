import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Header } from "../components/Header";
import MainSection from "../components/MainSection";
import { mentors, subcategories } from "../data/dummyCategories";

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen h-screen bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      <Sidebar />
      <div className="flex-grow flex flex-col overflow-hidden">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          {!selectedCategory ? (
            <MainSection
              onCategorySelect={setSelectedCategory}
              onSubcategorySelect={setSelectedSubcategory} // ✅ 여기 추가!!
            />
          ) : selectedSubcategory === "all" ? (
            <div className="p-4 grid grid-cols-3 gap-4">
              {Object.keys(subcategories)
                .flatMap((key) => subcategories[key])
                .map((subcategory) => (
                  <div
                    key={subcategory}
                    className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex flex-col items-center"
                    onClick={() => setSelectedSubcategory(subcategory)}
                  >
                    <h3 className="text-lg font-bold text-center">{subcategory}</h3>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-4 grid grid-cols-3 gap-4">
              {mentors[selectedSubcategory] ? (
                mentors[selectedSubcategory].map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex flex-col items-center"
                    onClick={() => window.location.href = `/chat/${mentor.id}`}
                  >
                    <h3 className="text-lg font-bold text-center">{mentor.name}</h3>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">멘토가 없습니다.</p>
              )}
              <div
                className="p-4 border rounded-lg shadow bg-gray-200 cursor-pointer hover:bg-gray-300 transition flex items-center justify-center text-center"
                onClick={() => setSelectedSubcategory(null)}
              >
                <h3 className="text-lg font-bold">뒤로 가기</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
