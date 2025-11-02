import React, { useState, useEffect } from "react";
import {
  Search,
  ChefHat,
  ArrowRight,
  Clock,
  Users,
  Star,
  TrendingUp,
  Heart,
  Zap,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        const data = await response.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.strCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  // Handle popular recipes click
  const handlePopularRecipes = () => {
    if (categories.length > 0) {
      navigate(`/all-recipes`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Format description - limit length and add fallback
  const formatDescription = (description) => {
    if (!description) {
      return "Discover amazing recipes in this category. Explore various cooking styles and ingredients to create delicious meals.";
    }
    const cleanDescription = description.replace(/\r\n/g, " ");
    return cleanDescription.length > 120
      ? cleanDescription.substring(0, 120) + "..."
      : cleanDescription;
  };

  // Fallback values for missing data
  const getFallbackData = (category) => ({
    name: category?.strCategory || "Unnamed Category",
    image: category?.strCategoryThumb || "/api/placeholder/300/200",
    description: formatDescription(category?.strCategoryDescription),
    recipeCount: Math.floor(Math.random() * 50) + 10,
    popularity: (Math.random() * 2 + 3).toFixed(1),
  });

  // Hero background image
  const heroBackground = "/Images/category.jpeg";

  if (loading) {
    return (
      <div
        className=" bg-gray-50 flex items-center justify-center px-4"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-gray-600 font-light">
            Loading delicious categories...
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Discovering culinary treasures from around the world
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section - Mobile Responsive */}
      <section
        className="relative h-60 sm:h-72 md:h-80 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
            Explore Categories
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl font-light px-2">
            Discover recipes by category and find your next culinary inspiration
          </p>

          {/* Stats - Responsive Layout */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-green-100">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <ChefHat size={14} className="sm:w-4" />
              <span>{categories.length} Categories</span>
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <Zap size={14} className="sm:w-4" />
              <span>1000+ Recipes</span>
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <TrendingUp size={14} className="sm:w-4" />
              <span>Global Cuisines</span>
            </span>
          </div>
        </div>
      </section>

      {/* Controls Section - Mobile Responsive */}
      <section className="bg-white  py-4 md:py-6">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search - Full width on mobile */}
            <div className="relative w-full lg:flex-1 lg:max-w-lg">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Results Count - Adjusts for mobile */}
            <div className="text-xs sm:text-sm text-gray-500 bg-green-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-green-200 w-full lg:w-auto text-center lg:text-left">
              Showing{" "}
              <span className="font-semibold text-green-700">
                {filteredCategories.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {categories.length}
              </span>{" "}
              categories
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Responsive Grid */}
      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        {/* Categories Grid Section */}
        <section className="mb-12 md:mb-16">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 mx-2">
              <div className="text-4xl md:text-6xl mb-4 md:mb-6">🍳</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                No Categories Found
              </h3>
              <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-lg max-w-md mx-auto px-4">
                {searchTerm
                  ? `We couldn't find any categories matching "${searchTerm}"`
                  : "No categories available at the moment"}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg text-sm md:text-base"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={() => navigate("/")}
                  className="border border-green-500 text-green-600 px-6 py-2.5 md:px-8 md:py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-200 text-sm md:text-base"
                >
                  Back to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredCategories.map((category) => {
                const fallbackData = getFallbackData(category);

                return (
                  <div
                    key={category.idCategory}
                    className="bg-white rounded-xl md:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group border border-gray-100"
                    onClick={() => handleCategoryClick(category.strCategory)}
                  >
                    {/* Category Image - Responsive height */}
                    <div className="relative h-40 sm:h-36 md:h-48 overflow-hidden">
                      <img
                        src={category.strCategoryThumb || fallbackData.image}
                        alt={category.strCategory || fallbackData.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23DCFCE7'/%3E%3Cpath d='M150 80 L130 120 L170 120 Z' fill='%2316A34A'/%3E%3Ccircle cx='150' cy='70' r='10' fill='%2316A34A'/%3E%3C/svg%3E";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-sm">
                        {fallbackData.recipeCount}+ recipes
                      </div>
                      <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                          Explore →
                        </div>
                      </div>
                    </div>

                    {/* Category Content - Responsive padding */}
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h3 className="font-bold text-lg md:text-xl text-gray-800 group-hover:text-green-600 transition-colors duration-200 line-clamp-1 pr-2">
                          {category.strCategory || fallbackData.name}
                        </h3>
                        <ArrowRight
                          size={18}
                          className="text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                        />
                      </div>

                      <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed line-clamp-2">
                        {formatDescription(category.strCategoryDescription)}
                      </p>

                      {/* Stats - Responsive layout */}
                      <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 pt-3 md:pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <div className="flex text-green-500 text-xs md:text-sm">
                            {"★".repeat(Math.floor(fallbackData.popularity))}
                            <span className="text-gray-300">
                              {"★".repeat(
                                5 - Math.floor(fallbackData.popularity)
                              )}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-700 text-xs">
                            {fallbackData.popularity}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-3 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock
                              size={10}
                              className="text-green-600 md:w-3"
                            />
                            <span className="hidden xs:inline">Various</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users
                              size={10}
                              className="text-green-600 md:w-3"
                            />
                            <span className="hidden xs:inline">Popular</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Enhanced CTA Section - Mobile Responsive */}
        <section className="mt-12 md:mt-16">
          <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 lg:p-12 text-center text-white">
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl">
                  <TrendingUp size={24} className="md:w-8" />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                Discover Popular Recipes
              </h3>
              <p className="text-green-100 text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                Explore our most-loved and trending recipes that have been
                tried, tested, and loved by our community of home chefs and
                cooking enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                <button
                  onClick={handlePopularRecipes}
                  className="bg-white text-green-600 hover:bg-gray-50 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 md:space-x-3"
                >
                  <Heart size={18} className="fill-current md:w-5" />
                  <span>Browse Popular Recipes</span>
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-200 flex items-center justify-center space-x-2 md:space-x-3"
                >
                  <ChefHat size={18} className="md:w-5" />
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Section - Responsive Grid */}
        <section className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-green-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Users className="text-white" size={18} />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
              10,000+
            </h4>
            <p className="text-gray-600 text-sm md:text-base">Active Cooks</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-green-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Star className="text-white" size={18} fill="currentColor" />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
              4.8/5
            </h4>
            <p className="text-gray-600 text-sm md:text-base">Average Rating</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-green-200">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <Zap className="text-white" size={18} />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
              15 min
            </h4>
            <p className="text-gray-600 text-sm md:text-base">
              Average Prep Time
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CategoriesPage;
