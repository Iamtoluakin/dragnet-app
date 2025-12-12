import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)}
      className="text-blue-700 underline mt-4 mb-4"
    >
      ⬅ Go Back
    </button>
  );
}
