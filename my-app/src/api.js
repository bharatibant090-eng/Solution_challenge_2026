const BASE_URL = "http://localhost:5000";

export async function submitRequest(text) {
  const response = await fetch(`${BASE_URL}/submit-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export async function getRequests() {
  const response = await fetch(`${BASE_URL}/get-requests`);
  if (!response.ok) throw new Error("Failed to fetch requests");
  return response.json();
}