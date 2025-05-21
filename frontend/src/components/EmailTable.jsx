import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { retryEmail } from "../api/emailApi";

export default function EmailTable({ emails }) {
  const [status, setStatus] = useState("all");

  // Filter by status
  const filtered = emails.filter(email =>
    status === "all" ? true : email.status === status
  );
  const sorted = filtered.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="px-4 py-2">Recipient</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Scheduled Time (UTC)</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Send At</th>
              <th className="px-4 py-2">Error</th>
              <th className="px-4 py-2">Created At (UTC)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No emails to display.
                </td>
              </tr>
            )}
            {sorted.map(email => (
              <tr key={email._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{email.to}</td>
                <td className="px-4 py-2">{email.name}</td>
                <td className="px-4 py-2 text-sm">
                  {new Date(email.scheduledAt).toLocaleString("en-GB", { timeZone: "UTC" })}
                </td>
                <td className="text-nowrap">
                  <StatusBadge status={email.status} />
                  {email.status === "failed" && (
                    <button
                      className="ml-2 px-2 py-1 cursor-pointer bg-red-200 text-red-800 rounded text-xs hover:bg-red-300"
                      onClick={async () => {
                        try {
                          await retryEmail(email._id);
                          alert("Retry scheduled.. Will attempt in up to 1 minute.");
                          // Refresh emails list here if needed
                        } catch (err) {
                          alert("Retry failed: " + err.message);
                        }
                      }}
                    >
                      Retry
                    </button>
                  )}

                </td>
                <td className="px-4 py-2 text-sm">
                  {email.sentAt
                    ? new Date(email.sentAt).toLocaleString("en-GB", { timeZone: "UTC" })
                    : "-"}
                </td>
                <td className="px-4 py-2 text-xs text-red-500">
                  {email.error || ""}
                </td>
                <td className="px-4 py-2 text-sm">
                  {email.createdAt
                    ? new Date(email.createdAt).toLocaleString("en-GB", { timeZone: "UTC" })
                    : "-"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
