const API_URL = import.meta.env.VITE_API_URL;

export async function uploadCSV(formData) {
  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function scheduleEmails(recipients, subject, body) {
  const res = await fetch(`${API_URL}/emails/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipients, subject, body }),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export async function fetchEmails(status = "all") {
  const res = await fetch(`${API_URL}/emails?status=${status}`);
  return res.json();
}

export async function fetchQuota() {
  const res = await fetch(`${API_URL}/emails/quota`);
  if (!res.ok) throw new Error("Failed to fetch quota");
  return res.json();
}

export async function retryEmail(id) {
  const res = await fetch(`${API_URL}/emails/retry/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Retry failed");
  return res.json();
}