const InstructionsList = ({ instructions }) => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Cooking Instructions
      </h2>
      {instructions.map((step, index) => (
        <div
          key={index}
          className="flex items-start space-x-4 sm:space-x-6 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-100 hover:border-green-500/30 hover:bg-gradient-to-r hover:from-green-500/5 hover:to-transparent transition-all duration-300 group"
        >
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500/20 to-green-500/10 text-green-500 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0 group-hover:from-green-500/30 group-hover:to-green-500/20 transition-all duration-300 mt-0.5">
            {index + 1}
          </div>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-lg pt-0.5 sm:pt-1 flex-1">
            {step}
          </p>
        </div>
      ))}

      {/* Mobile Progress Indicator */}
      <div className="sm:hidden bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="font-medium text-sm">
              Step {instructions.length} of {instructions.length}
            </span>
          </div>
          <span className="text-green-100 text-xs">Complete!</span>
        </div>
      </div>
    </div>
  );
};

export default InstructionsList;
