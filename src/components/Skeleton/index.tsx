function SkeletonRow() {
    return (
      <div className="flex items-center px-4 py-3 animate-pulse">
        <div className="w-8 h-8 rounded bg-gray-200 mr-3" />
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    );
  }

  export default SkeletonRow