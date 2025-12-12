export function DragInput({ label, ...props }) {
  return (
    <div className="flex flex-col mb-4">
      <label className="mb-1 font-semibold text-gray-600">{label}</label>
      <input
        className="border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}
