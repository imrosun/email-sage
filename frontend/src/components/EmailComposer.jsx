import React, { useState } from "react";

export default function EmailComposer({ onSchedule }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSchedule(subject, body);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-4 space-y-4"
    >
      <div>
        <label className="block font-medium mb-1">Subject:</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Body:</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <small className="text-gray-500">
          Use <code>{"{{name}}"}</code> for personalization.
        </small>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
      >
        Schedule Emails
      </button>
    </form>
  );
}
