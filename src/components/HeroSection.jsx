const HeroSection = ({ recipe, imageLoaded, setImageLoaded }) => {
  return (
    <section className="relative">
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-gray-200">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-end">
            <div className="w-full p-4 sm:p-6 md:p-8">
              <div className="container mx-auto">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="bg-white/30 h-6 w-20 rounded-full"></div>
                    <div className="bg-white/30 h-6 w-24 rounded-full"></div>
                  </div>
                  <div className="h-8 sm:h-10 md:h-12 lg:h-16 bg-white/30 rounded-lg mb-3 sm:mb-4 w-3/4"></div>
                  <div className="h-4 sm:h-5 bg-white/30 rounded w-full max-w-2xl"></div>
                  <div className="h-4 sm:h-5 bg-white/30 rounded w-2/3 max-w-2xl mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              {/* Tags - Stack on mobile, row on larger screens */}
              <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/30 whitespace-nowrap">
                  {recipe.strArea}
                </span>
                <span className="bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-white/30 whitespace-nowrap">
                  {recipe.strCategory}
                </span>
              </div>

              {/* Recipe Title - Responsive font sizes */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight sm:leading-tight md:leading-tight">
                {recipe.strMeal}
              </h1>

              {/* Description - Responsive text and layout */}
              <div className="space-y-2 sm:space-y-0">
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/90 max-w-2xl leading-relaxed sm:leading-relaxed">
                  A delicious {recipe.strCategory.toLowerCase()} recipe from{" "}
                  {recipe.strArea} that will delight your taste buds.
                </p>
                {/* Additional description line for larger screens */}
                <p className="hidden sm:block text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 max-w-2xl leading-relaxed">
                  Simple preparation with authentic flavors and fresh
                  ingredients.
                </p>
              </div>

              {/* Quick Stats for Mobile */}
              <div className="sm:hidden mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-xs text-white/80">
                  <div className="text-center">
                    <div className="font-semibold text-white">Easy</div>
                    <div>Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">4.5</div>
                    <div>Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">30m</div>
                    <div>Prep Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Overlay for better text readability on mobile */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent sm:h-40 lg:h-48"></div>
      </div>
    </section>
  );
};

export default HeroSection;
