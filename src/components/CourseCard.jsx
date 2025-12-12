export function CourseCard({ title, desc, progress=0, status="Not Started" }) {
  const getStatusColor = () => {
    if (status === 'Completed') return 'bg-green-100 text-green-700';
    if (status === 'In Progress') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };
  
  const getProgressColor = () => {
    if (progress === 100) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (progress > 0) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    return 'bg-gray-300';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:border-blue-200 group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor()} ml-2 whitespace-nowrap`}>
          {status}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600">Progress</span>
          <span className="text-xs font-bold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor()}`} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
