export function CourseCard({ title, desc, progress=0, status="Not Started" }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 max-w-md">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>
        <div className="text-sm font-medium text-gray-600 ml-4">{status}</div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="h-2 rounded-full bg-sky-600" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-gray-500 mt-2">Progress: {progress}%</div>
      </div>
    </div>
  );
}
