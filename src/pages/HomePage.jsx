import { useState, useEffect, useRef } from "react";
import { Flame, TrendingUp, Star, ArrowRight } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useNavigate } from "react-router-dom";

// Animated Counter Component
const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    // Intersection Observer to trigger animation when element comes into view
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startCounting();
          observerRef.current?.unobserve(element);
        }
      },
      { threshold: 0.3 } // Lower threshold for earlier trigger
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.unobserve(element);
    };
  }, []);

  const startCounting = () => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return Math.round(num / 1000000) + "M";
    } else if (num >= 1000) {
      return Math.round(num / 1000) + "K";
    }
    return Math.round(num);
  };

  return (
    <div
      ref={countRef}
      className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-500"
    >
      {formatNumber(count)}
      {suffix}
    </div>
  );
};

const HomePage = () => {
  const [recipes, setRecipes] = useState({
    popular: [],
    trending: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch a single recipe from API
  const fetchSingleRecipe = async () => {
    try {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return null;
    }
  };

  // Fetch recipes on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);

      const popularRecipes = [];
      const trendingRecipes = [];
      const allFetchedRecipes = new Set();

      // Fetch 8 unique recipes total (4 for popular, 4 for trending)
      while (popularRecipes.length < 4 || trendingRecipes.length < 4) {
        const recipe = await fetchSingleRecipe();

        if (recipe && !allFetchedRecipes.has(recipe.idMeal)) {
          allFetchedRecipes.add(recipe.idMeal);

          if (popularRecipes.length < 4) {
            popularRecipes.push(recipe);
          } else if (trendingRecipes.length < 4) {
            trendingRecipes.push(recipe);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setRecipes({
        popular: popularRecipes,
        trending: trendingRecipes,
      });
      setLoading(false);
    };

    fetchRecipes();
  }, []);

  // Format recipe data for RecipeCard component
  const formatRecipeForCard = (apiRecipe) => {
    return {
      id: apiRecipe.idMeal,
      title: apiRecipe.strMeal,
      category: apiRecipe.strCategory,
      cuisine: apiRecipe.strArea,
      image: apiRecipe.strMealThumb,
      rating: (Math.random() * 2 + 3).toFixed(1),
      cookTime: `${Math.floor(Math.random() * 30) + 15} mins`,
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      tags: apiRecipe.strTags ? apiRecipe.strTags.split(",") : [],
    };
  };

  // Hero background image (you can replace with your own high-quality image)
  const heroBackground = "/Images/home-hero.jpeg";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section with Background Image */}
      <section
        className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] xl:h-[550px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            Discover Amazing Recipes
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-4xl mx-auto font-light px-2 sm:px-0">
            Explore thousands of recipes from around the world. Cook like a
            professional chef in your own kitchen!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <button
              onClick={() => navigate("/categories")}
              className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Browse Categories
              <ArrowRight size={18} className="flex-shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Counting Animation */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 ">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div className="space-y-2 sm:space-y-3 transform hover:scale-105 transition-transform duration-300 p-2 sm:p-0">
              <AnimatedCounter end={10000} suffix="+" duration={3000} />
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Recipes
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 transform hover:scale-105 transition-transform duration-300 p-2 sm:p-0">
              <AnimatedCounter end={50} suffix="+" duration={2500} />
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Cuisines
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 transform hover:scale-105 transition-transform duration-300 p-2 sm:p-0">
              <AnimatedCounter end={1000000} suffix="+" duration={3500} />
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Home Cooks
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3 transform hover:scale-105 transition-transform duration-300 p-2 sm:p-0">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <AnimatedCounter end={4.8} duration={2800} />
                <Star
                  className="fill-green-500 text-green-500 flex-shrink-0"
                  size={16}
                  sm:size={18}
                  lg:size={20}
                />
              </div>
              <div className="text-sm sm:text-base lg:text-lg text-gray-600 font-medium">
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {loading ? (
          // Enhanced Loading State
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-light">
              Loading delicious recipes...
            </p>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Discovering culinary treasures from around the world
            </p>
          </div>
        ) : (
          <>
            {/* Most Popular Recipes */}
            <section className="mb-16 sm:mb-20 lg:mb-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 gap-4 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-xl sm:rounded-2xl">
                    <Flame className="text-green-600" size={24} sm:size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      Most Popular Recipes
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      Tried and loved by our community
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/all-recipes")}
                  className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {recipes.popular.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={formatRecipeForCard(recipe)}
                  />
                ))}
                <button
                  onClick={() => navigate("/all-recipes")}
                  className="flex sm:hidden items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors justify-center border border-green-200 rounded-lg py-2 px-4 bg-green-50"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* Trending Recipes */}
            <section className="mb-16 sm:mb-20 lg:mb-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 gap-4 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2 sm:p-3 bg-green-50 rounded-xl sm:rounded-2xl border border-green-200">
                    <TrendingUp
                      className="text-green-600"
                      size={24}
                      sm:size={28}
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      Trending Now
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                      What's hot in the culinary world
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/all-recipes")}
                  className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {recipes.trending.map((recipe) => (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={formatRecipeForCard(recipe)}
                  />
                ))}
                <button
                  onClick={() => navigate("/all-recipes")}
                  className="flex sm:hidden items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors justify-center border border-green-200 rounded-lg py-2 px-4 bg-green-50"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          </>
        )}

        {/* Enhanced CTA Section */}
        <section className="mt-12 sm:mt-16 lg:mt-20 mb-16 sm:mb-20 lg:mb-24">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden mx-2 sm:mx-0">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 text-center text-white">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
                Ready to Start Your Culinary Journey?
              </h3>
              <p className="text-green-100 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                Join thousands of home cooks discovering new recipes every day.
                From quick weekday meals to gourmet weekend feasts, we've got
                you covered.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => navigate("/all-recipes")}
                  className="bg-white cursor-pointer text-green-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto"
                >
                  Browse All Recipes
                </button>
                <button
                  onClick={() => navigate("/categories")}
                  className="bg-transparent cursor-pointer border-2 border-white text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-200 w-full sm:w-auto"
                >
                  View Categories
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
