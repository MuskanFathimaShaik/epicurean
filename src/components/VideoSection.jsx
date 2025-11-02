import { PlayCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

const VideoSection = ({ youtubeVideoId }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!youtubeVideoId) return null;

  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Header Section - Responsive */}
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center space-x-2 md:space-x-3">
            <PlayCircle
              className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0"
              size={20}
            />
            <span>Video Tutorial</span>
          </h3>

          {/* External Link for larger screens */}
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 text-sm font-medium"
          >
            <span>Watch on YouTube</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Video Container - Responsive */}
      <div className="p-3 md:p-4 lg:p-6">
        <div className="relative rounded-lg md:rounded-xl overflow-hidden bg-gray-900 aspect-video">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 md:w-10 md:h-10 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-white text-sm md:text-base">
                  Loading video...
                </p>
              </div>
            </div>
          )}

          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
            title="Recipe Tutorial"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Description and Mobile Link - Responsive */}
        <div className="p-3 md:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-sm md:text-base text-gray-600 font-medium text-center sm:text-left flex-1">
              Watch step-by-step video instructions
            </p>

            {/* Mobile External Link */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors duration-200 text-sm font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200"
            >
              <span>Open in YouTube</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
