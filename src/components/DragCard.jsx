export function DragCard({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl mb-4">
      <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
      {children}
    </div>
  );
}
