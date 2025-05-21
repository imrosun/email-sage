import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import EmailComposer from "../components/EmailComposer";
import { uploadCSV, scheduleEmails, fetchQuota } from "../api/emailApi";

export default function Home() {
  const [recipients, setRecipients] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [message, setMessage] = useState("");
  const [quota, setQuota] = useState(null);

  // Fetch quota and update state
  const updateQuota = async () => {
    try {
      const data = await fetchQuota();
      setQuota(data);
    } catch {
      setQuota({ quota: 100, sentCount: 0, left: 100 });
    }
  };

  // When CSV is uploaded, parse and store valid recipients
  const handleCSVUpload = async (file) => {
    const formData = new FormData();
    formData.append("csv", file);
    const result = await uploadCSV(formData);

    // Assume result.parsed is an array of { email, name, scheduled_send_time, error }
    const valid = result.parsed.filter(r => !r.error);
    setRecipients(valid.map(r => ({
      email: r.email,
      name: r.name,
      scheduled_send_time: r.scheduled_send_time
    })));
    setCsvErrors(result.parsed.filter(r => r.error));
    setMessage(`Parsed ${valid.length} valid recipients.`);
  };

  // On schedule, send recipients + subject/body to backend
  const handleSchedule = async (subject, body) => {
    try {
      const result = await scheduleEmails(recipients, subject, body);
      setMessage(
        `Scheduled for ${result.scheduledCount} recipients. ${result.errors?.length || 0} errors.`
      );
      updateQuota();
    } catch (err) {
      setMessage("Failed to schedule emails");
    }
  };

  return (
    <div>
      <div className="bg-blue-50 text-blue-800 p-2 rounded mb-4 text-center font-semibold">
        SendGrid FreeTier: {quota ? `${quota.left} emails left today (${quota.sentCount} sent, ${quota.quota} total)` : "Loading..."}
        <button
          onClick={updateQuota}
          className="ml-4 px-2 py-1 bg-blue-200 rounded text-blue-800 hover:bg-blue-300 cursor-pointer"
        >
          Refresh
        </button>
      </div>
      <h2 className="text-xl font-semibold mb-2">Upload Contacts</h2>
      <CSVUploader onUpload={handleCSVUpload} />
      {csvErrors.length > 0 && (
        <div className="mt-2 text-red-700">
          <b>CSV Errors:</b>
          <ul>
            {csvErrors.map((err, i) => (
              <li key={i}>
                Row {err.row}: {err.error}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h2 className="text-xl font-semibold mt-8 mb-2">Compose Email</h2>
      <EmailComposer onSchedule={handleSchedule} />
      {message && <div className="mt-2 text-blue-700">{message} 
        <div className="mt-1 text-yellow-600">
          <b>Tip:</b> Please check your spam folder for email!
      </div>
      </div>}
    </div>
  );
}
