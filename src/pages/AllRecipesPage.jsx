import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  ChefHat,
  PlayCircle,
  Utensils,
  Eye,
  Star,
  Flame,
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  Zap,
  X,
} from "lucide-react";

const AllRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isSticky, setIsSticky] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);
  const stickyRef = useRef(null);

  const RECIPES_PER_PAGE = 10;

  // Sticky header observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px", // Adjust based on your main header height
      }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);

  // Helpers
  const getCookingTime = () =>
    [15, 20, 25, 30, 35, 40, 45, 50, 55, 60][Math.floor(Math.random() * 10)];
  const getRandomRating = () => (Math.random() * 2 + 3).toFixed(1);
  const getRandomDifficulty = () =>
    ["Easy", "Medium", "Intermediate"][Math.floor(Math.random() * 3)];

  const formatInstructions = (instructions) => {
    if (!instructions) return ["No instructions available."];
    return instructions.split("\r\n").filter((step) => step.trim());
  };

  const getIngredients = (recipe) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
      }
    }
    return ingredients;
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // 🔹 Main lazy fetcher
  const fetchRecipesPage = useCallback(async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      let categories = JSON.parse(localStorage.getItem("categories") || "[]");
      if (!categories.length) {
        const res = await fetch(
          "https://www.themealdb.com/api/json/v1/1/categories.php"
        );
        const data = await res.json();
        categories = data.categories.slice(0, 14);
        localStorage.setItem("categories", JSON.stringify(categories));
      }

      const totalCategories = categories.length;
      const totalPossibleRecipes = totalCategories * RECIPES_PER_PAGE;

      if (recipes.length >= totalPossibleRecipes) {
        setHasMore(false);
        return;
      }

      const categoryIndex = (page - 1) % totalCategories;
      const currentCategory = categories[categoryIndex];

      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${currentCategory.strCategory}`
      );
      const data = await res.json();

      if (!data.meals) {
        setHasMore(false);
        return;
      }

      const recipesFromThisCategory = recipes.filter(
        (recipe) => recipe.category === currentCategory.strCategory
      ).length;

      const startIndex = recipesFromThisCategory;
      const endIndex = startIndex + RECIPES_PER_PAGE;
      const mealsToLoad = data.meals.slice(startIndex, endIndex);

      if (!mealsToLoad.length) {
        const nextCategoryIndex = page % totalCategories;
        if (nextCategoryIndex === 0 && page > totalCategories) {
          setHasMore(false);
        }
        return;
      }

      const detailedRecipes = [];
      for (const meal of mealsToLoad) {
        try {
          const detailRes = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
          );
          const detailData = await detailRes.json();

          if (detailData.meals && detailData.meals[0]) {
            detailedRecipes.push({
              ...detailData.meals[0],
              cookingTime: getCookingTime(),
              rating: getRandomRating(),
              difficulty: getRandomDifficulty(),
              category: currentCategory.strCategory,
            });
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (err) {
          console.error("Error fetching recipe details:", err);
        }
      }

      setRecipes((prev) => {
        const newRecipes = [...prev, ...detailedRecipes];
        const uniqueRecipes = newRecipes.reduce((acc, current) => {
          const x = acc.find((item) => item.idMeal === current.idMeal);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        return uniqueRecipes;
      });

      if (detailedRecipes.length < RECIPES_PER_PAGE) {
        const nextCategoryIndex = page % totalCategories;
        if (nextCategoryIndex === 0 && page >= totalCategories) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, recipes.length]);

  // Load page on mount and when page changes
  useEffect(() => {
    if (hasMore) {
      fetchRecipesPage();
    }
  }, [fetchRecipesPage, hasMore]);

  // Improved Infinite scroll observer
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [loading, hasMore]);

  // Filter + sort
  const filteredAndSortedRecipes = recipes
    .filter((r) => r.strMeal.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "time":
          return a.cookingTime - b.cookingTime;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.strMeal.localeCompare(b.strMeal);
      }
    });

  const handleViewDetails = (recipeName) =>
    navigate(`/recipe/${encodeURIComponent(recipeName)}`);

  // Loading and error states
  if (error) {
    return (
      <div
        className="flex  items-center justify-center text-center bg-gray-50 px-4"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
            Something went wrong 😔
          </h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Responsive */}
      <section
        className="relative h-60 sm:h-72 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/Images/all-recipe.jpeg")`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            All Recipes
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto font-light px-2">
            Explore our collection of delicious recipes from around the world
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 text-green-100">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <ChefHat size={14} className="sm:w-4" />
              <span>{recipes.length} Recipes</span>
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <Zap size={14} className="sm:w-4" />
              <span>50+ Categories</span>
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2">
              <TrendingUp size={14} className="sm:w-4" />
              <span>Global Cuisines</span>
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Sentinel - This triggers the sticky state */}
      <div ref={stickyRef} className="h-0" />

      {/* Controls - Enhanced Sticky Behavior */}
      <section
        className={`bg-white  transition-all duration-300 ${
          isSticky
            ? "fixed top-0 left-0 right-0 z-50 shadow-lg py-3 md:py-4"
            : "relative py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
            {/* Search - Always visible */}
            <div className="relative w-full lg:flex-1 lg:max-w-lg">
              <Search
                className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  loading ? "Loading recipes..." : "Search recipes..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
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

            {/* Controls Group - Hidden on mobile when sticky, visible on desktop */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full lg:w-auto ${
                isSticky ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Sort and View Controls */}
              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2">
                  <Filter size={16} className="text-gray-500 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base w-32 sm:w-auto"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="time">Sort by Time</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-xs sm:text-sm text-gray-500 bg-green-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-green-200 w-full sm:w-auto text-center">
                Showing{" "}
                <span className="font-semibold text-green-700">
                  {filteredAndSortedRecipes.length}
                </span>{" "}
                recipes
              </div>
            </div>

            {/* Mobile-only sticky results count */}
            {isSticky && (
              <div className="lg:hidden text-xs text-gray-500 w-full  text-center ">
                <span className="font-semibold text-green-700">
                  {filteredAndSortedRecipes.length}
                </span>{" "}
                recipes
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Spacer to prevent content jump when controls become fixed */}
      {isSticky && <div className="h-16 md:h-20" />}

      {/* Main Content - Responsive */}
      <main className="container mx-auto px-3 sm:px-4 py-6 md:py-8">
        {filteredAndSortedRecipes.length === 0 && !loading ? (
          <div className="text-center py-12 md:py-20 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 mx-2">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">🍳</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              No Recipes Found
            </h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No recipes available yet"}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 text-sm md:text-base"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                : "space-y-4 md:space-y-6"
            }`}
          >
            {filteredAndSortedRecipes.map((recipe) => {
              const ingredients = getIngredients(recipe);
              const instructions = formatInstructions(recipe.strInstructions);

              return (
                <div
                  key={recipe.idMeal}
                  className={`bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "flex flex-col h-full"
                      : "flex flex-col lg:flex-row"
                  }`}
                >
                  {/* Image Section - Responsive */}
                  <div
                    className={`relative overflow-hidden bg-gray-200 ${
                      viewMode === "grid"
                        ? "h-40 sm:h-48 flex-shrink-0"
                        : "lg:w-64 xl:w-80 lg:h-56 xl:h-64 flex-shrink-0"
                    }`}
                  >
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm">
                      {recipe.strArea}
                    </div>
                    {recipe.strYoutube && (
                      <div
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-lg md:rounded-xl hover:bg-red-600 transition-colors duration-300 cursor-pointer shadow-sm"
                        onClick={() => window.open(recipe.strYoutube, "_blank")}
                      >
                        <PlayCircle size={16} className="md:w-4" />
                      </div>
                    )}
                  </div>

                  {/* Content Section - Responsive */}
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    <div className="mb-3 md:mb-4">
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-tight line-clamp-2">
                        {recipe.strMeal}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {recipe.strInstructions
                          ? recipe.strInstructions.substring(0, 100) + "..."
                          : "A delicious recipe that will satisfy your taste buds."}
                      </p>
                    </div>

                    {/* Stats Grid - Responsive */}
                    <div className="mb-3 md:mb-4 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600">
                        <Clock size={14} className="text-green-600 md:w-4" />
                        <span>{recipe.cookingTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600">
                        <Utensils size={14} className="text-green-600 md:w-4" />
                        <span>{ingredients.length} items</span>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-current md:w-4"
                        />
                        <span>{recipe.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600">
                        <Flame size={14} className="text-orange-500 md:w-4" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Ingredients - Responsive */}
                    <div className="mb-4 md:mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-xs md:text-sm">
                        Key Ingredients:
                      </h4>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {ingredients.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="bg-green-50 text-green-700 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm border border-green-200 font-medium"
                          >
                            {item.ingredient}
                          </span>
                        ))}
                        {ingredients.length > 3 && (
                          <span className="bg-gray-50 text-gray-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm border border-gray-200">
                            +{ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buttons - Responsive */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-2 md:gap-3">
                      <button
                        onClick={() => handleViewDetails(recipe.strMeal)}
                        className="flex-1 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 md:py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm md:text-base"
                      >
                        <Eye size={16} className="md:w-4" />
                        <span>View Recipe</span>
                      </button>
                      {recipe.strYoutube && (
                        <button
                          onClick={() =>
                            window.open(recipe.strYoutube, "_blank")
                          }
                          className="bg-white border border-gray-300 text-gray-700 py-2.5 md:py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                          <PlayCircle className="w-5 h-5 flex-shrink-0" />
                          <span className="hidden xs:block">Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Improved Infinite Scroll Loader - Responsive */}
        <div
          ref={observerRef}
          className="h-16 md:h-20 flex items-center justify-center text-gray-500"
        >
          {loading ? (
            <div className="flex items-center justify-center py-6 md:py-8 space-x-4">
              <div className="text-sm text-gray-600 flex flex-col items-center">
                <div className="flex space-x-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold md:text-sm mt-2">
                  Loading recipes...
                </span>
              </div>
            </div>
          ) : !hasMore && recipes.length > 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2 text-sm md:text-base">
                You've reached the end of our recipe collection!
              </p>
              <p className="text-xs md:text-sm text-gray-400">
                Loaded {recipes.length} delicious recipes
              </p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AllRecipesPage;
