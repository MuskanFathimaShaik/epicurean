import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Utensils,
  BookOpen,
  Menu,
  X,
  Heart,
  Bookmark,
  Share2,
} from "lucide-react";
import Toast from "../components/Toast";
import RecipeNavigationBar from "../components/RecipeNavigationBar";
import HeroSection from "../components/HeroSection";
import QuickStats from "../components/QuickStats";
import IngredientsList from "../components/IngredientsList";
import InstructionsList from "../components/InstructionsList";
import VideoSection from "../components/VideoSection";
import RecipeInfoSidebar from "../components/RecipeInfoSidebar";
import TagsSection from "../components/TagsSection";
import RecipeActionButtons from "../components/RecipeActionButtons";
import "../App.css";

const RecipeDetailsPage = () => {
  const { recipeName } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cookingTime, setCookingTime] = useState(null);
  const [rating, setRating] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`
        );
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          const recipeData = data.meals[0];
          setRecipe(recipeData);

          // Generate stable cooking time and rating based on recipe name
          const stableCookingTime = generateStableCookingTime(
            recipeData.strMeal
          );
          const stableRating = generateStableRating(recipeData.strMeal);

          setCookingTime(stableCookingTime);
          setRating(stableRating);
          checkIfLikedOrSaved(recipeData.strMeal);
        } else {
          setError("Recipe not found.");
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setError("Failed to load recipe details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (recipeName) {
      fetchRecipeDetails();
    }
  }, [recipeName]);

  // Generate stable cooking time based on recipe name hash
  const generateStableCookingTime = (name) => {
    const times = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash = hash & hash;
    }
    return times[Math.abs(hash) % times.length];
  };

  // Generate stable rating based on recipe name hash
  const generateStableRating = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash = hash & hash;
    }
    return (3.5 + (Math.abs(hash) % 15) / 10).toFixed(1);
  };

  // Show toast notification
  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Check if recipe is liked or saved
  const checkIfLikedOrSaved = (recipeName) => {
    try {
      const likedRecipes = JSON.parse(
        localStorage.getItem("likedRecipes") || "[]"
      );
      const savedRecipes = JSON.parse(
        localStorage.getItem("savedRecipes") || "[]"
      );

      setIsFavorite(likedRecipes.includes(recipeName));
      setIsSaved(savedRecipes.includes(recipeName));
    } catch (error) {
      console.error("Error checking liked/saved status:", error);
    }
  };

  // Professional like/unlike functionality
  const handleLike = async () => {
    if (!recipe) return;

    try {
      const likedRecipes = JSON.parse(
        localStorage.getItem("likedRecipes") || "[]"
      );
      const wasFavorite = isFavorite;

      if (wasFavorite) {
        // Unlike
        const updatedLiked = likedRecipes.filter(
          (name) => name !== recipe.strMeal
        );
        localStorage.setItem("likedRecipes", JSON.stringify(updatedLiked));
        setIsFavorite(false);
        showToastMessage("Recipe removed from favorites", "info");
      } else {
        // Like
        likedRecipes.push(recipe.strMeal);
        localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
        setIsFavorite(true);
        showToastMessage("Recipe added to favorites!", "success");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      showToastMessage("Failed to update favorites", "error");
    }
  };

  // Professional save/unsave functionality
  const handleSave = async () => {
    if (!recipe) return;

    try {
      const savedRecipes = JSON.parse(
        localStorage.getItem("savedRecipes") || "[]"
      );
      const wasSaved = isSaved;

      if (wasSaved) {
        // Unsave
        const updatedSaved = savedRecipes.filter(
          (name) => name !== recipe.strMeal
        );
        localStorage.setItem("savedRecipes", JSON.stringify(updatedSaved));
        setIsSaved(false);
        showToastMessage("Recipe removed from saved recipes", "info");
      } else {
        // Save
        savedRecipes.push(recipe.strMeal);
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        setIsSaved(true);
        showToastMessage("Recipe saved successfully!", "success");
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      showToastMessage("Failed to save recipe", "error");
    }
  };

  // Share functionality
  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      const shareText = `Check out this delicious recipe: ${recipe.strMeal}`;

      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: recipe.strMeal,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopiedUrl(true);
        showToastMessage("Recipe link copied to clipboard!", "success");
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        // Fallback to clipboard if Web Share fails
        const shareUrl = window.location.href;
        const shareText = `Check out this delicious recipe: ${recipe.strMeal}\n${shareUrl}`;
        await navigator.clipboard.writeText(shareText);
        setCopiedUrl(true);
        showToastMessage("Recipe link copied to clipboard!", "success");
        setTimeout(() => setCopiedUrl(false), 2000);
      }
    }
  };

  // Alternative Print functionality using iframe
  const handlePrint = () => {
    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${recipe.strMeal} - Recipe</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { color: #2d3748; margin-bottom: 10px; }
        .meta { display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
        .meta-item { text-align: center; }
        .section { margin: 30px 0; }
        h2 { color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        .ingredients { list-style: none; padding: 0; }
        .ingredient { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px; background: #f7fafc; border-radius: 4px; }
        .instructions { list-style: decimal; padding-left: 20px; }
        .instruction { margin: 15px 0; }
        @media print {
          body { font-size: 12pt; }
          .no-print { display: none; }
          @page { margin: 1cm; }
        }
        @media (max-width: 768px) {
          body { padding: 10px; }
          .meta { flex-direction: column; gap: 10px; }
          .ingredient { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${recipe.strMeal}</h1>
        <div class="meta">
          <div class="meta-item"><strong>Cuisine:</strong> ${
            recipe.strArea
          }</div>
          <div class="meta-item"><strong>Category:</strong> ${
            recipe.strCategory
          }</div>
          <div class="meta-item"><strong>Prep Time:</strong> ${cookingTime} min</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Ingredients</h2>
        <div class="ingredients">
          ${getIngredients()
            .map(
              (item, index) => `
            <div class="ingredient">
              <span>${item.ingredient}</span>
              <span>${item.measure}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <div class="section">
        <h2>Instructions</h2>
        <ol class="instructions">
          ${formatInstructions()
            .map(
              (step) => `
            <li class="instruction">${step}</li>
          `
            )
            .join("")}
        </ol>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 40px; font-style: italic;">
        Printed from Epicurean - ${new Date().toLocaleDateString()}
      </div>
    </body>
    </html>
  `;

    // Create iframe for printing
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(printContent);
      iframeDoc.close();

      // Wait for iframe to load then print
      iframe.onload = function () {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
    }

    showToastMessage("Print dialog opened. You can continue browsing.", "info");
  };

  const getIngredients = () => {
    if (!recipe) return [];
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

  const formatInstructions = () => {
    if (!recipe?.strInstructions) return [];
    return recipe.strInstructions.split("\r\n").filter((step) => step.trim());
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return match ? match[1] : null;
  };

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-light">
            Preparing your recipe insights...
          </p>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Your culinary masterpiece is just moments away
          </p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col" style={{ height: "calc(100vh - 85px)" }}>
        {" "}
        {/* Adjust 64px to your header height */}
        <div className="flex-1 flex items-center justify-center px-4 bg-gray-50">
          <div className="text-center py-12 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 px-6 md:px-8 max-w-md w-full mx-auto">
            <div className="text-6xl md:text-8xl mb-6">🍽️</div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Recipe Not Found
            </h3>
            <p className="text-gray-600 mb-8 text-base md:text-lg">
              {error || "The recipe you're looking for doesn't exist."}
            </p>
            <button
              onClick={() => navigate(`/all-recipes`)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm w-full md:w-auto"
            >
              Go Back to Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();
  const instructions = formatInstructions();
  const youtubeVideoId = getYouTubeVideoId(recipe.strYoutube);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={handleCloseToast}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Navigation Bar */}
      <RecipeNavigationBar
        onBack={() => navigate(-1)}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onPrint={handlePrint}
        isFavorite={isFavorite}
        isSaved={isSaved}
        copiedUrl={copiedUrl}
        onMobileMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Hero Section with Full-width Image */}
      <HeroSection
        recipe={recipe}
        imageLoaded={imageLoaded}
        setImageLoaded={setImageLoaded}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 md:py-8 mb-24 md:mb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Column - Recipe Details */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {/* Quick Stats */}
            <QuickStats
              cookingTime={cookingTime}
              ingredientCount={ingredients.length}
              rating={rating}
            />

            {/* Mobile Action Buttons */}
            {/* <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <RecipeActionButtons
                recipe={recipe}
                onSave={handleSave}
                isSaved={isSaved}
                isSavedIcon={true}
                isMobile={true}
              />
            </div> */}

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-auto md:h-[600px] lg:h-[800px] flex flex-col">
              <div className="border-b border-gray-100 flex-shrink-0">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("ingredients")}
                    className={`flex-1 py-4 md:py-5 px-4 md:px-6 text-base md:text-lg font-semibold transition-all duration-300 border-b-2 ${
                      activeTab === "ingredients"
                        ? "border-green-500 text-green-600 bg-gradient-to-r from-green-50 to-transparent"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 md:space-x-3">
                      <Utensils size={18} className="md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Ingredients</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("instructions")}
                    className={`flex-1 py-4 md:py-5 px-4 md:px-6 text-base md:text-lg font-semibold transition-all duration-300 border-b-2 ${
                      activeTab === "instructions"
                        ? "border-green-500 text-green-600 bg-gradient-to-r from-green-50 to-transparent"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2 md:space-x-3">
                      <BookOpen size={18} className="md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Instructions</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content with Scrollable Area */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-6">
                  {activeTab === "ingredients" && (
                    <IngredientsList ingredients={ingredients} />
                  )}

                  {activeTab === "instructions" && (
                    <InstructionsList instructions={instructions} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div
            className={`lg:col-span-4 space-y-4 md:space-y-6 ${
              isMobileMenuOpen
                ? "fixed inset-y-0 right-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl p-6 transform translate-x-0 transition-transform duration-300 ease-in-out"
                : ""
            }`}
          >
            {/* Close button for mobile sidebar */}
            {/* {isMobileMenuOpen && (
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recipe Details
                </h3>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            )} */}

            {/* Video Tutorial */}
            <VideoSection youtubeVideoId={youtubeVideoId} />

            {/* Recipe Information */}
            <RecipeInfoSidebar recipe={recipe} />

            {/* Action Buttons - Hidden on mobile since we show them above */}
            <RecipeActionButtons
              recipe={recipe}
              onSave={handleSave}
              isSaved={isSaved}
              isSavedIcon={true}
            />

            {/* Tags */}
            <TagsSection tags={recipe.strTags} />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
        <div className="flex justify-between items-center">
          {/* <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-green-600 transition-colors"
          >
            <Menu size={20} />
            <span className="text-xs font-medium">Details</span>
          </button> */}
          <button
            onClick={handleLike}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isFavorite ? "text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart fill={isFavorite ? "currentColor" : "none"} />

            <span className="text-xs font-medium">Favorite</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex flex-col items-center space-y-1 transition-colors ${
              isSaved ? "text-green-600" : "text-gray-600 hover:text-green-600"
            }`}
          >
            <Bookmark fill={isSaved ? "currentColor" : "none"} />
            <span className="text-xs font-medium">Save</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Share2 />
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
