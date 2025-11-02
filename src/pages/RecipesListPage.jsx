import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  ChefHat,
  ArrowLeft,
  PlayCircle,
  Utensils,
  Eye,
  Star,
  Users,
  Flame,
  Search,
  Filter,
  Grid,
  List,
  X,
} from "lucide-react";

const RecipesListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  // Fetch recipes for the selected category
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${id}`
        );
        const data = await response.json();

        if (data.meals) {
          // Fetch detailed information for each recipe
          const detailedRecipes = await Promise.all(
            data.meals.slice(0, 20).map(async (meal) => {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
              );
              const detailData = await detailResponse.json();
              return {
                ...detailData.meals[0],
                cookingTime: getCookingTime(),
                rating: getRandomRating(),
                difficulty: getRandomDifficulty(),
              };
            })
          );
          setRecipes(detailedRecipes);
        } else {
          setRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipes();
    }
  }, [id]);

  // Format instructions
  const formatInstructions = (instructions) => {
    if (!instructions) return ["No instructions available."];
    return instructions.split("\r\n").filter((step) => step.trim());
  };

  // Get ingredients list
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

  // Calculate random cooking time
  const getCookingTime = () => {
    const times = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Calculate random rating
  const getRandomRating = () => {
    return (Math.random() * 2 + 3).toFixed(1);
  };

  // Get random difficulty
  const getRandomDifficulty = () => {
    const difficulties = ["Easy", "Medium", "Intermediate"];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = recipes
    .filter((recipe) =>
      recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "time":
          return a.cookingTime - b.cookingTime;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.strMeal.localeCompare(b.strMeal);
      }
    });

  // Handle view details
  const handleViewDetails = (recipeName) => {
    navigate(`/recipe/${encodeURIComponent(recipeName)}`);
  };

  if (loading) {
    return (
      <div
        className="bg-gray-50 flex items-center justify-center px-4"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-gray-600 font-light">
            Fetching delicious recipes...
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Exploring the finest dishes in your selected category
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-gray-50 flex items-center justify-center px-4"
        style={{ height: "calc(100vh - 85px)" }}
      >
        <div className="text-center py-12 md:py-16 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 px-6 md:px-8 max-w-md w-full mx-4">
          <div className="text-4xl md:text-6xl mb-4">😔</div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>
          <button
            onClick={() => navigate("/categories")}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm md:text-base"
          >
            Back to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Responsive */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <button
                onClick={() => navigate("/categories")}
                className="bg-green-50 text-green-600 p-2 rounded-lg hover:bg-green-100 transition-colors duration-300 flex-shrink-0"
              >
                <ArrowLeft size={18} className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 capitalize leading-tight">
                  {id} Recipes
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  Discover amazing {id.toLowerCase()} recipes from around the
                  world
                </p>
              </div>
            </div>

            {/* Stats - Responsive */}
            <div className="hidden sm:block bg-green-50 rounded-xl px-4 py-3 border border-green-200">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-900">
                  {recipes.length}
                </div>
                <div className="text-xs md:text-sm text-green-700 font-medium">
                  Recipes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section - Responsive */}
      {recipes.length > 0 && (
        <section className="bg-white  md:sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-3 md:py-4">
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
              {/* Search - Full width on mobile */}
              <div className="relative w-full lg:flex-1 lg:max-w-lg">
                <Search
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={`Search ${id} recipes...`}
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

              {/* Sort and View Controls */}
              <div className="flex items-center justify-between w-full lg:w-auto gap-3 md:gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Filter size={16} className="text-gray-500 hidden sm:block" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-sm md:text-base w-32 md:w-auto"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="time">Sort by Time</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid size={16} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List size={16} className="w-4 h-4" />
                  </button>
                </div>

                {/* Results Count - Responsive */}
                <div className="text-xs sm:text-sm text-gray-500 bg-green-50 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-green-200 hidden sm:block">
                  Showing{" "}
                  <span className="font-semibold text-green-700">
                    {filteredAndSortedRecipes.length}
                  </span>{" "}
                  recipes
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Responsive */}
      <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        {filteredAndSortedRecipes.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 mx-2">
            <div className="text-4xl md:text-6xl mb-4 md:mb-6">🍳</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              No Recipes Found
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-lg max-w-md mx-auto px-4">
              {searchTerm
                ? `No recipes found for "${searchTerm}" in ${id} category.`
                : `No recipes available for "${id}" category.`}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4">
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 text-sm md:text-base"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => navigate("/categories")}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 text-sm md:text-base"
              >
                Browse Categories
              </button>
            </div>
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
                  {/* Recipe Image - Responsive */}
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

                  {/* Recipe Content - Responsive */}
                  <div className="p-4 md:p-6 flex flex-col flex-1">
                    {/* Title Section */}
                    <div className="mb-3 md:mb-4">
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2 md:mb-3 leading-tight line-clamp-2">
                        {recipe.strMeal}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {recipe.strInstructions
                          ? recipe.strInstructions.substring(0, 100) + "..."
                          : "A delicious recipe that will satisfy your taste buds."}
                      </p>
                    </div>

                    {/* Stats Section - Responsive */}
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

                    {/* Ingredients Section - Responsive */}
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

                    {/* Action Buttons - Responsive */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-2 md:gap-3">
                      <button
                        onClick={() => handleViewDetails(recipe.strMeal)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 md:py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm md:text-base"
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
      </main>
    </div>
  );
};

export default RecipesListPage;
