import React, { useState } from "react";

export default function CourseGenerator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const response = await fetch("/api/generateCourses", {
      method: "POST",
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AI Course Generator</h2>

      <button
        onClick={generate}
        className="bg-blue-700 text-white py-3 px-5 rounded-xl"
      >
        Generate Now
      </button>

      {loading && <p className="mt-4">Generating...</p>}
      {result && (
        <pre className="mt-4 p-4 bg-gray-200 rounded-xl">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
