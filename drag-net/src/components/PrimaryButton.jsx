export function PrimaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 w-full rounded-xl font-semibold shadow-md"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="border border-blue-600 text-blue-600 py-3 px-4 w-full rounded-xl font-semibold hover:bg-blue-100"
    >
      {children}
    </button>
  );
}
