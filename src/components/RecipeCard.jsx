import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  // Fallback values
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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 sm:border-gray-200 w-full max-w-xs xs:max-w-sm sm:w-full md:w-84 mx-auto">
      {/* Image Section */}
      <div className="relative aspect-[4/3]">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-90">
          {category}
        </div>
        {difficulty && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-90">
            {difficulty}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4">
        {/* Title and Cuisine */}
        <div className="mb-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-800 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[2.75rem] flex items-start">
            {title}
          </h3>
          <p className="text-gray-600 text-xs mt-1">{cuisine} Cuisine</p>
        </div>

        {/* Tags */}
        {recipe?.tags && recipe.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 mb-2">
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
        ) : (
          <div className="mb-2">
            <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 italic rounded text-xs inline-block">
              No tags
            </span>
          </div>
        )}

        {/* Time & Reviews */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-1 flex-1 min-w-0">
            <Clock
              size={14}
              className="text-green-600 flex-shrink-0 min-w-[14px]"
            />
            <span className="truncate">{cookTime}</span>
          </div>
          <div className="flex items-center space-x-1 flex-1 min-w-0 justify-end">
            <Users
              size={14}
              className="text-green-600 flex-shrink-0 min-w-[14px]"
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
            <div className="flex text-green-500 text-sm">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-xs font-semibold text-gray-700 truncate">
              {rating > 0 ? rating.toFixed(1) : "No rating"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/recipe/${title}`)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm flex-shrink-0 whitespace-nowrap min-w-[80px] sm:min-w-[90px]"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
