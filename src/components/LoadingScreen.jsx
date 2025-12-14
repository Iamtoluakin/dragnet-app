const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading DragNet...</h2>
        <p className="text-gray-400">Preparing your compliance training experience</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
