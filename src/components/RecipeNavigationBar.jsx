import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Printer,
  Check,
} from "lucide-react";

const RecipeNavigationBar = ({
  onBack,
  onLike,
  onSave,
  onShare,
  onPrint,
  isFavorite,
  isSaved,
  copiedUrl,
}) => {
  return (
    <nav className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Back Button - Better mobile experience */}
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 group active:scale-95"
          >
            {/* Always show arrow icon */}
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform"
            />

            {/* Text that shows on tablet and up */}
            <span className="font-medium hidden sm:inline">
              Back to Recipes
            </span>

            {/* Enhanced mobile text with better spacing */}
            {/* <span className="font-medium sm:hidden text-sm ml-1">Back</span> */}
          </button>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-1 sm:space-x-2 md:space-x-3">
            <button
              onClick={onLike}
              className={`p-2 rounded-lg transition-all duration-300 active:scale-95 ${
                isFavorite
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                size={20}
                className="w-5 h-5"
                fill={isFavorite ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={onSave}
              className={`p-2 rounded-lg transition-all duration-300 active:scale-95 ${
                isSaved
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              title={isSaved ? "Remove from saved" : "Save recipe"}
            >
              <Bookmark
                size={20}
                className="w-5 h-5"
                fill={isSaved ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={onShare}
              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-300 active:scale-95 group relative"
              title="Share recipe"
            >
              {copiedUrl ? (
                <Check size={20} className="w-5 h-5" />
              ) : (
                <Share2 size={20} className="w-5 h-5" />
              )}
              {copiedUrl && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Copied!
                </div>
              )}
            </button>

            <button
              onClick={onPrint}
              className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-300 active:scale-95"
              title="Print recipe"
            >
              <Printer size={20} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default RecipeNavigationBar;
