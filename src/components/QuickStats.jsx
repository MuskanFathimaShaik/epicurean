import { Clock, Utensils, Star, Flame } from "lucide-react";
import { useEffect, useRef } from "react";

const QuickStats = ({ cookingTime, ingredientCount, rating }) => {
  const scrollContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollSpeedRef = useRef(0.5); // pixels per frame - adjust for speed

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isScrolling = true;
    let lastTimestamp = 0;

    const smoothScroll = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (isScrolling) {
        // Continuous smooth scrolling
        scrollContainer.scrollLeft += scrollSpeedRef.current * (deltaTime / 16); // Normalize to 60fps

        // Reset to start when reaching the end (using the duplicate set)
        const maxScroll = scrollContainer.scrollWidth / 2; // Since we duplicated the content
        if (scrollContainer.scrollLeft >= maxScroll) {
          scrollContainer.scrollLeft = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(smoothScroll);
    };

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(smoothScroll);

    // Pause on hover for better UX
    const handleMouseEnter = () => {
      isScrolling = false;
    };

    const handleMouseLeave = () => {
      isScrolling = true;
      lastTimestamp = 0; // Reset timestamp for smooth restart
    };

    const handleTouchStart = () => {
      isScrolling = false;
    };

    const handleTouchEnd = () => {
      // Restart scrolling after a brief delay
      setTimeout(() => {
        isScrolling = true;
        lastTimestamp = 0;
      }, 2000);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("touchstart", handleTouchStart);
    scrollContainer.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Desktop Grid Layout */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {renderStatsCards(true)}
      </div>

      {/* Mobile Horizontal Auto-scroll Layout */}
      <div className="sm:hidden relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden pb-4 scrollbar-hide"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
          }}
        >
          <div className="flex space-x-3 animate-scroll-continuous">
            {renderStatsCards(false)}
            {/* Duplicate for seamless looping */}
            {renderStatsCards(false)}
          </div>
        </div>

        {/* Gradient overlays for better visual effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </>
  );

  function renderStatsCards(isDesktop) {
    const stats = [
      {
        icon: Clock,
        value: `${cookingTime}'`,
        label: "Prep Time",
        key: "time",
      },
      {
        icon: Utensils,
        value: ingredientCount,
        label: "Ingredients",
        key: "ingredients",
      },
      {
        icon: Star,
        value: rating,
        label: "Rating",
        key: "rating",
        fill: true,
      },
      {
        icon: Flame,
        value: "Easy",
        label: "Difficulty",
        key: "difficulty",
      },
    ];

    return stats.map((stat, index) => (
      <div
        key={`${stat.key}-${index}`}
        className={`
          bg-white border border-gray-100 text-center shadow-sm transition-all duration-300 
          ${
            isDesktop
              ? "rounded-xl p-5 hover:-translate-y-0.5 flex-1"
              : "rounded-lg p-4 min-w-[120px] flex-shrink-0"
          }
          group
        `}
      >
        <div
          className={`
          bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto 
          transition-transform duration-300
          ${
            isDesktop
              ? "w-12 h-12 mb-3 group-hover:scale-110"
              : "w-10 h-10 mb-2"
          }
        `}
        >
          <stat.icon
            className="text-white"
            size={isDesktop ? 20 : 16}
            fill={stat.fill ? "currentColor" : "none"}
          />
        </div>
        <div
          className={`
          font-bold text-gray-900
          ${isDesktop ? "text-2xl" : "text-lg"}
        `}
        >
          {stat.value}
        </div>
        <div
          className={`
          text-gray-600 font-medium
          ${isDesktop ? "text-sm" : "text-xs"}
        `}
        >
          {stat.label}
        </div>
      </div>
    ));
  }
};

export default QuickStats;
