import { Globe, Salad, Users, Timer } from "lucide-react";

const RecipeInfoSidebar = ({ recipe }) => {
  const infoItems = [
    {
      icon: Globe,
      label: "Cuisine",
      value: recipe.strArea,
      key: "cuisine",
    },
    {
      icon: Salad,
      label: "Category",
      value: recipe.strCategory,
      key: "category",
    },
    {
      icon: Users,
      label: "Servings",
      value: "4 people",
      key: "servings",
    },
    {
      icon: Timer,
      label: "Difficulty",
      value: "Beginner Friendly",
      isSpecial: true,
      key: "difficulty",
    },
  ];

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-6">
      {/* Header - Responsive */}
      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">
        Recipe Information
      </h3>

      {/* Mobile Grid Layout */}
      <div className="sm:hidden grid grid-cols-2 gap-3">
        {infoItems.map((item) => (
          <div
            key={item.key}
            className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200"
          >
            <item.icon
              size={16}
              className="text-gray-500 mx-auto mb-2 w-4 h-4"
            />
            <div className="text-xs text-gray-600 font-medium mb-1">
              {item.label}
            </div>
            <div
              className={`text-sm font-semibold ${
                item.isSpecial ? "text-green-500" : "text-gray-900"
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop List Layout */}
      <div className="hidden sm:block space-y-3 md:space-y-4">
        {infoItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between py-2 md:py-3 border-b border-gray-100 last:border-b-0"
          >
            <span className="font-medium text-gray-700 flex items-center space-x-2 md:space-x-3">
              <item.icon
                size={18}
                className="text-gray-500 flex-shrink-0 w-4 h-4 md:w-5 md:h-5"
              />
              <span className="text-sm md:text-base">{item.label}</span>
            </span>
            {item.isSpecial ? (
              <span className="font-semibold text-green-500 bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm">
                {item.value}
              </span>
            ) : (
              <span className="font-semibold text-gray-900 text-sm md:text-base">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeInfoSidebar;
