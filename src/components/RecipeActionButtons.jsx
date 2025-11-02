import { Globe, Bookmark, ExternalLink, Download, Share2 } from "lucide-react";
import { useState } from "react";

const RecipeActionButtons = ({
  recipe,
  onSave,
  isSaved,
  isSavedIcon = false,
  isMobile = false,
  onShare,
  onPrint,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onSave();
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleOriginalRecipe = () => {
    window.open(recipe.strSource, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`space-y-3 sm:space-y-4 ${isMobile ? "flex flex-col" : ""}`}
    >
      {/* Original Recipe Button */}
      {recipe.strSource && (
        <button
          onClick={handleOriginalRecipe}
          className="w-full bg-white border border-green-500 sm:border-2 text-green-600 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50/50 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 hover:shadow-md group active:scale-95"
        >
          <Globe
            size={18}
            className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
          />
          <span className="text-sm sm:text-base whitespace-nowrap">
            View Original
          </span>
        </button>
      )}

      {/* Save Recipe Button */}
      <button
        onClick={handleSaveClick}
        disabled={isLoading}
        className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 group active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${
          isSaved
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-400 sm:border-2 sm:border-green-500 text-green-600 hover:from-green-100 hover:to-emerald-100 hover:shadow-md"
            : "bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white hover:from-green-600 hover:via-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Bookmark
            size={18}
            className={`sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${
              isSaved && isSavedIcon ? "fill-current" : ""
            }`}
            fill={isSaved && isSavedIcon ? "currentColor" : "none"}
          />
        )}
        <span className="text-sm sm:text-base whitespace-nowrap">
          {isLoading ? "Saving..." : isSaved ? "Recipe Saved" : "Save Recipe"}
        </span>
      </button>

      {/* Additional Actions Row - Only on mobile */}
      {isMobile && (
        <div className="flex space-x-3 pt-2">
          <button
            onClick={onShare}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-gray-200 active:scale-95 group"
          >
            <Share2
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xs whitespace-nowrap">Share</span>
          </button>

          <button
            onClick={onPrint}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-gray-200 active:scale-95 group"
          >
            <Download
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-xs whitespace-nowrap">Print</span>
          </button>
        </div>
      )}

      {/* Success State Indicator */}
      {isSaved && (
        <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bookmark />
            </div>
            <div className="flex-1">
              <p className="text-green-800 font-medium text-sm sm:text-base">
                Recipe saved to your collection
              </p>
              <p className="text-green-600 text-xs sm:text-sm mt-0.5">
                Access it anytime from your saved recipes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeActionButtons;
