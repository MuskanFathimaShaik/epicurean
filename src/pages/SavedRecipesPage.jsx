import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  PlayCircle,
  Utensils,
  Eye,
  Star,
  Flame,
  Search,
  Filter,
  Grid,
  List,
  Bookmark,
  X,
  Trash2,
  Undo,
  XIcon,
} from "lucide-react";

const SavedRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [unsavingRecipe, setUnsavingRecipe] = useState(null);
  const [showUndo, setShowUndo] = useState(null);
  const [removedRecipe, setRemovedRecipe] = useState(null);

  // Load saved recipes from localStorage
  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        setIsLoading(true);
        const savedRecipesData = localStorage.getItem("savedRecipes");
        if (savedRecipesData) {
          const savedRecipes = JSON.parse(savedRecipesData);
          await fetchRecipeDetails(savedRecipes);
        }
      } catch (error) {
        console.error("Error loading saved recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedRecipes();
  }, []);

  // Fetch full recipe details from API
  const fetchRecipeDetails = async (savedRecipesList) => {
    try {
      const detailedRecipes = await Promise.all(
        savedRecipesList.map(async (recipeName) => {
          try {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
                recipeName
              )}`
            );
            const data = await response.json();

            if (data.meals && data.meals[0]) {
              return {
                ...data.meals[0],
                cookingTime: getCookingTime(),
                rating: getRandomRating(),
                difficulty: getRandomDifficulty(),
              };
            }
            return null;
          } catch (err) {
            console.error("Error fetching recipe details:", err);
            return null;
          }
        })
      );

      setRecipes(detailedRecipes.filter((recipe) => recipe !== null));
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
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

  // Professional unsave functionality
  const handleUnsave = async (recipeName) => {
    setUnsavingRecipe(recipeName);

    // Add a small delay for smooth animation
    await new Promise((resolve) => setTimeout(resolve, 300));

    const recipeToRemove = recipes.find(
      (recipe) => recipe.strMeal === recipeName
    );
    const updatedRecipes = recipes.filter(
      (recipe) => recipe.strMeal !== recipeName
    );

    setRecipes(updatedRecipes);
    setRemovedRecipe(recipeToRemove);
    setUnsavingRecipe(null);

    // Update localStorage
    const savedRecipeNames = updatedRecipes.map((r) => r.strMeal);
    localStorage.setItem("savedRecipes", JSON.stringify(savedRecipeNames));

    // Show undo option for 5 seconds
    setShowUndo(recipeName);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (showUndo) {
        setShowUndo(null);
        setRemovedRecipe(null);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [showUndo]);

  // Undo unsave functionality
  const handleUndoUnsave = () => {
    if (removedRecipe) {
      const updatedRecipes = [...recipes, removedRecipe];
      setRecipes(updatedRecipes);

      // Update localStorage
      const savedRecipeNames = updatedRecipes.map((r) => r.strMeal);
      localStorage.setItem("savedRecipes", JSON.stringify(savedRecipeNames));

      setShowUndo(null);
      setRemovedRecipe(null);
    }
  };

  // Quick unsave with confirmation
  const handleQuickUnsave = (recipeName, e) => {
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm(`Remove "${recipeName}" from your saved recipes?`)) {
      handleUnsave(recipeName);
    }
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

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">
            Loading your saved recipes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Undo Notification - Responsive */}
      {showUndo && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 animate-in slide-in-from-right duration-300 max-w-sm mx-auto md:mx-0">
          <div className="bg-white rounded-xl flex items-center justify-between shadow-lg border border-gray-200 p-3 md:p-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Trash2 className="text-blue-600 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Recipe removed
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {removedRecipe?.strMeal} was removed from saved recipes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <button
                onClick={handleUndoUnsave}
                className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Undo size={12} className="md:w-3 md:h-3" />
                <span className="hidden xs:inline">Undo</span>
              </button>
              <button
                onClick={() => setShowUndo(null)}
                className="p-1 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <XIcon className="text-gray-500 w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section - Responsive */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-8">
          {/* Minimalist Mobile Layout */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Compact Mobile Header */}
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center space-x-3 md:space-x-4">
                {/* Compact Icon */}
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2.5 md:p-3 rounded-lg md:rounded-2xl shadow-sm">
                  <Bookmark
                    className="text-white w-5 h-5 md:w-7 md:h-7"
                    fill="currentColor"
                  />
                </div>

                {/* Compact Text */}
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                    Saved Recipes
                  </h1>
                  <p className="text-gray-600 text-xs md:text-base mt-0.5">
                    Your collection
                  </p>
                </div>
              </div>
              <span className="md:hidden font-bold text-cyan-600">
                {recipes.length}
              </span>
            </div>

            {/* Desktop Stats */}
            <div className="hidden sm:block bg-blue-50 rounded-xl px-4 py-3 border border-blue-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {recipes.length}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Saved Recipes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section - Responsive */}
      {recipes.length > 0 && (
        <section className="bg-white md:sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-2 md:py-4">
            <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-center justify-between">
              {/* Search - Full width on mobile */}
              <div className="relative w-full lg:flex-1 lg:max-w-lg">
                <Search
                  className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search your saved recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
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
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm md:text-base w-32 md:w-auto"
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
                        ? "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid size={16} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List size={16} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content - Responsive */}
      <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
        {recipes.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Bookmark className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              No Saved Recipes Yet
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-base px-4">
              Start exploring recipes and save your favorites to access them
              anytime.
            </p>
            <button
              onClick={() => navigate("/all-recipes")}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md text-sm md:text-base"
            >
              Discover Recipes
            </button>
          </div>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <Search className="text-gray-400 w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              No Recipes Found
            </h3>
            <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base px-4">
              No saved recipes match your search criteria. Try different
              keywords.
            </p>
            <button
              onClick={clearSearch}
              className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 text-sm md:text-base"
            >
              Clear Search
            </button>
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
              const isUnsaving = unsavingRecipe === recipe.strMeal;

              return (
                <div
                  key={recipe.idMeal}
                  className={`bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "flex flex-col h-full"
                      : "flex flex-col lg:flex-row"
                  } ${
                    isUnsaving ? "opacity-50 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {/* Recipe Image - Responsive */}
                  <div
                    className={`relative overflow-hidden bg-gray-200 ${
                      viewMode === "grid"
                        ? "h-40 sm:h-48 flex-shrink-0"
                        : "lg:w-64 xl:w-80 h-full flex-shrink-0"
                    }`}
                  >
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-br from-blue-500 to-cyan-600 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold shadow-sm">
                      {recipe.strArea}
                    </div>
                    <button
                      onClick={(e) => handleQuickUnsave(recipe.strMeal, e)}
                      disabled={isUnsaving}
                      className={`absolute top-3 right-3 p-2 rounded-lg md:rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                        isUnsaving
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-white/90 hover:bg-white text-blue-600 hover:scale-110"
                      }`}
                      title="Remove from saved recipes"
                    >
                      {isUnsaving ? (
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-white"></div>
                      ) : (
                        <Bookmark
                          size={14}
                          className="md:w-4 md:h-4"
                          fill="currentColor"
                        />
                      )}
                    </button>
                  </div>

                  {/* Recipe Content - Responsive */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col">
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
                    <div className="mb-4 md:mb-6 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                      <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm text-gray-600">
                        <Clock size={14} className="text-blue-600 md:w-4" />
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
                            className="bg-blue-50 text-blue-700 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm border border-blue-200 font-medium"
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
                        className="flex-1 bg-gradient-to-br from-blue-500 to-cyan-600 text-white py-2.5 md:py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md text-sm md:text-base"
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

export default SavedRecipesPage;
