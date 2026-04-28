import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const TYPE_ICONS = {
  food: "🍽️",
  medical: "🏥",
  rescue: "🚨",
  utilities: "⚡",
  other: "📋",
};

const PRIORITY_STYLES = {
  high:   { background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" },
  medium: { background: "#fef3c7", color: "#d97706", border: "1px solid #fcd34d" },
  low:    { background: "#d1fae5", color: "#059669", border: "1px solid #6ee7b7" },
};

const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

export default function RequestForm() {
  const [text, setText]         = useState("");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [requests, setRequests] = useState([]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/submit-request`, { text });
      setResult(res.data);
      setRequests((prev) => [res.data, ...prev]);
      setText("");
    } catch {
      setError("Failed to connect. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const pStyle = result ? (PRIORITY_STYLES[result.priority] || PRIORITY_STYLES.low) : {};

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 16px",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: 0 }}>
        🆘 Emergency Request System
      </h1>
      <p style={{ fontSize: 14, color: "#9ca3af", marginTop: 6, marginBottom: 32 }}>
        AI-powered request classification & volunteer assignment
      </p>

      {/* INPUT CARD */}
      <div style={{
        width: "100%", maxWidth: 640,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        padding: 24,
      }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your emergency... e.g. 'We need food for 50 people urgently'"
          rows={3}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 14,
            color: "#111827",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        {error && (
          <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          style={{
            width: "100%",
            marginTop: 14,
            padding: "12px 0",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 10,
            border: "none",
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            background: loading || !text.trim() ? "#e5e7eb" : "#2563eb",
            color:      loading || !text.trim() ? "#9ca3af"  : "#ffffff",
          }}
        >
          {loading ? "⏳ Processing..." : "🚀 Submit Request"}
        </button>
      </div>

      {/* RESULT CARD */}
      {result && (
        <div style={{
          width: "100%", maxWidth: 640,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          borderLeft: "4px solid #3b82f6",
          padding: 24,
          marginTop: 20,
          boxSizing: "border-box",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>Request Processed</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Type</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
                {TYPE_ICONS[result.request_type]} {cap(result.request_type)}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>People</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
                {result.people ?? "Not specified"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 6px" }}>Priority</p>
              <span style={{ ...pStyle, padding: "3px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                {cap(result.priority)}
              </span>
            </div>
            <div>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 4px" }}>Assigned To</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>
                {result.assigned_volunteer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ALL REQUESTS */}
      {requests.length > 0 && (
        <div style={{
          width: "100%", maxWidth: 640,
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          padding: 24,
          marginTop: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>
            📋 All Requests ({requests.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {requests.map((req, i) => {
              const rp = PRIORITY_STYLES[req.priority] || PRIORITY_STYLES.low;
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #f3f4f6",
                  borderRadius: 10,
                  padding: "10px 14px",
                  background: "#fafafa",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                    <span style={{ fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>
                      {TYPE_ICONS[req.request_type]} {cap(req.request_type)}
                    </span>
                    <span style={{ fontSize: 13, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260 }}>
                      {req.original_text?.slice(0, 55)}...
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <span style={{ ...rp, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
                      {cap(req.priority)}
                    </span>
                    <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                      {req.assigned_volunteer}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}