const IngredientsList = ({ ingredients }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Ingredients
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {ingredients.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 hover:border-green-500/30 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-transparent transition-all duration-300"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500/20 to-green-500/10 text-green-500 rounded-md sm:rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {item.ingredient}
              </div>
              {item.measure && (
                <div className="text-green-500 text-xs sm:text-sm font-medium mt-0.5">
                  {item.measure}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Summary Card */}
      <div className="sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-blue-800 font-medium text-sm">
            {ingredients.length} ingredients ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;
