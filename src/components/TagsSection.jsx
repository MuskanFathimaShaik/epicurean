const TagsSection = ({ tags }) => {
  if (!tags) return null;

  const tagList = tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag);

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
      {/* Header - Responsive */}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">Tags</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md md:hidden">
          {tagList.length} tags
        </span>
      </div>

      {/* Tags Container */}
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {tagList.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-100 text-gray-700 px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-200 transition-colors duration-300 cursor-default"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Mobile hint for many tags */}
      {tagList.length > 8 && (
        <p className="text-xs text-gray-500 mt-2 text-center md:hidden">
          Scroll to see more tags →
        </p>
      )}
    </div>
  );
};

export default TagsSection;
