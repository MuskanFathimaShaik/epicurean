import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  // fallback values
  const imageSrc =
    recipe?.image ||
    "https://via.placeholder.com/400x300?text=No+Image+Available";
  const title = recipe?.title || "Untitled Recipe";
  const cuisine = recipe?.cuisine || "Unknown";
  const category = recipe?.category || "Uncategorized";
  const difficulty = recipe?.difficulty || null;
  const cookTime = recipe?.cookTime || "N/A";
  const rating = recipe?.rating ? parseFloat(recipe.rating) : 0;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 border border-gray-100 sm:border-gray-200">
      {/* Image Section */}
      <div className="relative">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-40 xs:h-44 sm:h-48 object-cover"
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
          {category}
        </div>
        {difficulty && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {difficulty}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        {/* Title and Cuisine */}
        <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
          {cuisine} Cuisine
        </p>

        {/* Tags */}
        {recipe?.tags && recipe.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="bg-gray-100 text-gray-600 px-2 py-1 italic rounded text-xs mb-2 sm:mb-3 inline-block">
            No tags available
          </span>
        )}

        {/* Time & Reviews */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <div className="flex items-center space-x-1">
            <Clock
              size={14}
              sm:size={16}
              className="text-green-600 flex-shrink-0"
            />
            <span className="truncate">{cookTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users
              size={14}
              sm:size={16}
              className="text-green-600 flex-shrink-0"
            />
            <span className="truncate">
              {recipe?.reviewsCount
                ? `${recipe.reviewsCount} reviews`
                : `${Math.floor(Math.random() * 100) + 20} reviews`}
            </span>
          </div>
        </div>

        {/* Rating & Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1 min-w-0 flex-1">
            <div className="flex text-green-500 text-sm sm:text-base">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
              {rating > 0 ? rating : "No rating"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/recipe/${title}`)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm flex-shrink-0 whitespace-nowrap"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
