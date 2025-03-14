const MainSection = ({ categories, onCategorySelect, onSubcategorySelect }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
         Getting Categeory...
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-3 gap-4 w-full h-full">
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:bg-blue-50 transition flex items-center justify-center text-center w-full h-full"
          onClick={() => onCategorySelect(cat)}
        >
          <h3 className="text-lg font-bold">{cat.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default MainSection;
