import { Check, Info, Ban, X, Loader2 } from "lucide-react";
import { useEffect, useCallback } from "react";

const Toast = ({
  show,
  message,
  type = "info",
  onClose,
  duration = 5000,
  position = "bottom-right",
  title,
  action,
  onAction,
  persistent = false,
  progress = true,
}) => {
  useEffect(() => {
    if (show && !persistent) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration, persistent]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleAction = useCallback(() => {
    onAction?.();
  }, [onAction]);

  if (!show) return null;

  const iconMap = {
    error: <Ban className="w-4 h-4 sm:w-5 sm:h-5" />,
    info: <Info className="w-4 h-4 sm:w-5 sm:h-5" />,
    success: <Check className="w-4 h-4 sm:w-5 sm:h-5" />,
    loading: <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />,
  };

  const bgMap = {
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
    success: "bg-emerald-50 border-emerald-200",
    loading: "bg-gray-50 border-gray-200",
  };

  const iconColorMap = {
    error: "text-red-600",
    info: "text-blue-600",
    success: "text-emerald-600",
    loading: "text-gray-600",
  };

  const textColorMap = {
    error: "text-red-800",
    info: "text-blue-700",
    success: "text-emerald-800",
    loading: "text-gray-800",
  };

  const progressColorMap = {
    error: "bg-red-500",
    info: "bg-blue-500",
    success: "bg-emerald-500",
    loading: "bg-gray-500",
  };

  // Responsive position mapping
  const positionMap = {
    "top-left": "top-2 left-2 sm:top-4 sm:left-4",
    "top-right": "top-2 right-2 sm:top-4 sm:right-4",
    "top-center": "top-2 left-1/2 transform -translate-x-1/2 sm:top-4",
    "bottom-left": "bottom-2 left-2 sm:bottom-4 sm:left-4",
    "bottom-right": "bottom-2 right-2 sm:bottom-4 sm:right-4",
    "bottom-center": "bottom-2 left-1/2 transform -translate-x-1/2 sm:bottom-4",
  };

  // Mobile-safe positions - adjust for mobile browsers with bottom bars
  const mobileSafePositionMap = {
    "top-left": "top-2 left-2",
    "top-right": "top-2 right-2",
    "top-center": "top-2 left-1/2 transform -translate-x-1/2",
    "bottom-left": "bottom-16 left-2 sm:bottom-4", // Account for mobile browser UI
    "bottom-right": "bottom-16 right-2 sm:bottom-4",
    "bottom-center":
      "bottom-16 left-1/2 transform -translate-x-1/2 sm:bottom-4",
  };

  const getTypeTitle = () => {
    if (title) return title;
    const titles = {
      error: "Error",
      info: "Info",
      success: "Success",
      loading: "Processing",
    };
    return titles[type];
  };

  return (
    <div
      className={`fixed z-50 ${
        mobileSafePositionMap[position] || positionMap[position]
      } animate-in slide-in-from-right-full duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      } mx-2 sm:mx-0`}
    >
      <div
        className={`${bgMap[type]} flex flex-col rounded-lg sm:rounded-xl border shadow-lg backdrop-blur-sm w-[calc(100vw-2rem)] sm:min-w-[320px] sm:max-w-sm max-w-none overflow-hidden transition-all duration-300 hover:shadow-xl`}
      >
        {/* Progress Bar */}
        {progress && !persistent && (
          <div className="w-full h-0.5 sm:h-1 bg-gray-200">
            <div
              className={`h-full ${progressColorMap[type]} transition-all duration-100 ease-linear`}
              style={{
                animation: `shrink ${duration}ms linear forwards`,
                animationPlayState: show ? "running" : "paused",
              }}
            />
          </div>
        )}

        <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4">
          {/* Icon */}
          <div className={`flex-shrink-0 mt-0.5 ${iconColorMap[type]}`}>
            {iconMap[type]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold text-xs sm:text-sm mb-1 ${textColorMap[type]}`}
            >
              {getTypeTitle()}
            </p>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${textColorMap[type]} break-words`}
            >
              {message}
            </p>

            {/* Action Button */}
            {action && onAction && (
              <button
                onClick={handleAction}
                className={`mt-2 px-2 sm:px-3 py-1 text-xs font-medium rounded-md border ${iconColorMap[type]} border-current hover:bg-current hover:text-white transition-colors duration-200 active:scale-95`}
              >
                {action}
              </button>
            )}
          </div>

          {/* Close Button */}
          {!persistent && (
            <button
              onClick={handleClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-lg p-1 hover:bg-gray-200 active:scale-95"
              aria-label="Close toast"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .toast-container {
            margin: 0 0.5rem;
          }
        }

        /* Safe area insets for modern mobile browsers */
        @supports (padding: max(0px)) {
          .mobile-safe-bottom {
            bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
