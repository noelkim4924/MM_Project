import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";

const AccordionTree = ({ onMentorSelect }) => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  // mentorsBySubcat: { [subcatId]: mentorArray }
  const [mentorsBySubcat, setMentorsBySubcat] = useState({});

  // MongoDB에서 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        // 응답 구조: { success: true, data: [ { _id, name, subcategories:[...] }, ... ] }
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // 카테고리 토글 (펼치기/접기)
  const toggleCategory = (catId) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  // 세부 카테고리 클릭 시 멘토 목록 불러오기
  const fetchMentorsForSubcat = async (subcat) => {
    try {
      const res = await axiosInstance.get("/matches/user-profiles", {
        params: {
          category: subcat._id,
          role: "mentor",
        },
      });
      setMentorsBySubcat((prev) => ({
        ...prev,
        [subcat._id]: res.data.users,
      }));
      if (onMentorSelect) onMentorSelect(subcat, res.data.users);
    } catch (error) {
      console.error("Error fetching mentors for subcategory:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">카테고리 선택</h2>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat._id} className="border rounded-md overflow-hidden">
            <div
              className="p-4 bg-gray-100 cursor-pointer flex justify-between items-center"
              onClick={() => toggleCategory(cat._id)}
            >
              <span className="font-semibold">{cat.name}</span>
              <span className="text-xl">
                {expandedCategory === cat._id ? "−" : "+"}
              </span>
            </div>
            {expandedCategory === cat._id && (
              <div className="p-4 bg-white">
                <h3 className="text-lg font-medium mb-2">세부 카테고리</h3>
                <ul className="space-y-2">
                  {cat.subcategories.map((subcat) => (
                    <li
                      key={subcat._id}
                      className="cursor-pointer hover:underline text-blue-600"
                      onClick={() => fetchMentorsForSubcat(subcat)}
                    >
                      {subcat.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionTree;
