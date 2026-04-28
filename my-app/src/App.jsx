import { useState, useEffect } from "react";
import { submitRequest, getRequests } from "./api";

const PRIORITY_COLORS = {
  high: "bg-red-100 text-red-700 border-red-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  low: "bg-green-100 text-green-700 border-green-300",
};

const TYPE_ICONS = {
  food: "�food",
  medical: "🏥",
  rescue: "🚨",
  utilities: "⚡",
  other: "📋",
};

export default function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  // Load existing requests on mount
  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const data = await getRequests();
      setRequests(data.requests || []);
    } catch (e) {
      console.error("Could not load requests", e);
    }
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await submitRequest(text);
      setResult(data);
      setText("");
      fetchAll(); // refresh the list
    } catch (e) {
      setError("Failed to submit request. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">🆘 Emergency Request System</h1>
          <p className="text-gray-500 mt-1">AI-powered request classification & volunteer assignment</p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
            placeholder="Describe your emergency... e.g. 'We need food for 50 people urgently'"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Processing..." : "Submit Request"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
            <h2 className="font-bold text-gray-700 mb-3">✅ Request Processed</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Type</span>
                <p className="font-semibold capitalize">{TYPE_ICONS[result.request_type]} {result.request_type}</p>
              </div>
              <div>
                <span className="text-gray-400">People</span>
                <p className="font-semibold">{result.people ?? "Not specified"}</p>
              </div>
              <div>
                <span className="text-gray-400">Priority</span>
                <span className={`inline-block px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${PRIORITY_COLORS[result.priority]}`}>
                  {result.priority}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Assigned To</span>
                <p className="font-semibold">{result.assigned_volunteer}</p>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        {requests.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-bold text-gray-700 mb-4">📋 All Requests ({requests.length})</h2>
            <div className="space-y-3">
              {[...requests].reverse().map((req, i) => (
                <div key={i} className="border rounded-lg p-3 text-sm flex justify-between items-center">
                  <div>
                    <span className="font-semibold capitalize">{req.request_type}</span>
                    <span className="text-gray-400 ml-2">{req.original_text.slice(0, 50)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold capitalize ${PRIORITY_COLORS[req.priority]}`}>
                      {req.priority}
                    </span>
                    <span className="text-gray-400 text-xs">{req.assigned_volunteer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}