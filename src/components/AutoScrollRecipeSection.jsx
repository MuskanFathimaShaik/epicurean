import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ArrowRight,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RecipeCard from "./RecipeCard";

const AutoScrollRecipeSection = ({
  recipes,
  title,
  description,
  icon: Icon,
  onViewAll,
}) => {
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollSpeedRef = useRef(0.8);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentRecipeSet, setCurrentRecipeSet] = useState([]);

  // Memoized recipe formatting to prevent regeneration
  const formatRecipeForCard = useCallback((apiRecipe, index) => {
    // Use stable values based on recipe ID to prevent regeneration
    const stableRating =
      (((apiRecipe.idMeal.charCodeAt(0) * apiRecipe.idMeal.charCodeAt(1)) %
        200) +
        300) /
      100; // 3.0-5.0
    const stableCookTime = ((apiRecipe.idMeal.charCodeAt(2) * 13) % 30) + 15; // 15-45 mins
    const difficulties = ["Easy", "Medium", "Hard"];
    const stableDifficulty = difficulties[apiRecipe.idMeal.charCodeAt(3) % 3];

    return {
      id: apiRecipe.idMeal,
      title: apiRecipe.strMeal,
      category: apiRecipe.strCategory,
      cuisine: apiRecipe.strArea,
      image: apiRecipe.strMealThumb,
      rating: stableRating.toFixed(1),
      cookTime: `${stableCookTime} mins`,
      difficulty: stableDifficulty,
      tags: apiRecipe.strTags ? apiRecipe.strTags.split(",") : [],
    };
  }, []);

  // Initialize stable recipe data
  useEffect(() => {
    if (recipes && recipes.length > 0) {
      const formattedRecipes = recipes.map((recipe, index) =>
        formatRecipeForCard(recipe, index)
      );
      setCurrentRecipeSet(formattedRecipes);
    }
  }, [recipes, formatRecipeForCard]);

  // Enhanced smooth scrolling with proper infinite loop
  const startScrolling = useCallback(() => {
    if (!scrollContainerRef.current || currentRecipeSet.length === 0) return;

    let lastTimestamp = performance.now();
    let accumulatedScroll = 0;

    const smoothScroll = (timestamp) => {
      if (isPaused) {
        animationFrameRef.current = requestAnimationFrame(smoothScroll);
        return;
      }

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      const scrollContainer = scrollContainerRef.current;
      const scrollAmount = scrollSpeedRef.current * (deltaTime / 16);
      accumulatedScroll += scrollAmount;

      scrollContainer.scrollLeft += scrollAmount;

      // Calculate when to reset for seamless infinite scroll
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      const bufferZone = singleSetWidth * 0.1;

      if (scrollContainer.scrollLeft >= singleSetWidth - bufferZone) {
        scrollContainer.scrollLeft = accumulatedScroll % singleSetWidth;
      }

      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    };

    animationFrameRef.current = requestAnimationFrame(smoothScroll);
  }, [currentRecipeSet.length, isPaused]);

  // Initialize and cleanup scrolling
  useEffect(() => {
    startScrolling();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startScrolling]);

  // Enhanced event handlers with better state management
  const handleUserInteractionStart = useCallback(() => {
    setIsPaused(true);
    setShowControls(true);
  }, []);

  const handleUserInteractionEnd = useCallback(() => {
    // Small delay before resuming to allow user to read
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let hideTimeout;

    if (showControls) {
      hideTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showControls]);

  // Add intersection observer to pause when not visible
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setIsPaused(true);
          } else {
            setIsPaused(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(scrollContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Navigation functions
  const navigateRecipes = useCallback(
    (direction) => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer || currentRecipeSet.length === 0) return;

      const cardWidth = 320; // Approximate card width including margin
      const scrollAmount = cardWidth * (direction === "next" ? 1 : -1);

      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Show controls and pause briefly during navigation
      setShowControls(true);
      setIsPaused(true);

      // Resume after navigation
      setTimeout(() => {
        setIsPaused(false);
      }, 1000);
    },
    [currentRecipeSet.length]
  );

  const togglePause = () => {
    setIsPaused(!isPaused);
    setShowControls(true);
  };

  // Don't render if no recipes
  if (!currentRecipeSet || currentRecipeSet.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 sm:mb-20 lg:mb-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 gap-4 sm:gap-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div
            className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${
              title === "Most Popular Recipes"
                ? "bg-green-100"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <Icon className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Scroll Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={togglePause}
              onMouseEnter={() => setShowControls(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
              aria-label={isPaused ? "Play scrolling" : "Pause scrolling"}
            >
              {isPaused ? (
                <Play size={16} className="text-green-700" />
              ) : (
                <Pause size={16} className="text-green-700" />
              )}
            </button>
          </div>

          <button
            onClick={onViewAll}
            className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Enhanced Auto-scrolling Recipes Container */}
      <div
        className="relative group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 1000)}
      >
        {/* Navigation Arrows */}
        <button
          onClick={() => navigateRecipes("prev")}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            showControls ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } group-hover:opacity-100 group-hover:scale-100`}
          aria-label="Previous recipes"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        <button
          onClick={() => navigateRecipes("next")}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            showControls ? "opacity-100 scale-100" : "opacity-0 scale-90"
          } group-hover:opacity-100 group-hover:scale-100`}
          aria-label="Next recipes"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden pb-4 scrollbar-hide select-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            cursor: "grab",
          }}
          onMouseEnter={handleUserInteractionStart}
          onMouseLeave={handleUserInteractionEnd}
          onTouchStart={handleUserInteractionStart}
          onTouchEnd={handleUserInteractionEnd}
          onFocus={handleUserInteractionStart}
          onBlur={handleUserInteractionEnd}
        >
          <div className="flex space-x-4 md:space-x-6 min-w-max">
            {/* Triple the content for smoother infinite scroll */}
            {[...Array(3)].map((_, setIndex) => (
              <React.Fragment key={`set-${setIndex}`}>
                {currentRecipeSet.map((recipe) => (
                  <div
                    key={`${setIndex}-${recipe.id}`}
                    className="w-64 sm:w-72 lg:w-80 flex-shrink-0"
                  >
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View All Button */}
      <button
        onClick={onViewAll}
        className="flex sm:hidden items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition-colors justify-center border border-green-200 rounded-lg py-2 px-4 bg-green-50 mt-4 mx-auto"
      >
        <span>View All Recipes</span>
        <ArrowRight size={16} />
      </button>
    </section>
  );
};

export default AutoScrollRecipeSection;
